import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  TenantDocument,
  TenantPlan,
} from './schemas/tenant.schema';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  private toTenantDocument(record: {
    id: string;
    name: string;
    slug: string;
    cnpj: string | null;
    phone: string | null;
    address: string | null;
    plan: string;
    isActive: boolean;
    ownerId: string | null;
    settings: Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
  }): TenantDocument {
    return {
      ...record,
      _id: record.id,
      plan: record.plan as TenantPlan,
      settings:
        record.settings && typeof record.settings === 'object'
          ? (record.settings as Record<string, unknown>)
          : {},
    };
  }

  async create(
    dto: CreateTenantDto,
    ownerId?: string,
  ): Promise<TenantDocument> {
    let slug = slugify(dto.name);
    const existing = await this.prisma.tenant.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const created = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        slug,
        cnpj: dto.cnpj ?? null,
        phone: dto.phone ?? null,
        address: dto.address ?? null,
        ownerId: ownerId ?? null,
        plan: dto.plan ?? TenantPlan.TRIAL,
        isActive: true,
        settings: {},
      },
    });

    return this.toTenantDocument(created);
  }

  async findById(id: string): Promise<TenantDocument> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new NotFoundException('Estabelecimento não encontrado.');
    }
    return this.toTenantDocument(tenant);
  }

  async findBySlug(slug: string): Promise<TenantDocument | null> {
    const tenant = await this.prisma.tenant.findFirst({
      where: { slug, isActive: true },
    });
    return tenant ? this.toTenantDocument(tenant) : null;
  }

  async update(id: string, dto: UpdateTenantDto): Promise<TenantDocument> {
    const existing = await this.prisma.tenant.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Estabelecimento não encontrado.');
    }

    const updated = await this.prisma.tenant.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.cnpj !== undefined ? { cnpj: dto.cnpj } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.address !== undefined ? { address: dto.address } : {}),
        ...(dto.plan !== undefined ? { plan: dto.plan } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.ownerId !== undefined
          ? { ownerId: dto.ownerId ? String(dto.ownerId) : null }
          : {}),
        ...(dto.settings !== undefined
          ? { settings: dto.settings as Prisma.InputJsonValue }
          : {}),
      },
    });

    return this.toTenantDocument(updated);
  }

  async getOrCreateDefault(): Promise<TenantDocument> {
    let defaultTenant = await this.prisma.tenant.findFirst();
    if (!defaultTenant) {
      defaultTenant = await this.prisma.tenant.create({
        data: {
          name: 'MeuBotequim Matriz',
          slug: 'meubotequim-matriz',
          plan: TenantPlan.PRO,
          isActive: true,
          settings: {
            primaryColor: '#C87A5B',
            branchName: 'Salão Central',
          },
        },
      });
    }
    return this.toTenantDocument(defaultTenant);
  }
}
