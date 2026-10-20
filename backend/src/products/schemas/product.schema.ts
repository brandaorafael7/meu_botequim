import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Tenant', index: true, default: null })
  tenantId?: Types.ObjectId;

  @Prop({ trim: true })
  brand?: string;

  @Prop({ trim: true })
  barcode?: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, default: null })
  category: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  dayPrice: number;

  @Prop({ default: 0, min: 0 })
  nightPrice?: number; // Preço Noturno para vendas pós meia-noite (00h às 06h)

  @Prop({ default: 0, min: 0 })
  eventPrice: number;

  @Prop({ default: 0, min: 0 })
  costPrice: number;

  @Prop({ required: true, min: 0, default: 0 })
  currentStock: number;

  @Prop({ default: 5, min: 0 })
  minStock: number;

  @Prop({ default: 'un', trim: true })
  unit: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
