import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Cervejas' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Bebidas alcoólicas fermentadas' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '6a8793259eb11f3117cb4c10' })
  @IsString()
  @IsOptional()
  tenantId?: string;
}
