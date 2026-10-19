import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tenant, TenantDocument, TenantPlan } from './schemas/tenant.schema';
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
  constructor(
    @InjectModel(Tenant.name)
    private readonly tenantModel: Model<TenantDocument>,
  ) {}

  async create(dto: CreateTenantDto, ownerId?: Types.ObjectId): Promise<TenantDocument> {
    let slug = slugify(dto.name);
    const existing = await this.tenantModel.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const created = new this.tenantModel({
      ...dto,
      slug,
      ownerId: ownerId || null,
      plan: dto.plan || TenantPlan.TRIAL,
      isActive: true,
    });

    return created.save();
  }

  async findById(id: string | Types.ObjectId): Promise<TenantDocument> {
    const tenant = await this.tenantModel.findById(id).exec();
    if (!tenant) {
      throw new NotFoundException('Estabelecimento não encontrado.');
    }
    return tenant;
  }

  async findBySlug(slug: string): Promise<TenantDocument | null> {
    return this.tenantModel.findOne({ slug, isActive: true }).exec();
  }

  async update(
    id: string | Types.ObjectId,
    dto: UpdateTenantDto,
  ): Promise<TenantDocument> {
    const updated = await this.tenantModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Estabelecimento não encontrado.');
    }
    return updated;
  }

  async getOrCreateDefault(): Promise<TenantDocument> {
    let defaultTenant = await this.tenantModel.findOne({}).exec();
    if (!defaultTenant) {
      defaultTenant = await this.tenantModel.create({
        name: 'MeuBotequim Matriz',
        slug: 'meubotequim-matriz',
        plan: TenantPlan.PRO,
        isActive: true,
        settings: {
          primaryColor: '#C87A5B',
          branchName: 'Salão Central',
        },
      });
    }
    return defaultTenant;
  }
}
