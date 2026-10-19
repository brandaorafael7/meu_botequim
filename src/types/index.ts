export type StockStatus = 'CRITICO' | 'ALERTA' | 'NORMAL';

export interface ReplenishmentProduct {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  costPrice: number;
  status: StockStatus;
  suggestedOrder?: number;
  brand?: string;
  dayPrice?: number;
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  badge?: {
    text: string;
    variant: 'danger' | 'warning' | 'success' | 'secondary';
  };
  trend?: {
    text: string;
    direction: 'up' | 'down' | 'neutral';
    positiveIsGood?: boolean;
  };
  icon: 'package-value' | 'alert-critical' | 'loss-waste' | 'projected-turnover';
}

export interface BarProfile {
  name: string;
  branch: string;
  user: {
    name: string;
    role: string;
    avatar?: string;
    initials: string;
  };
}

export interface ShoppingCartItem extends ReplenishmentProduct {
  quantityToAdd: number;
  addedAt: string;
}

export const MovementType = {
  ENTRADA: 'ENTRADA',
  SAIDA: 'SAIDA',
  PERDA: 'PERDA',
  AJUSTE: 'AJUSTE',
} as const;

export type MovementType = (typeof MovementType)[keyof typeof MovementType];

export interface StockMovement {
  _id: string;
  productId: string | { _id: string; name: string; barcode?: string; currentStock?: number };
  userId?: string | { _id: string; name: string; email?: string };
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  createdAt: string;
}

export interface CreateStockMovementDto {
  productId: string;
  type: MovementType;
  quantity: number;
  reason?: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  activeSkusCount: number;
  lowStockCount: number;
  criticalStockCount: number;
  stockValue: number;
  monthlyLossValue: number;
  monthlyLossCount: number;
  estimatedRevenue: string;
  lossRate: string;
  chartData: Array<{ dia: string; vendas: number }>;
}
