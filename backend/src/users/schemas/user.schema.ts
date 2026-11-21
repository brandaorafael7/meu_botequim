export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  BARTENDER = 'BARTENDER',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  password?: string;
  tenantId?: string | null;
  role: Role;
  phone?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = User & { password: string };
