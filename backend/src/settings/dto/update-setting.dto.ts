import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiPropertyOptional({ example: 'MeuBotequim' })
  @IsOptional()
  @IsString()
  storeName?: string;

  @ApiPropertyOptional({ example: 'https://meubotequim.com.br/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: '(11) 98765-4321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '#C87A5B' })
  @IsOptional()
  @IsString()
  primaryColor?: string;
}
