import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conectado ao PostgreSQL via Prisma ORM com sucesso.');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Não foi possível conectar ao PostgreSQL na inicialização (${msg}). Verifique a variável DATABASE_URL.`,
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
