export enum MovementType {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
  PERDA = 'PERDA',
  AJUSTE = 'AJUSTE',
}

export interface StockMovement {
  id: string;
  _id: string;
  productId:
    | string
    | {
        id: string;
        _id: string;
        name: string;
        barcode?: string | null;
        currentStock?: number;
      };
  userId?:
    | string
    | {
        id: string;
        _id: string;
        name: string;
        email?: string;
        role?: string;
      }
    | null;
  tenantId?: string | null;
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string | null;
  createdAt?: Date;
}

export type StockMovementDocument = StockMovement;
