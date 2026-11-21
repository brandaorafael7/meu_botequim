export interface Category {
  id: string;
  _id: string;
  name: string;
  tenantId?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CategoryDocument = Category;
