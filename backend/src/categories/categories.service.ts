import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    tenantId?: string,
  ): Promise<Category> {
    const filter: Record<string, unknown> = {
      name: { $regex: new RegExp(`^${createCategoryDto.name.trim()}$`, 'i') },
      isActive: true,
    };

    if (tenantId && isValidObjectId(tenantId)) {
      filter.$or = [
        { tenantId: new Types.ObjectId(tenantId) },
        { tenantId: null },
      ];
    }

    const existingCategory = await this.categoryModel.findOne(filter);
    if (existingCategory) {
      throw new ConflictException(
        'Já existe uma categoria cadastrada com esse nome.',
      );
    }

    const categoryData = {
      ...createCategoryDto,
      tenantId:
        tenantId && isValidObjectId(tenantId)
          ? new Types.ObjectId(tenantId)
          : null,
    };

    const createdCategory = new this.categoryModel(categoryData);
    return createdCategory.save();
  }

  async findAll(tenantId?: string): Promise<Category[]> {
    const filter: Record<string, unknown> = { isActive: true };
    if (tenantId && isValidObjectId(tenantId)) {
      filter.$or = [
        { tenantId: new Types.ObjectId(tenantId) },
        { tenantId: null },
      ];
    } else {
      filter.tenantId = null;
    }
    return this.categoryModel.find(filter).sort({ name: 1 }).exec();
  }

  async findOne(id: string, tenantId?: string): Promise<Category> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(
        'ID informado possui formato inválido para o MongoDB.',
      );
    }

    const category = await this.categoryModel.findById(id).exec();
    if (!category || !category.isActive) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    if (
      tenantId &&
      category.tenantId &&
      category.tenantId.toString() !== tenantId
    ) {
      throw new UnauthorizedException(
        'Acesso não autorizado a esta categoria.',
      );
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    tenantId?: string,
    isAdmin = false,
  ): Promise<Category> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(
        'ID informado possui formato inválido para o MongoDB.',
      );
    }

    const existing = await this.categoryModel.findById(id).exec();
    if (!existing || !existing.isActive) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    if (
      !isAdmin &&
      tenantId &&
      existing.tenantId &&
      existing.tenantId.toString() !== tenantId
    ) {
      throw new UnauthorizedException(
        'Você não tem permissão para editar esta categoria.',
      );
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    return updatedCategory;
  }

  async remove(
    id: string,
    tenantId?: string,
    isAdmin = false,
  ): Promise<{ message: string }> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(
        'ID informado possui formato inválido para o MongoDB.',
      );
    }

    const existing = await this.categoryModel.findById(id).exec();
    if (!existing || !existing.isActive) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    if (
      !isAdmin &&
      tenantId &&
      existing.tenantId &&
      existing.tenantId.toString() !== tenantId
    ) {
      throw new UnauthorizedException(
        'Você não tem permissão para remover esta categoria.',
      );
    }

    // Soft delete: apenas desativa
    await this.categoryModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    return { message: 'Categoria desativada com sucesso.' };
  }
}
