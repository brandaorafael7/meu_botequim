import { Category } from '../../categories/schemas/category.schema';

export interface Product {
  id: string;
  _id: string;
  name: string;
  tenantId?: string | null;
  brand?: string | null;
  barcode?: string | null;
  categoryId?: string | null;
  category?: Category | string | null;
  dayPrice: number;
  nightPrice?: number;
  eventPrice: number;
  costPrice: number;
  currentStock: number;
  minStock: number;
  unit: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductDocument = Product;
