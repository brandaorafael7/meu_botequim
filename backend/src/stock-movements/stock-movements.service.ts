import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import {
  MovementType,
  StockMovement,
} from './schemas/stock-movement.schema';

@Injectable()
export class StockMovementsService {
  constructor(private readonly prisma: PrismaService) {}

  private toMovementResponse(record: {
    id: string;
    productId: string;
    userId: string | null;
    tenantId: string | null;
    type: string;
    quantity: number;
    previousStock: number;
    newStock: number;
    reason: string | null;
    createdAt: Date;
    product?: {
      id: string;
      name: string;
      barcode: string | null;
      currentStock: number;
    } | null;
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    } | null;
  }): StockMovement {
    return {
      id: record.id,
      _id: record.id,
      productId: record.product
        ? {
            id: record.product.id,
            _id: record.product.id,
            name: record.product.name,
            barcode: record.product.barcode,
            currentStock: record.product.currentStock,
          }
        : record.productId,
      userId: record.user
        ? {
            id: record.user.id,
            _id: record.user.id,
            name: record.user.name,
            email: record.user.email,
            role: record.user.role,
          }
        : record.userId,
      tenantId: record.tenantId,
      type: record.type as MovementType,
      quantity: record.quantity,
      previousStock: record.previousStock,
      newStock: record.newStock,
      reason: record.reason,
      createdAt: record.createdAt,
    };
  }

  async create(
    dto: CreateStockMovementDto,
    userId?: string,
    tenantId?: string,
  ): Promise<StockMovement> {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: dto.productId },
      });

      if (!product || !product.isActive) {
        throw new NotFoundException('Produto não encontrado ou inativo.');
      }

      if (
        product.tenantId &&
        (!tenantId || product.tenantId !== tenantId)
      ) {
        throw new UnauthorizedException(
          'Você não tem permissão para movimentar estoque deste estabelecimento.',
        );
      }

      const previousStock = product.currentStock;
      let newStock = previousStock;

      switch (dto.type) {
        case MovementType.ENTRADA:
          newStock = previousStock + dto.quantity;
          break;

        case MovementType.SAIDA:
        case MovementType.PERDA:
          if (previousStock < dto.quantity) {
            throw new BadRequestException(
              `Estoque insuficiente para esta operação. Estoque atual: ${previousStock}`,
            );
          }
          newStock = previousStock - dto.quantity;
          break;

        case MovementType.AJUSTE:
          newStock = dto.quantity;
          break;

        default:
          throw new BadRequestException('Tipo de movimentação inválido.');
      }

      await tx.product.update({
        where: { id: product.id },
        data: { currentStock: newStock },
      });

      let resolvedUserId: string | null = userId ?? null;
      if (!resolvedUserId) {
        const defaultUser = await tx.user.findFirst();
        if (defaultUser) {
          resolvedUserId = defaultUser.id;
        }
      }

      const effectiveTenant = tenantId || dto.tenantId || product.tenantId || null;

      const movement = await tx.stockMovement.create({
        data: {
          productId: product.id,
          userId: resolvedUserId,
          tenantId: effectiveTenant,
          type: dto.type,
          quantity: dto.quantity,
          previousStock,
          newStock,
          reason: dto.reason ?? null,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              barcode: true,
              currentStock: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return this.toMovementResponse(movement);
    });
  }

  async findAll(tenantId?: string): Promise<StockMovement[]> {
    const whereFilter: Prisma.StockMovementWhereInput = tenantId
      ? { OR: [{ tenantId }, { tenantId: null }] }
      : { tenantId: null };

    const movements = await this.prisma.stockMovement.findMany({
      where: whereFilter,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            barcode: true,
            currentStock: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return movements.map((m) => this.toMovementResponse(m));
  }

  async findByProduct(
    productId: string,
    tenantId?: string,
  ): Promise<StockMovement[]> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    if (
      product.tenantId &&
      (!tenantId || product.tenantId !== tenantId)
    ) {
      throw new UnauthorizedException(
        'Acesso não autorizado às movimentações deste produto.',
      );
    }

    const movements = await this.prisma.stockMovement.findMany({
      where: { productId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            barcode: true,
            currentStock: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return movements.map((m) => this.toMovementResponse(m));
  }
}
