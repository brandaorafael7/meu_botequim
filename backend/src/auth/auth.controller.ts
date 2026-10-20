import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterEstablishmentDto } from './dto/register-establishment.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Máximo de 10 tentativas de login por minuto (anti brute-force)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza autenticação e retorna o JWT' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({
    status: 429,
    description: 'Muitas tentativas. Bloqueio temporário por segurança.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Máximo de 5 cadastros por minuto por IP
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova conta de usuário para equipe' })
  @ApiResponse({ status: 201, description: 'Conta criada com sucesso' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register-establishment')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Máximo de 5 novos bares por minuto por IP
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastra um novo bar/estabelecimento (SaaS Onboarding)',
  })
  @ApiResponse({
    status: 201,
    description: 'Estabelecimento e conta criados com sucesso',
  })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  registerEstablishment(@Body() dto: RegisterEstablishmentDto) {
    return this.authService.registerEstablishment(dto);
  }
}
