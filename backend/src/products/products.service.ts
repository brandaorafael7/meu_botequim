import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private toProduct(record: {
    id: string;
    name: string;
    tenantId: string | null;
    brand: string | null;
    barcode: string | null;
    categoryId: string | null;
    category?: {
      id: string;
      name: string;
      tenantId: string | null;
      description: string | null;
      isActive: boolean;
    } | null;
    dayPrice: number;
    nightPrice: number;
    eventPrice: number;
    costPrice: number;
    currentStock: number;
    minStock: number;
    unit: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return {
      ...record,
      _id: record.id,
      category: record.category
        ? { ...record.category, _id: record.category.id }
        : null,
    };
  }

  private async resolveCategoryId(
    categoryInput: string | undefined,
    tenantId?: string,
  ): Promise<string | null> {
    if (!categoryInput || !categoryInput.trim()) {
      return null;
    }

    const trimmed = categoryInput.trim();
    const existingById = await this.prisma.category.findUnique({
      where: { id: trimmed },
    });

    if (existingById && existingById.isActive) {
      await this.categoriesService.findOne(trimmed, tenantId);
      return existingById.id;
    }

    const categoryDoc = await this.categoriesService.findOrCreateByName(
      trimmed,
      tenantId,
    );
    return categoryDoc.id;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const resolvedCategoryId = await this.resolveCategoryId(
      createProductDto.category,
      createProductDto.tenantId,
    );

    const created = await this.prisma.product.create({
      data: {
        name: createProductDto.name.trim(),
        brand: createProductDto.brand?.trim() ?? null,
        barcode: createProductDto.barcode?.trim() ?? null,
        tenantId: createProductDto.tenantId ?? null,
        categoryId: resolvedCategoryId,
        dayPrice: createProductDto.dayPrice,
        nightPrice: createProductDto.nightPrice ?? 0,
        eventPrice: createProductDto.eventPrice ?? 0,
        costPrice: createProductDto.costPrice ?? 0,
        currentStock: createProductDto.currentStock,
        minStock: createProductDto.minStock ?? 5,
        unit: createProductDto.unit?.trim() || 'un',
        isActive: true,
      },
      include: { category: true },
    });

    return this.toProduct(created);
  }

  async findAll(tenantId?: string): Promise<Product[]> {
    const whereFilter: Prisma.ProductWhereInput = {
      isActive: true,
      ...(tenantId
        ? { OR: [{ tenantId }, { tenantId: null }] }
        : { tenantId: null }),
    };

    const products = await this.prisma.product.findMany({
      where: whereFilter,
      include: { category: true },
      orderBy: { name: 'asc' },
    });

    return products.map((p) => this.toProduct(p));
  }

  async getReplenishmentList(tenantId?: string) {
    const whereFilter: Prisma.ProductWhereInput = {
      isActive: true,
      ...(tenantId
        ? { OR: [{ tenantId }, { tenantId: null }] }
        : { tenantId: null }),
    };

    const products = await this.prisma.product.findMany({
      where: whereFilter,
      include: { category: true },
      orderBy: { currentStock: 'asc' },
    });

    return products.map((prod) => {
      let status: 'CRITICO' | 'ALERTA' | 'NORMAL' = 'NORMAL';
      if (
        prod.currentStock <= Math.floor(prod.minStock * 0.5) ||
        prod.currentStock <= 2
      ) {
        status = 'CRITICO';
      } else if (prod.currentStock <= prod.minStock) {
        status = 'ALERTA';
      }

      const suggestedOrder = Math.max(0, prod.minStock * 2 - prod.currentStock);
      const categoryName = prod.category?.name || 'Geral';

      return {
        id: prod.id,
        name: prod.name,
        brand: prod.brand || '',
        category: categoryName,
        currentStock: prod.currentStock,
        minStock: prod.minStock,
        unit: prod.unit || 'un',
        costPrice: prod.costPrice || 0,
        dayPrice: prod.dayPrice || 0,
        nightPrice:
          prod.nightPrice && prod.nightPrice > 0
            ? prod.nightPrice
            : prod.eventPrice && prod.eventPrice > 0
              ? prod.eventPrice
              : Number(((prod.dayPrice || 0) * 1.2).toFixed(2)),
        status,
        suggestedOrder,
      };
    });
  }

  async findOne(id: string, tenantId?: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    if (
      product.tenantId &&
      (!tenantId || product.tenantId !== tenantId)
    ) {
      throw new UnauthorizedException('Acesso não autorizado a este produto.');
    }

    return this.toProduct(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    tenantId?: string,
    isAdmin = false,
  ): Promise<Product> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct || !existingProduct.isActive) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    if (
      !isAdmin &&
      (!existingProduct.tenantId ||
        !tenantId ||
        existingProduct.tenantId !== tenantId)
    ) {
      throw new UnauthorizedException(
        'Você não tem permissão para editar este produto.',
      );
    }

    let resolvedCategoryId: string | null | undefined = undefined;
    if (updateProductDto.category !== undefined) {
      resolvedCategoryId = await this.resolveCategoryId(
        updateProductDto.category,
        tenantId,
      );
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...(updateProductDto.name !== undefined
          ? { name: updateProductDto.name.trim() }
          : {}),
        ...(updateProductDto.brand !== undefined
          ? { brand: updateProductDto.brand }
          : {}),
        ...(updateProductDto.barcode !== undefined
          ? { barcode: updateProductDto.barcode }
          : {}),
        ...(resolvedCategoryId !== undefined
          ? { categoryId: resolvedCategoryId }
          : {}),
        ...(updateProductDto.dayPrice !== undefined
          ? { dayPrice: updateProductDto.dayPrice }
          : {}),
        ...(updateProductDto.nightPrice !== undefined
          ? { nightPrice: updateProductDto.nightPrice }
          : {}),
        ...(updateProductDto.eventPrice !== undefined
          ? { eventPrice: updateProductDto.eventPrice }
          : {}),
        ...(updateProductDto.costPrice !== undefined
          ? { costPrice: updateProductDto.costPrice }
          : {}),
        ...(updateProductDto.currentStock !== undefined
          ? { currentStock: updateProductDto.currentStock }
          : {}),
        ...(updateProductDto.minStock !== undefined
          ? { minStock: updateProductDto.minStock }
          : {}),
        ...(updateProductDto.unit !== undefined
          ? { unit: updateProductDto.unit }
          : {}),
      },
      include: { category: true },
    });

    return this.toProduct(updatedProduct);
  }

  async remove(
    id: string,
    tenantId?: string,
    isAdmin = false,
  ): Promise<{ message: string }> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct || !existingProduct.isActive) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    if (
      !isAdmin &&
      (!existingProduct.tenantId ||
        !tenantId ||
        existingProduct.tenantId !== tenantId)
    ) {
      throw new UnauthorizedException(
        'Você não tem permissão para remover este produto.',
      );
    }

    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Produto desativado com sucesso.' };
  }

  async findLowStock(tenantId?: string): Promise<Product[]> {
    const allActive = await this.findAll(tenantId);
    return allActive
      .filter((p) => p.currentStock <= p.minStock)
      .sort((a, b) => a.currentStock - b.currentStock);
  }
}
