import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StoreSetting } from './schemas/store-setting.schema';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private toSetting(record: {
    id: string;
    storeName: string;
    tenantId: string | null;
    logoUrl: string | null;
    phone: string | null;
    primaryColor: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): StoreSetting {
    return {
      ...record,
      _id: record.id,
    };
  }

  async getSettings(): Promise<StoreSetting> {
    let settings = await this.prisma.storeSetting.findFirst();
    if (!settings) {
      settings = await this.prisma.storeSetting.create({
        data: {
          storeName: 'MeuBotequim',
          primaryColor: '#C87A5B',
          phone: '(11) 98765-4321',
        },
      });
    }
    return this.toSetting(settings);
  }

  async updateSettings(data: Partial<StoreSetting>): Promise<StoreSetting> {
    const existing = await this.prisma.storeSetting.findFirst();
    if (!existing) {
      const created = await this.prisma.storeSetting.create({
        data: {
          storeName: data.storeName || 'MeuBotequim',
          logoUrl: data.logoUrl ?? null,
          phone: data.phone ?? null,
          primaryColor: data.primaryColor || '#C87A5B',
        },
      });
      return this.toSetting(created);
    }

    const updated = await this.prisma.storeSetting.update({
      where: { id: existing.id },
      data: {
        ...(data.storeName !== undefined ? { storeName: data.storeName } : {}),
        ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.primaryColor !== undefined
          ? { primaryColor: data.primaryColor }
          : {}),
      },
    });
    return this.toSetting(updated);
  }
}
