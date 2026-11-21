import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export type BlipIntent = 'CONSULTA_ESTOQUE' | 'TRANSBORDO_HUMANO' | 'GERAL';

export class BlipWebhookDto {
  @ApiProperty({
    description: 'Identificador único do usuário no Blip (ex: 5511999999999@wa.gw.msging.net)',
    example: '5511999999999@wa.gw.msging.net',
  })
  @IsString()
  @IsNotEmpty({ message: 'O campo userId é obrigatório.' })
  userId: string;

  @ApiProperty({
    description: 'Mensagem de texto enviada pelo cliente no Blip Chat / WhatsApp',
    example: 'Vocês têm cerveja Heineken gelada hoje? Quanto tá?',
  })
  @IsString()
  @IsNotEmpty({ message: 'O campo message é obrigatório.' })
  message: string;

  @ApiPropertyOptional({
    description: 'ID do estabelecimento (tenantId) para filtrar o estoque específico do bar',
    example: '6713f1a2c4b5e6f7a8b9c0d1',
  })
  @IsOptional()
  @IsString()
  establishmentId?: string;
}

export class BlipWebhookResponseDto {
  @ApiProperty({
    description: 'Texto de resposta gerado pelo assistente virtual para exibição no Blip',
    example: 'Temos sim! A Cerveja Heineken Long Neck 330ml está disponível por R$ 12,00 (diurno) / R$ 15,00 (noturno).',
  })
  replyText: string;

  @ApiProperty({
    description: 'Intenção classificada para roteamento de blocos no Builder do Blip',
    enum: ['CONSULTA_ESTOQUE', 'TRANSBORDO_HUMANO', 'GERAL'],
    example: 'CONSULTA_ESTOQUE',
  })
  intent: BlipIntent;
}
