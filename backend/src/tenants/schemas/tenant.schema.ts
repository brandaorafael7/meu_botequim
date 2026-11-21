export enum TenantPlan {
  TRIAL = 'TRIAL',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface Tenant {
  id: string;
  _id: string;
  name: string;
  slug: string;
  cnpj?: string | null;
  phone?: string | null;
  address?: string | null;
  plan: TenantPlan;
  isActive: boolean;
  ownerId?: string | null;
  settings?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TenantDocument = Tenant;
