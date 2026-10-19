import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  BARTENDER = 'BARTENDER',
  ADMIN = 'ADMIN', // Compatibilidade com base legada
  EMPLOYEE = 'EMPLOYEE', // Compatibilidade com base legada
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, trim: true })
  name!: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: Types.ObjectId, ref: 'Tenant', default: null, index: true })
  tenantId?: Types.ObjectId;

  @Prop({ type: String, enum: Role, default: Role.BARTENDER })
  role!: Role;

  @Prop({ type: String, trim: true, default: null })
  phone?: string;

  @Prop({ type: String, trim: true, default: null })
  avatarUrl?: string;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
