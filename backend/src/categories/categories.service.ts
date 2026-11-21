import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private toCategory(record: {
    id: string;
    name: string;
    tenantId: string | null;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): CategoryDocument {
    return {
      ...record,
      _id: record.id,
    };
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    tenantId?: string,
  ): Promise<CategoryDocument> {
    const cleanName = createCategoryDto.name.trim();
    const whereFilter: Prisma.CategoryWhereInput = {
      name: { equals: cleanName, mode: 'insensitive' },
      isActive: true,
      ...(tenantId
        ? { OR: [{ tenantId }, { tenantId: null }] }
        : { tenantId: null }),
    };

    const existingCategory = await this.prisma.category.findFirst({
      where: whereFilter,
    });
    if (existingCategory) {
      throw new ConflictException(
        'Já existe uma categoria cadastrada com esse nome.',
      );
    }

    const created = await this.prisma.category.create({
      data: {
        name: cleanName,
        description: createCategoryDto.description ?? null,
        tenantId: tenantId ?? null,
        isActive: true,
      },
    });

    return this.toCategory(created);
  }

  async findOrCreateByName(
    name: string,
    tenantId?: string,
  ): Promise<CategoryDocument> {
    const cleanName = name.trim();
    const whereFilter: Prisma.CategoryWhereInput = {
      name: { equals: cleanName, mode: 'insensitive' },
      isActive: true,
      ...(tenantId
        ? { OR: [{ tenantId }, { tenantId: null }] }
        : { tenantId: null }),
    };

    const existing = await this.prisma.category.findFirst({
      where: whereFilter,
    });
    if (existing) {
      return this.toCategory(existing);
    }

    const created = await this.prisma.category.create({
      data: {
        name: cleanName,
        tenantId: tenantId ?? null,
        isActive: true,
      },
    });
    return this.toCategory(created);
  }

  async findAll(tenantId?: string): Promise<Category[]> {
    const whereFilter: Prisma.CategoryWhereInput = {
      isActive: true,
      ...(tenantId
        ? { OR: [{ tenantId }, { tenantId: null }] }
        : { tenantId: null }),
    };

    const list = await this.prisma.category.findMany({
      where: whereFilter,
      orderBy: { name: 'asc' },
    });
    return list.map((c) => this.toCategory(c));
  }

  async findOne(id: string, tenantId?: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category || !category.isActive) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    if (
      category.tenantId &&
      (!tenantId || category.tenantId !== tenantId)
    ) {
      throw new UnauthorizedException(
        'Acesso não autorizado a esta categoria.',
      );
    }

    return this.toCategory(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    tenantId?: string,
    isAdmin = false,
  ): Promise<Category> {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing || !existing.isActive) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    if (
      !isAdmin &&
      (!existing.tenantId || !tenantId || existing.tenantId !== tenantId)
    ) {
      throw new UnauthorizedException(
        'Você não tem permissão para editar esta categoria.',
      );
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        ...(updateCategoryDto.name !== undefined
          ? { name: updateCategoryDto.name.trim() }
          : {}),
        ...(updateCategoryDto.description !== undefined
          ? { description: updateCategoryDto.description }
          : {}),
      },
    });

    return this.toCategory(updated);
  }

  async remove(
    id: string,
    tenantId?: string,
    isAdmin = false,
  ): Promise<{ message: string }> {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing || !existing.isActive) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    if (
      !isAdmin &&
      (!existing.tenantId || !tenantId || existing.tenantId !== tenantId)
    ) {
      throw new UnauthorizedException(
        'Você não tem permissão para remover esta categoria.',
      );
    }

    await this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Categoria desativada com sucesso.' };
  }
}
