import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import {
  MovementType,
  StockMovement,
  StockMovementDocument,
} from './schemas/stock-movement.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectModel(StockMovement.name)
    private readonly stockMovementModel: Model<StockMovementDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(
    dto: CreateStockMovementDto,
    userId?: string,
    tenantId?: string,
  ): Promise<StockMovement> {
    if (!isValidObjectId(dto.productId)) {
      throw new BadRequestException('ID de produto inválido.');
    }

    const product = await this.productModel.findById(dto.productId);
    if (!product || !product.isActive) {
      throw new NotFoundException('Produto não encontrado ou inativo.');
    }

    // Se o usuário está logado em um bar, previne movimentar produtos de outros bares
    if (
      tenantId &&
      product.tenantId &&
      product.tenantId.toString() !== tenantId
    ) {
      throw new UnauthorizedException(
        'Você não tem permissão para movimentar estoque deste estabelecimento.',
      );
    }

    const previousStock = product.currentStock;
    let newStock = previousStock;

    switch (dto.type) {
      case MovementType.ENTRADA:
        newStock += dto.quantity;
        break;

      case MovementType.SAIDA:
      case MovementType.PERDA:
        if (previousStock < dto.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para esta operação. Estoque atual: ${previousStock}`,
          );
        }
        newStock -= dto.quantity;
        break;

      case MovementType.AJUSTE:
        newStock = dto.quantity;
        break;

      default:
        throw new BadRequestException('Tipo de movimentação inválido.');
    }

    product.currentStock = newStock;
    await product.save();

    let userObjectId: Types.ObjectId | null = null;
    if (userId && isValidObjectId(userId)) {
      userObjectId = new Types.ObjectId(userId);
    } else {
      const defaultUser = await this.userModel.findOne().exec();
      if (defaultUser) {
        userObjectId = defaultUser._id;
      }
    }

    const effectiveTenant = tenantId || dto.tenantId;
    const tenantObjectId =
      effectiveTenant && isValidObjectId(effectiveTenant)
        ? new Types.ObjectId(effectiveTenant)
        : product.tenantId || null;

    const movement = new this.stockMovementModel({
      productId: new Types.ObjectId(dto.productId),
      userId: userObjectId,
      tenantId: tenantObjectId,
      type: dto.type,
      quantity: dto.quantity,
      previousStock,
      newStock,
      reason: dto.reason,
    });

    return movement.save();
  }

  async findAll(tenantId?: string): Promise<StockMovement[]> {
    const filter: Record<string, unknown> = {};
    if (tenantId && isValidObjectId(tenantId)) {
      filter.$or = [
        { tenantId: new Types.ObjectId(tenantId) },
        { tenantId: null },
      ];
    } else {
      // Isolamento multi-tenant: chamadas não autenticadas só veem movimentações de demonstração
      filter.tenantId = null;
    }

    return this.stockMovementModel
      .find(filter)
      .populate('productId', 'name barcode currentStock')
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByProduct(
    productId: string,
    tenantId?: string,
  ): Promise<StockMovement[]> {
    if (!isValidObjectId(productId)) {
      throw new BadRequestException('ID de produto inválido.');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    if (
      tenantId &&
      product.tenantId &&
      product.tenantId.toString() !== tenantId
    ) {
      throw new UnauthorizedException(
        'Acesso não autorizado às movimentações deste produto.',
      );
    }

    return this.stockMovementModel
      .find({ productId: new Types.ObjectId(productId) })
      .populate('productId', 'name')
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .exec();
  }
}
