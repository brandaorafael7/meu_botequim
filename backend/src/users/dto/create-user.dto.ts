import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name!: string;

  @ApiProperty({ example: 'joao@bar.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password!: string;

  @ApiPropertyOptional({ enum: Role, default: Role.BARTENDER })
  @IsOptional()
  @IsEnum(Role, {
    message: 'A role deve ser OWNER, MANAGER, BARTENDER, ADMIN ou EMPLOYEE.',
  })
  role?: Role;

  @ApiPropertyOptional({ example: '6a8793259eb11f3117cb4c10' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsOptional()
  @IsString()
  phone?: string;
}
