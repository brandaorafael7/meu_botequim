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
import { Role } from '../users/schemas/user.schema';

export interface SafeUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: Role;
  tenantId?: string | null;
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
        return {
          id: user.id,
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          isActive: user.isActive,
        };
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
        .findById(user.tenantId)
        .catch(() => null);
      if (found) {
        tenant = found;
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: tenant.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: tenant.id,
      },
      tenant: {
        id: tenant.id,
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

    const createdUser = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: Role.OWNER,
      tenantId: tenant.id,
      phone: dto.phone,
    });

    await this.tenantsService.update(tenant.id, {
      ownerId: createdUser.id,
    });

    const payload = {
      sub: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
      tenantId: tenant.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        tenantId: tenant.id,
      },
      tenant: {
        id: tenant.id,
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

    const validAdminKey = process.env.ADMIN_REGISTRATION_KEY;
    const role =
      validAdminKey && dto.adminKey && dto.adminKey === validAdminKey
        ? Role.ADMIN
        : Role.EMPLOYEE;

    const newUser = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role,
    });

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }
}
