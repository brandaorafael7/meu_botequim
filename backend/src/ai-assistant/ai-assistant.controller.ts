import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';
import { AiAssistantService } from './ai-assistant.service';
import {
  BlipWebhookDto,
  BlipWebhookResponseDto,
} from './dto/blip-webhook.dto';

@ApiTags('webhooks / blip')
@Controller('webhooks/blip')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('chat')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Webhook oficial de integração com o Blip Builder para atendimento inteligente com IA & Function Calling',
  })
  @ApiHeader({
    name: 'x-blip-secret',
    description: 'Token secreto configurado no bloco de requisição HTTP do Blip',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Resposta processada pelo assistente virtual do MeuBotequim.',
    type: BlipWebhookResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Header x-blip-secret ausente ou inválido.',
  })
  async handleBlipChat(
    @Headers('x-blip-secret') blipSecret: string | undefined,
    @Body() dto: BlipWebhookDto,
  ): Promise<BlipWebhookResponseDto> {
    const expectedSecret = process.env.BLIP_WEBHOOK_SECRET;

    if (!expectedSecret || !blipSecret || blipSecret !== expectedSecret) {
      throw new UnauthorizedException(
        'Acesso negado: x-blip-secret inválido ou não configurado.',
      );
    }

    return this.aiAssistantService.processBlipMessage(dto);
  }

  @Post('simulate')
  @Public()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Endpoint de simulação interativa do Assistente Blip no painel de demonstração do MeuBotequim',
  })
  @ApiResponse({
    status: 200,
    description: 'Resposta simulada com consulta real ao estoque e Gemini IA.',
    type: BlipWebhookResponseDto,
  })
  async simulateBlipChat(
    @Body() dto: BlipWebhookDto,
  ): Promise<BlipWebhookResponseDto> {
    return this.aiAssistantService.processBlipMessage(dto);
  }
}
