import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterEstablishmentDto {
  @ApiProperty({
    example: 'Boteco da Esquina',
    description: 'Nome do bar ou restaurante',
  })
  @IsString({ message: 'O nome do bar deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do estabelecimento é obrigatório.' })
  establishmentName!: string;

  @ApiProperty({
    example: 'Carlos Drummond',
    description: 'Nome do responsável',
  })
  @IsString({ message: 'O nome do responsável deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do responsável é obrigatório.' })
  name!: string;

  @ApiProperty({
    example: 'carlos@boteco.com.br',
    description: 'E-mail de acesso',
  })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password!: string;

  @ApiPropertyOptional({ example: '(11) 98765-4321' })
  @IsString()
  @IsOptional()
  phone?: string;
}
