import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TenantPlan } from '../schemas/tenant.schema';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Nome do bar ou estabelecimento',
    example: 'Boteco da Esquina',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'CNPJ do estabelecimento',
    example: '12.345.678/0001-90',
  })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiPropertyOptional({
    description: 'Telefone de contato',
    example: '(11) 99999-9999',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Endereço',
    example: 'Rua das Flores, 123',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ enum: TenantPlan, default: TenantPlan.TRIAL })
  @IsEnum(TenantPlan)
  @IsOptional()
  plan?: TenantPlan;
}
