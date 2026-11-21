import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MovementType } from '../common/enums/movement-type.enum';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(tenantId?: string) {
    const productFilter: Prisma.ProductWhereInput = {
      isActive: true,
      ...(tenantId
        ? { OR: [{ tenantId }, { tenantId: null }] }
        : { tenantId: null }),
    };

    const movementTenantFilter: Prisma.StockMovementWhereInput = tenantId
      ? { OR: [{ tenantId }, { tenantId: null }] }
      : { tenantId: null };

    const allProducts = await this.prisma.product.findMany({
      where: productFilter,
    });
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

    const recentLosses = await this.prisma.stockMovement.findMany({
      where: {
        ...movementTenantFilter,
        type: MovementType.PERDA,
        createdAt: { gte: thirtyDaysAgo },
      },
      include: {
        product: {
          select: { name: true, costPrice: true },
        },
      },
    });

    let monthlyLossValue = 0;
    recentLosses.forEach((loss) => {
      const cost = loss.product?.costPrice ?? 0;
      monthlyLossValue += cost * loss.quantity;
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSales = await this.prisma.stockMovement.findMany({
      where: {
        ...movementTenantFilter,
        type: MovementType.SAIDA,
        createdAt: { gte: sevenDaysAgo },
      },
      include: {
        product: {
          select: { name: true, dayPrice: true },
        },
      },
    });

    let totalRevenue = 0;
    const daysMap: Record<string, number> = {};
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = weekDays[d.getDay()];
      daysMap[label] = 0;
    }

    recentSales.forEach((mov) => {
      if (mov.product) {
        const price = mov.product.dayPrice ?? 0;
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

    const totalMovementsCount = await this.prisma.stockMovement.count({
      where: movementTenantFilter,
    });
    const totalLossesCount = await this.prisma.stockMovement.count({
      where: {
        ...movementTenantFilter,
        type: MovementType.PERDA,
      },
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
