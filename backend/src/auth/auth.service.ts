import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterEstablishmentDto } from './dto/register-establishment.dto';
import { TenantDocument } from '../tenants/schemas/tenant.schema';
import { Role, UserDocument } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

export interface SafeUser {
  _id: { toString(): string };
  name: string;
  email: string;
  role: Role;
  tenantId?: { toString(): string };
  isActive: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tenantsService: TenantsService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<SafeUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.isActive) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const userObj = user.toObject() as unknown as SafeUser & {
          password?: string;
        };
        delete userObj.password;
        return userObj;
      }
    }
    return null;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    let tenant: TenantDocument = await this.tenantsService.getOrCreateDefault();
    if (user.tenantId) {
      const found = await this.tenantsService
        .findById(user.tenantId.toString())
        .catch(() => null);
      if (found) {
        tenant = found;
      }
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      tenantId: tenant._id.toString(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: tenant._id.toString(),
      },
      tenant: {
        id: tenant._id.toString(),
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
      },
    };
  }

  async registerEstablishment(dto: RegisterEstablishmentDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const tenant = await this.tenantsService.create({
      name: dto.establishmentName,
      phone: dto.phone,
    });

    const createdUser = (await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: Role.OWNER,
      tenantId: tenant._id.toString(),
      phone: dto.phone,
    })) as unknown as UserDocument;

    const userId = (createdUser as any)._id?.toString() || '';

    await this.tenantsService.update(tenant._id, {
      ownerId: (createdUser as any)._id as unknown as Types.ObjectId,
    });

    const payload = {
      sub: userId,
      email: createdUser.email,
      role: createdUser.role,
      tenantId: tenant._id.toString(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: userId,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        tenantId: tenant._id.toString(),
      },
      tenant: {
        id: tenant._id.toString(),
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    // Chave para definir se a conta é de Administrador
    const validAdminKey =
      process.env.ADMIN_REGISTRATION_KEY || 'bar-admin-2026';
    const role = dto.adminKey === validAdminKey ? Role.ADMIN : Role.EMPLOYEE;

    const newUser = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role,
    });

    const newUserId = String((newUser as unknown as { _id: unknown })._id);
    const payload = {
      sub: newUserId,
      email: newUser.email,
      role: newUser.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }
}
