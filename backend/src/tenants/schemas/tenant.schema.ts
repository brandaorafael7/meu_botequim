import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TenantDocument = HydratedDocument<Tenant>;

export enum TenantPlan {
  TRIAL = 'TRIAL',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  slug!: string;

  @Prop({ trim: true, default: null })
  cnpj?: string;

  @Prop({ trim: true, default: null })
  phone?: string;

  @Prop({ trim: true, default: null })
  address?: string;

  @Prop({ type: String, enum: TenantPlan, default: TenantPlan.TRIAL })
  plan!: TenantPlan;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  ownerId?: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  settings?: {
    primaryColor?: string;
    logoUrl?: string;
    branchName?: string;
  };
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
