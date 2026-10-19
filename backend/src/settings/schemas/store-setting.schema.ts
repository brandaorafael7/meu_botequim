import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StoreSettingDocument = HydratedDocument<StoreSetting>;

@Schema({ timestamps: true })
export class StoreSetting {
  @Prop({ type: String, required: true, default: 'MeuBotequim' })
  storeName!: string;

  @Prop({ type: Types.ObjectId, ref: 'Tenant', index: true, default: null })
  tenantId?: Types.ObjectId;

  @Prop({ type: String, default: null })
  logoUrl?: string;

  @Prop({ type: String, default: null })
  phone?: string;

  @Prop({ type: String, default: '#C87A5B' }) // Cor MeuBotequim Terracotta
  primaryColor?: string;
}

export const StoreSettingSchema = SchemaFactory.createForClass(StoreSetting);
