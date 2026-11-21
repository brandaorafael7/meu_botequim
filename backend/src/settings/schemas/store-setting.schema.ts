export interface StoreSetting {
  id: string;
  _id: string;
  storeName: string;
  tenantId?: string | null;
  logoUrl?: string | null;
  phone?: string | null;
  primaryColor?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StoreSettingDocument = StoreSetting;
