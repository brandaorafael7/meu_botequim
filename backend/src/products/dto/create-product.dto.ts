import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Whisky Jack Daniels 1L' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Diageo' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ example: '7891234567890' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ example: '6a8793259eb11f3117cb4c10' })
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({ example: '64b1f2e8...' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ example: 130.0, description: 'Preço Diurno / Regular' })
  @IsNumber()
  @Min(0)
  dayPrice: number;

  @ApiPropertyOptional({
    example: 155.0,
    description: 'Preço Noturno praticado pós-meia-noite (00:00 - 06:00)',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  nightPrice?: number;

  @ApiPropertyOptional({ example: 140.0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  eventPrice?: number;

  @ApiPropertyOptional({ example: 110.0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  costPrice?: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  currentStock: number;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minStock?: number;

  @ApiPropertyOptional({ example: 'un' })
  @IsString()
  @IsOptional()
  unit?: string;
}
