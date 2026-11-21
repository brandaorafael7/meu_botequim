import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role, User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private toUser(
    record: {
      id: string;
      name: string;
      email: string;
      password?: string;
      tenantId: string | null;
      role: string;
      phone: string | null;
      avatarUrl: string | null;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    },
    includePassword = false,
  ): User {
    const base: User = {
      id: record.id,
      _id: record.id,
      name: record.name,
      email: record.email,
      tenantId: record.tenantId,
      role: record.role as Role,
      phone: record.phone,
      avatarUrl: record.avatarUrl,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
    if (includePassword && record.password) {
      base.password = record.password;
    }
    return base;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const emailLower = createUserDto.email.toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email: emailLower },
    });
    if (existingUser) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const createdUser = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: emailLower,
        password: hashedPassword,
        role: (createUserDto.role as Role) || Role.BARTENDER,
        tenantId: createUserDto.tenantId ?? null,
        phone: createUserDto.phone ?? null,
      },
    });

    return this.toUser(createdUser, false);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => this.toUser(u, false));
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase(), isActive: true },
    });
    return user ? (this.toUser(user, true) as UserDocument) : null;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || !user.isActive) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return this.toUser(user, false);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Usuário desativado com sucesso.' };
  }
}
