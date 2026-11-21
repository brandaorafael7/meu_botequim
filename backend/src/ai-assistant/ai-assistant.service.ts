import { Injectable, Logger } from '@nestjs/common';
import {
  Content,
  FunctionDeclaration,
  GoogleGenAI,
  Type,
} from '@google/genai';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  BlipIntent,
  BlipWebhookDto,
  BlipWebhookResponseDto,
} from './dto/blip-webhook.dto';

interface StockItemSummary {
  nome: string;
  marca: string;
  categoria: string;
  precoDiurno: number;
  precoNoturno: number;
  quantidadeDisponivel: number;
  unidade: string;
}

@Injectable()
export class AiAssistantService {
  private readonly logger = new Logger(AiAssistantService.name);
  private readonly ai: GoogleGenAI;
  // Substituição de gemini-2.5-flash (depreciado) por gemini-4-hydrogen conforme diretrizes atuais do Gemini API SDK
  private readonly modelName = 'gemini-4-hydrogen';

  private readonly systemInstruction = `Você é o assistente virtual oficial de atendimento do MeuBotequim, um sistema inteligente para bares, botecos e restaurantes.
Regras obrigatórias de conduta:
1. NUNCA invente produtos, preços ou disponibilidade em estoque.
2. Sempre que o cliente perguntar sobre bebidas, comidas, porções, cardápio, preços ou disponibilidade de qualquer item, você DEVE obrigatoriamente invocar a ferramenta "consultarEstoqueDisponivel" antes de responder.
3. Caso o item procurado não seja encontrado ou esteja esgotado, informe educadamente e chame "consultarEstoqueDisponivel" sem filtro (ou sugira outras opções disponíveis retornadas pela ferramenta).
4. Se o cliente solicitar falar com um atendente humano, gerente, garçom ou registrar uma reclamação grave, acolha a solicitação com empatia e informe que está transferindo o atendimento para a equipe do bar imediatamente.
5. Mantenha as respostas curtas, amigáveis, diretas e formatadas para leitura rápida em chat (WhatsApp / Blip Chat), informando os preços em Reais (R$).`;

