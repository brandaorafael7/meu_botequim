import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import {
  StockMovement,
  StockMovementDocument,
} from '../stock-movements/schemas/stock-movement.schema';
import { MovementType } from '../common/enums/movement-type.enum';

interface DashboardProductSummary {
  _id: Types.ObjectId;
  name: string;
  dayPrice?: number;
}

interface PopulatedDashboardMovement {
  _id: Types.ObjectId;
  productId?: DashboardProductSummary | null;
  type: MovementType;
  quantity: number;
  createdAt: Date;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(StockMovement.name)
    private readonly movementModel: Model<StockMovementDocument>,
  ) {}

  async getMetrics(tenantId?: string) {
    const productFilter: Record<string, unknown> = { isActive: true };
    const movementTenantFilter: Record<string, unknown> = {};

    if (tenantId && Types.ObjectId.isValid(tenantId)) {
      productFilter.$or = [{ tenantId: new Types.ObjectId(tenantId) }, { tenantId: null }];
      movementTenantFilter.$or = [{ tenantId: new Types.ObjectId(tenantId) }, { tenantId: null }];
    }

    const allProducts = await this.productModel.find(productFilter).exec();
    const totalProducts = allProducts.length;

    let stockValue = 0;
    let criticalStockCount = 0;
    let lowStockCount = 0;

    allProducts.forEach((p) => {
      stockValue += (p.currentStock || 0) * (p.costPrice || 0);
      if (
        p.currentStock <= Math.floor(p.minStock * 0.5) ||
        p.currentStock <= 2
      ) {
        criticalStockCount++;
      }
      if (p.currentStock <= p.minStock) {
        lowStockCount++;
      }
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLosses = (await this.movementModel
      .find({
        type: MovementType.PERDA,
        createdAt: { $gte: thirtyDaysAgo },
        ...movementTenantFilter,
      })
      .populate('productId', 'name costPrice')
      .exec()) as unknown as { productId?: { costPrice?: number }; quantity: number }[];

    let monthlyLossValue = 0;
    recentLosses.forEach((loss) => {
      const cost = loss.productId?.costPrice ?? 0;
      monthlyLossValue += cost * loss.quantity;
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSales = (await this.movementModel
      .find({
        type: MovementType.SAIDA,
        createdAt: { $gte: sevenDaysAgo },
        ...movementTenantFilter,
      })
      .populate('productId', 'name dayPrice')
      .exec()) as unknown as PopulatedDashboardMovement[];

    let totalRevenue = 0;
    const daysMap: Record<string, number> = {};
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Inicializa os últimos 7 dias com zero
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = weekDays[d.getDay()];
      daysMap[label] = 0;
    }

    recentSales.forEach((mov) => {
      if (mov.productId) {
        const price = mov.productId.dayPrice ?? 0;
        const total = price * mov.quantity;
        totalRevenue += total;

        const dayName = weekDays[new Date(mov.createdAt).getDay()];
        if (daysMap[dayName] !== undefined) {
          daysMap[dayName] += total;
        }
      }
    });

    const chartData = Object.entries(daysMap).map(([dia, vendas]) => ({
      dia,
      vendas: Number(vendas.toFixed(2)),
    }));

    const totalMovementsCount = await this.movementModel.countDocuments();
    const totalLossesCount = await this.movementModel.countDocuments({
      type: MovementType.PERDA,
    });

    const lossRate =
      totalMovementsCount > 0
        ? ((totalLossesCount / totalMovementsCount) * 100).toFixed(1)
        : '0.0';

    return {
      totalProducts,
      activeSkusCount: totalProducts,
      lowStockCount,
      criticalStockCount,
      stockValue: Number(stockValue.toFixed(2)),
      monthlyLossValue: Number(monthlyLossValue.toFixed(2)),
      monthlyLossCount: recentLosses.length,
      estimatedRevenue: totalRevenue.toFixed(2),
      lossRate: `${lossRate}%`,
      chartData,
    };
  }
}
