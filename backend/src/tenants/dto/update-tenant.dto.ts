import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional } from 'class-validator';
import { CreateTenantDto } from './create-tenant.dto';

export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @ApiPropertyOptional({ description: 'ID do proprietário do estabelecimento' })
  @IsOptional()
  ownerId?: unknown;

  @ApiPropertyOptional({ description: 'Status de ativação do estabelecimento' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description:
      'Configurações visuais, operacionais e de preço noturno do estabelecimento',
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}