  private readonly consultarEstoqueDeclaration: FunctionDeclaration = {
    name: 'consultarEstoqueDisponivel',
    description:
      'Consulta o banco de dados PostgreSQL do MeuBotequim para listar produtos ativos com estoque disponível (> 0) e seus respectivos preços.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        termoBusca: {
          type: Type.STRING,
          description:
            'Termo opcional para buscar pelo nome ou marca do produto (ex: "Heineken", "Chopp", "Gin"). Deixe vazio para listar sugestões gerais disponíveis.',
        },
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'MISSING_GEMINI_API_KEY',
    });
  }

  private isHumanHandoffRequest(message: string): boolean {
    const normalized = message
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const handoffKeywords = [
      'atendente',
      'humano',
      'gerente',
      'garcom',
      'pessoa real',
      'falar com alguem',
      'reclamacao',
      'reclamar',
      'estorno',
      'reembolso',
      'cobranca indevida',
      'procon',
      'transferir atendimento',
    ];

    return handoffKeywords.some((keyword) => normalized.includes(keyword));
  }

  async consultarEstoqueDisponivel(
    termoBusca?: string,
    establishmentId?: string,
  ): Promise<StockItemSummary[]> {
    const andConditions: Prisma.ProductWhereInput[] = [
      { isActive: true },
      { currentStock: { gt: 0 } },
    ];

    if (establishmentId && establishmentId !== 'demo') {
      andConditions.push({
        OR: [{ tenantId: establishmentId }, { tenantId: null }],
      });
    }

    if (termoBusca && termoBusca.trim().length > 0) {
      const term = termoBusca.trim();
      andConditions.push({
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { brand: { contains: term, mode: 'insensitive' } },
        ],
      });
    }

    const products = await this.prisma.product.findMany({
      where: { AND: andConditions },
      include: { category: true },
      orderBy: [{ currentStock: 'desc' }, { name: 'asc' }],
      take: 10,
    });

    return products.map((prod) => {
      const categoryName = prod.category?.name || 'Geral';
      const nightPrice =
        prod.nightPrice && prod.nightPrice > 0
          ? prod.nightPrice
          : prod.eventPrice && prod.eventPrice > 0
            ? prod.eventPrice
            : Number(((prod.dayPrice || 0) * 1.2).toFixed(2));

      return {
        nome: prod.name,
        marca: prod.brand || '',
        categoria: categoryName,
        precoDiurno: prod.dayPrice,
        precoNoturno: nightPrice,
        quantidadeDisponivel: prod.currentStock,
        unidade: prod.unit || 'un',
      };
    });
  }

  async processBlipMessage(
    dto: BlipWebhookDto,
  ): Promise<BlipWebhookResponseDto> {
    const { userId, message, establishmentId } = dto;
    const isHandoff = this.isHumanHandoffRequest(message);

    if (!process.env.GEMINI_API_KEY) {
      this.logger.warn(
        `GEMINI_API_KEY não configurada ao processar mensagem de ${userId}.`,
      );
      if (isHandoff) {
        return {
          replyText:
            'Compreendo! Estou transferindo seu atendimento agora mesmo para o gerente de plantão do bar.',
          intent: 'TRANSBORDO_HUMANO',
        };
      }

      const items = await this.consultarEstoqueDisponivel(
        message,
        establishmentId,
      );
      if (items.length > 0) {
        const resumo = items
          .slice(0, 5)
          .map(
            (i) =>
              `• ${i.nome} - R$ ${i.precoDiurno.toFixed(2)} (${i.quantidadeDisponivel} ${i.unidade} disp.)`,
          )
          .join('\n');
        return {
          replyText: `Confira as opções disponíveis no balcão:\n${resumo}`,
          intent: 'CONSULTA_ESTOQUE',
        };
      }

      return {
        replyText:
          'Olá! Sou o assistente do MeuBotequim. No momento não encontrei esse item em estoque. Deseja falar com um atendente?',
        intent: 'GERAL',
      };
    }

    try {
      let detectedIntent: BlipIntent = isHandoff
        ? 'TRANSBORDO_HUMANO'
        : 'GERAL';

      const contents: Content[] = [
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      let response = await this.ai.models.generateContent({
        model: this.modelName,
        contents,
        config: {
          systemInstruction: this.systemInstruction,
          tools: [{ functionDeclarations: [this.consultarEstoqueDeclaration] }],
        },
      });

      let maxToolTurns = 3;
      while (
        response.functionCalls &&
        response.functionCalls.length > 0 &&
        maxToolTurns > 0
      ) {
        maxToolTurns--;
        const functionCall = response.functionCalls[0];

        if (functionCall.name === 'consultarEstoqueDisponivel') {
          if (detectedIntent !== 'TRANSBORDO_HUMANO') {
            detectedIntent = 'CONSULTA_ESTOQUE';
          }

          const args = (functionCall.args || {}) as { termoBusca?: string };
          const itensEncontrados = await this.consultarEstoqueDisponivel(
            args.termoBusca,
            establishmentId,
          );

          let alternativasDisponiveis: StockItemSummary[] = [];
          if (itensEncontrados.length === 0 && args.termoBusca) {
            alternativasDisponiveis = await this.consultarEstoqueDisponivel(
              undefined,
              establishmentId,
            );
          }

          const modelContent = response.candidates?.[0]?.content;
          if (modelContent) {
            contents.push(modelContent);
          } else {
            contents.push({
              role: 'model',
              parts: [{ functionCall }],
            });
          }

          contents.push({
            role: 'user',
            parts: [
              {
                functionResponse: {
                  id: functionCall.id,
                  name: functionCall.name,
                  response: {
                    termoPesquisado: args.termoBusca || null,
                    totalEncontrado: itensEncontrados.length,
                    itens: itensEncontrados,
                    alternativasSugeridas: alternativasDisponiveis,
                  },
                },
              },
            ],
          });

          response = await this.ai.models.generateContent({
            model: this.modelName,
            contents,
            config: {
              systemInstruction: this.systemInstruction,
              tools: [
                { functionDeclarations: [this.consultarEstoqueDeclaration] },
              ],
            },
          });
        } else {
          break;
        }
      }

      const replyText =
        response.text?.trim() ||
        'Desculpe, não consegui processar sua solicitação agora. Posso transferir para nossa equipe do balcão?';

      return {
        replyText,
        intent: detectedIntent,
      };
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Erro ao consultar Gemini para o usuário ${userId}: ${errMsg}`,
      );

      return {
        replyText:
          'Tivemos uma instabilidade rápida no nosso atendente virtual. Vou encaminhar você para um atendente humano do bar!',
        intent: 'TRANSBORDO_HUMANO',
      };
    }
  }
}
