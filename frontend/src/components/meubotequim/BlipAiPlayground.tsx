import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Database,
  Code2,
  UserCheck,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  RotateCcw,
  ArrowUpRight,
  Clock,
  Layers,
} from 'lucide-react';
import { blipAssistantService } from '../../services/api';
import { openBlipChatWidget } from '../BlipChatWidget';
import type {
  BlipIntent,
  BlipWebhookRequest,
  ReplenishmentProduct,
} from '../../types';

interface BlipAiPlaygroundProps {
  products: ReplenishmentProduct[];
  establishmentId?: string;
  establishmentName: string;
  isApiConnected: boolean;
  onShowToast?: (msg: string) => void;
}

interface SimulatedTurn {
  id: string;
  timestamp: string;
  userMessage: string;
  replyText: string;
  intent: BlipIntent;
  toolExecuted: boolean;
  searchTerm?: string;
  matchedProducts: ReplenishmentProduct[];
  latencyMs: number;
  source: 'api' | 'local-engine';
  requestPayload: BlipWebhookRequest;
}

const DEMO_SCENARIOS = [
  {
    id: 'estoque-cerveja',
    label: '1. Consultar Cervejas & Preço Noturno',
    description: 'Aciona Function Calling no estoque filtrando cervejas/chopp ativos',
    message:
      'Boa noite! Vocês têm cerveja Heineken ou Chopp gelado disponível hoje? Quanto tá?',
    expectedIntent: 'CONSULTA_ESTOQUE' as BlipIntent,
  },
  {
    id: 'estoque-destilados',
    label: '2. Consultar Gin & Destilados',
    description: 'Busca garrafas e doses disponíveis com saldo > 0 no balcão',
    message: 'Quais opções de Gin ou Vodka vocês têm disponíveis agora e qual o valor?',
    expectedIntent: 'CONSULTA_ESTOQUE' as BlipIntent,
  },
  {
    id: 'item-esgotado',
    label: '3. Produto em Falta (Sugestão Inteligente)',
    description: 'Testa a regra anti-alucinação quando o cliente pede item inexistente/zerado',
    message:
      'Vocês têm Whisky 18 anos ou Champagne importado? Se não tiver, o que me recomenda?',
    expectedIntent: 'CONSULTA_ESTOQUE' as BlipIntent,
  },
  {
    id: 'transbordo-humano',
    label: '4. Reclamação / Falar com Gerente',
    description: 'Dispara a intent TRANSBORDO_HUMANO para fila de atendimento no Blip Desk',
    message:
      'Tive um problema na cobrança da minha comanda e quero falar com o gerente ou atendente humano.',
    expectedIntent: 'TRANSBORDO_HUMANO' as BlipIntent,
  },
];

function extractSearchTermFromMessage(message: string): string {
  const normalized = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const knownTerms = [
    { keyword: 'heineken', term: 'Heineken' },
    { keyword: 'chopp', term: 'Chopp' },
    { keyword: 'original', term: 'Original' },
    { keyword: 'gin', term: 'Gin' },
    { keyword: 'tanqueray', term: 'Tanqueray' },
    { keyword: 'vodka', term: 'Vodka' },
    { keyword: 'smirnoff', term: 'Smirnoff' },
    { keyword: 'cachaca', term: 'Cachaça' },
    { keyword: 'salinas', term: 'Salinas' },
    { keyword: 'tonica', term: 'Tônica' },
    { keyword: 'limao', term: 'Limão' },
    { keyword: 'gelo', term: 'Gelo' },
    { keyword: 'whisky', term: 'Whisky' },
    { keyword: 'champagne', term: 'Champagne' },
    { keyword: 'cerveja', term: 'Cerveja' },
  ];

  const found = knownTerms.find((item) => normalized.includes(item.keyword));
  return found ? found.term : '';
}

function isHumanHandoffMessage(message: string): boolean {
  const normalized = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const keywords = [
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
    'cobranca',
    'procon',
  ];

  return keywords.some((kw) => normalized.includes(kw));
}

export const BlipAiPlayground: React.FC<BlipAiPlaygroundProps> = ({
  products,
  establishmentId,
  establishmentName,
  isApiConnected,
  onShowToast,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [userId, setUserId] = useState('5511998765432@wa.gw.msging.net');
  const [isLoading, setIsLoading] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'tool' | 'payload' | 'blip-config'>('tool');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const availableProducts = products.filter((p) => p.currentStock > 0);

  const [turns, setTurns] = useState<SimulatedTurn[]>(() => {
    const initialTerm = 'Heineken';
    const initialMatches = products
      .filter(
        (p) =>
          p.currentStock > 0 &&
          (p.name.toLowerCase().includes('heineken') ||
            p.name.toLowerCase().includes('chopp')),
      )
      .slice(0, 5);

    const samplePayload: BlipWebhookRequest = {
      userId: '5511998765432@wa.gw.msging.net',
      message:
        'Boa noite! Vocês têm cerveja Heineken ou Chopp gelado disponível hoje? Quanto tá?',
      establishmentId: establishmentId || 'demo',
    };

    const replyLines = initialMatches.map((item) => {
      const day = (item.dayPrice || 0).toFixed(2).replace('.', ',');
      const night = (
        item.nightPrice || Number(((item.dayPrice || 0) * 1.2).toFixed(2))
      )
        .toFixed(2)
        .replace('.', ',');
      return `• ${item.name}: R$ ${day} (diurno) | R$ ${night} (pós-00h) — ${item.currentStock} ${item.unit} em estoque`;
    });

    return [
      {
        id: 'turn-initial',
        timestamp: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        userMessage: samplePayload.message,
        replyText:
          replyLines.length > 0
            ? `Boa noite! Consultei o estoque do ${establishmentName} agora mesmo e temos essas opções geladas disponíveis:\n\n${replyLines.join('\n')}\n\nDeseja reservar uma mesa ou pedir alguma delas?`
            : 'Boa noite! Consultei nosso estoque e no momento estamos repondo esses itens.',
        intent: 'CONSULTA_ESTOQUE',
        toolExecuted: true,
        searchTerm: initialTerm,
        matchedProducts: initialMatches,
        latencyMs: 380,
        source: isApiConnected ? 'api' : 'local-engine',
        requestPayload: samplePayload,
      },
    ];
  });

  const activeTurn = turns[turns.length - 1];

  const handleCopy = async (text: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlock(blockId);
      onShowToast?.('Copiado para a área de transferência!');
      setTimeout(() => setCopiedBlock(null), 2500);
    } catch {
      onShowToast?.('Não foi possível copiar automaticamente.');
    }
  };

  const handleOpenOfficialWidget = () => {
    const opened = openBlipChatWidget();
    if (opened) {
      onShowToast?.('Widget oficial do Blip Chat aberto no canto inferior direito!');
    } else {
      onShowToast?.(
        'Clique no botão flutuante laranja do Blip Chat no canto inferior direito da tela.',
      );
    }
  };

  const runLocalSimulation = (
    message: string,
  ): {
    replyText: string;
    intent: BlipIntent;
    toolExecuted: boolean;
    searchTerm: string;
    matchedProducts: ReplenishmentProduct[];
  } => {
    if (isHumanHandoffMessage(message)) {
      return {
        replyText: `Compreendo perfeitamente sua solicitação. Já acionei a transferência prioritária do seu atendimento para o gerente de plantão do ${establishmentName} via Blip Desk. Em instantes alguém da nossa equipe falará com você!`,
        intent: 'TRANSBORDO_HUMANO',
        toolExecuted: false,
        searchTerm: '',
        matchedProducts: [],
      };
    }

    const searchTerm = extractSearchTermFromMessage(message);
    const activeStock = products.filter((p) => p.currentStock > 0);

    let matches: ReplenishmentProduct[] = [];
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      matches = activeStock
        .filter(
          (p) =>
            p.name.toLowerCase().includes(termLower) ||
            (p.brand && p.brand.toLowerCase().includes(termLower)) ||
            p.category.toLowerCase().includes(termLower),
        )
        .slice(0, 10);
    } else {
      matches = activeStock.slice(0, 5);
    }

    if (matches.length > 0) {
      const listText = matches
        .slice(0, 5)
        .map((item) => {
          const day = (item.dayPrice || 0).toFixed(2).replace('.', ',');
          const night = (
            item.nightPrice || Number(((item.dayPrice || 0) * 1.2).toFixed(2))
          )
            .toFixed(2)
            .replace('.', ',');
          return `• ${item.name}: R$ ${day} (diurno) / R$ ${night} (noturno) — ${item.currentStock} ${item.unit} disp.`;
        })
        .join('\n');

      return {
        replyText: `Consultei o estoque em tempo real do ${establishmentName}! Confira o que temos disponível no balcão:\n\n${listText}\n\nPosso ajudar com mais algum item do cardápio?`,
        intent: 'CONSULTA_ESTOQUE',
        toolExecuted: true,
        searchTerm: searchTerm || 'catálogo geral',
        matchedProducts: matches,
      };
    }

    // Caso o item buscado não exista ou esteja com currentStock === 0, sugere alternativas com estoque > 0
    const alternatives = activeStock.slice(0, 4);
    const altText = alternatives
      .map((item) => {
        const day = (item.dayPrice || 0).toFixed(2).replace('.', ',');
        return `• ${item.name} — R$ ${day} (${item.currentStock} ${item.unit} disp.)`;
      })
      .join('\n');

    return {
      replyText:
        alternatives.length > 0
          ? `Verifiquei no estoque do ${establishmentName} e no momento não temos "${searchTerm || message}" disponível (estoque zerado ou fora do catálogo).\n\nMas temos essas ótimas alternativas saindo agora no balcão:\n${altText}`
          : `No momento estamos sem itens disponíveis em estoque no ${establishmentName}. Deseja falar com nosso gerente?`,
      intent: 'CONSULTA_ESTOQUE',
      toolExecuted: true,
      searchTerm: searchTerm || message,
      matchedProducts: alternatives,
    };
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage ?? inputMessage).trim();
    if (!textToSend || isLoading) {
      return;
    }

    setIsLoading(true);
    if (!customMessage) {
      setInputMessage('');
    }

    const startTime = performance.now();
    const requestPayload: BlipWebhookRequest = {
      userId: userId.trim() || '5511998765432@wa.gw.msging.net',
      message: textToSend,
      establishmentId: establishmentId || 'demo',
    };

    try {
      const localResult = runLocalSimulation(textToSend);

      try {
        const apiResponse = await blipAssistantService.simulateChat(requestPayload);
        const latencyMs = Math.max(
          45,
          Math.round(performance.now() - startTime),
        );

        const newTurn: SimulatedTurn = {
          id: `turn-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          userMessage: textToSend,
          replyText: apiResponse.replyText,
          intent: apiResponse.intent,
          toolExecuted: apiResponse.intent === 'CONSULTA_ESTOQUE',
          searchTerm: localResult.searchTerm,
          matchedProducts: localResult.matchedProducts,
          latencyMs,
          source: 'api',
          requestPayload,
        };

        setTurns((prev) => [...prev, newTurn]);
      } catch {
        // Fallback determinístico sincronizado com o estado atual de `products` no Dashboard
        const latencyMs = Math.max(
          120,
          Math.round(performance.now() - startTime),
        );

        const newTurn: SimulatedTurn = {
          id: `turn-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          userMessage: textToSend,
          replyText: localResult.replyText,
          intent: localResult.intent,
          toolExecuted: localResult.toolExecuted,
          searchTerm: localResult.searchTerm,
          matchedProducts: localResult.matchedProducts,
          latencyMs,
          source: 'local-engine',
          requestPayload,
        };

        setTurns((prev) => [...prev, newTurn]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getIntentBadgeStyle = (intent: BlipIntent) => {
    switch (intent) {
      case 'CONSULTA_ESTOQUE':
        return 'bg-[#5B8A62]/15 text-[#5B8A62] border-[#5B8A62]/30';
      case 'TRANSBORDO_HUMANO':
        return 'bg-[#C24E48]/15 text-[#C24E48] border-[#C24E48]/30';
      default:
        return 'bg-[#DF9B42]/15 text-[#DF9B42] border-[#DF9B42]/30';
    }
  };

  const formattedRequestJson = JSON.stringify(
    activeTurn.requestPayload,
    null,
    2,
  );
  const formattedResponseJson = JSON.stringify(
    {
      replyText: activeTurn.replyText,
      intent: activeTurn.intent,
    },
    null,
    2,
  );

  const blipBuilderBodyTemplate = JSON.stringify(
    {
      userId: '{{contact.identity}}',
      message: '{{input.content}}',
      establishmentId: '{{contact.extras.establishmentId}}',
    },
    null,
    2,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Cabeçalho Executivo da Demonstração Blip + Gemini Function Calling */}
      <div className="rounded-2xl border border-[#EFE8DE] bg-white p-5 sm:p-6 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#EFE8DE] pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C87A5B]/15 px-3 py-1 text-xs font-bold text-[#C87A5B] border border-[#C87A5B]/30">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Blip Chat + Webhook NestJS + Gemini Function Calling</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF6F0] px-2.5 py-1 text-[11px] font-semibold text-[#70625B] border border-[#EFE8DE]">
                <Database className="h-3 w-3 text-[#5B8A62]" />
                <span>{availableProducts.length} SKUs com estoque &gt; 0</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2C221E] tracking-tight">
              Simulador & Inspector de Atendimento Inteligente — {establishmentName}
            </h2>
            <p className="text-xs text-[#70625B] max-w-3xl leading-relaxed">
              Demonstre como o assistente virtual da Blip consulta preços diurnos/noturnos e disponibilidade em tempo real no estoque do bar via{' '}
              <code className="rounded bg-[#FAF6F0] px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#2C221E] border border-[#EFE8DE]">
                consultarEstoqueDisponivel
              </code>{' '}
              e encaminha solicitações críticas para atendimento humano (<code className="rounded bg-[#FAF6F0] px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#C24E48] border border-[#EFE8DE]">TRANSBORDO_HUMANO</code>).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={handleOpenOfficialWidget}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] px-4 py-2.5 text-xs font-bold text-white shadow-soft transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Abrir Widget Oficial Blip</span>
            </button>
          </div>
        </div>

        {/* Atalhos Rápidos de Roteiro de Demonstração */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#70625B]">
              Cenários Prontos para Demonstração (Clique para Testar)
            </span>
            <span className="text-[11px] text-[#70625B]">
              Dica: Altere um preço ou estoque na aba &ldquo;Visão Geral&rdquo; e teste abaixo!
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                disabled={isLoading}
                onClick={() => void handleSendMessage(scenario.message)}
                className="group flex flex-col justify-between rounded-xl border border-[#EFE8DE] bg-[#FAF6F0]/60 hover:bg-white hover:border-[#C87A5B] p-3.5 text-left transition-all shadow-soft disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[#2C221E] group-hover:text-[#C87A5B] transition-colors">
                      {scenario.label}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#70625B] group-hover:text-[#C87A5B] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="text-[11px] text-[#70625B] line-clamp-2 mb-2.5">
                    {scenario.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#EFE8DE]">
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${getIntentBadgeStyle(
                      scenario.expectedIntent,
                    )}`}
                  >
                    {scenario.expectedIntent}
                  </span>
                  <span className="text-[10px] font-semibold text-[#C87A5B]">
                    Disparar →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Grid Principal: Chat Simulador (Esquerda) + Inspector de Function Calling & Payload (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda (7 cols): Conversa com o Assistente */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-[#EFE8DE] bg-white shadow-soft overflow-hidden">
          {/* Topo da Janela de Chat */}
          <div className="flex items-center justify-between border-b border-[#EFE8DE] bg-[#FAF6F0] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D97706] text-white font-extrabold text-xs shadow-sm">
                MB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#2C221E]">
                    Atendente Virtual MeuBotequim (Blip Bot)
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#5B8A62]/15 px-2 py-0.5 text-[10px] font-bold text-[#5B8A62] border border-[#5B8A62]/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5B8A62]" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-[#70625B] font-mono">
                  POST /webhooks/blip/chat • userId: {userId}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTurns((prev) => prev.slice(0, 1))}
              title="Limpar histórico de simulação"
              className="inline-flex items-center gap-1 rounded-lg border border-[#EFE8DE] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#70625B] hover:text-[#2C221E] hover:bg-[#FAF6F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Resetar</span>
            </button>
          </div>

          {/* Histórico de Mensagens */}
          <div className="flex-1 p-4 space-y-5 max-h-[460px] overflow-y-auto bg-[#FAF6F0]/40">
            {turns.map((turn) => (
              <div key={turn.id} className="space-y-3">
                {/* Mensagem do Cliente */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#2C221E] px-4 py-2.5 text-xs text-white shadow-soft">
                    <p className="leading-relaxed">{turn.userMessage}</p>
                    <p className="mt-1 text-[10px] text-white/60 text-right">
                      Cliente • {turn.timestamp}
                    </p>
                  </div>
                </div>

                {/* Resposta do Assistente Blip + Metadados da Execução */}
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-[#EFE8DE] bg-white p-4 shadow-soft space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFE8DE] pb-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border ${getIntentBadgeStyle(
                            turn.intent,
                          )}`}
                        >
                          {turn.intent === 'TRANSBORDO_HUMANO' ? (
                            <UserCheck className="h-3 w-3" />
                          ) : (
                            <Sparkles className="h-3 w-3" />
                          )}
                          <span>intent: {turn.intent}</span>
                        </span>

                        {turn.toolExecuted && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF6F0] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#2C221E] border border-[#EFE8DE]">
                            <Database className="h-3 w-3 text-[#C87A5B]" />
                            <span>
                              consultarEstoqueDisponivel(
                              {turn.searchTerm ? `"${turn.searchTerm}"` : ''})
                            </span>
                          </span>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] text-[#70625B] font-mono">
                        <Clock className="h-3 w-3" />
                        <span>{turn.latencyMs}ms</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#2C221E] whitespace-pre-line leading-relaxed">
                      {turn.replyText}
                    </p>

                    {turn.intent === 'TRANSBORDO_HUMANO' && (
                      <div className="rounded-xl bg-[#C24E48]/10 border border-[#C24E48]/25 p-2.5 text-[11px] text-[#C24E48] font-semibold flex items-center gap-2">
                        <UserCheck className="h-4 w-4 shrink-0" />
                        <span>
                          Ação no Blip Builder: Redirecionando bloco para fila de Atendimento Humano (Blip Desk).
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-[#EFE8DE] bg-white px-4 py-3 text-xs text-[#70625B] shadow-soft flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#C87A5B] animate-ping" />
                  <span>
                    Consultando Gemini IA &amp; estoque disponível no PostgreSQL...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input de Envio de Mensagem */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSendMessage();
            }}
            className="border-t border-[#EFE8DE] bg-white p-3.5 space-y-2.5"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite uma pergunta como cliente do bar (ex: Tem cerveja Original? Qual o preço?)..."
                className="flex-1 rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] placeholder:text-[#70625B]/70 focus:border-[#C87A5B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] px-4 py-2.5 text-xs font-bold text-white shadow-soft transition-all active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Enviar</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#70625B]">
              <div className="flex items-center gap-2">
                <label htmlFor="blip-user-id" className="font-semibold">
                  Blip Identity:
                </label>
                <input
                  id="blip-user-id"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="rounded-lg border border-[#EFE8DE] bg-[#FAF6F0] px-2 py-0.5 font-mono text-[11px] text-[#2C221E] focus:border-[#C87A5B] focus:outline-none"
                />
              </div>
              <span className="font-mono text-[10px]">
                establishmentId: <strong>{establishmentId || 'demo'}</strong>
              </span>
            </div>
          </form>
        </div>

        {/* Coluna Direita (5 cols): Inspector Técnico (Function Calling, JSON Webhook & Blip Builder) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-[#EFE8DE] bg-white shadow-soft overflow-hidden">
          {/* Abas do Inspector */}
          <div className="flex items-center border-b border-[#EFE8DE] bg-[#FAF6F0] p-1.5 gap-1">
            <button
              type="button"
              onClick={() => setInspectorTab('tool')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                inspectorTab === 'tool'
                  ? 'bg-white text-[#2C221E] shadow-soft border border-[#EFE8DE]'
                  : 'text-[#70625B] hover:text-[#2C221E]'
              }`}
            >
              <Database className="h-3.5 w-3.5 text-[#C87A5B]" />
              <span>Tool & Estoque</span>
            </button>

            <button
              type="button"
              onClick={() => setInspectorTab('payload')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                inspectorTab === 'payload'
                  ? 'bg-white text-[#2C221E] shadow-soft border border-[#EFE8DE]'
                  : 'text-[#70625B] hover:text-[#2C221E]'
              }`}
            >
              <Code2 className="h-3.5 w-3.5 text-[#C87A5B]" />
              <span>JSON Webhook</span>
            </button>

            <button
              type="button"
              onClick={() => setInspectorTab('blip-config')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                inspectorTab === 'blip-config'
                  ? 'bg-white text-[#2C221E] shadow-soft border border-[#EFE8DE]'
                  : 'text-[#70625B] hover:text-[#2C221E]'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-[#C87A5B]" />
              <span>Blip Builder</span>
            </button>
          </div>

          {/* Conteúdo da Aba Selecionada */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[520px]">
            {inspectorTab === 'tool' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0]/60 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#70625B]">
                      Última Execução de Function Calling
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${getIntentBadgeStyle(
                        activeTurn.intent,
                      )}`}
                    >
                      {activeTurn.intent}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-[#2C221E] bg-white rounded-lg border border-[#EFE8DE] p-2.5">
                    {activeTurn.toolExecuted ? (
                      <>
                        <p className="font-bold text-[#C87A5B]">
                          fn: consultarEstoqueDisponivel
                        </p>
                        <p className="text-[11px] text-[#70625B] mt-0.5">
                          args:{' '}
                          {JSON.stringify({
                            termoBusca: activeTurn.searchTerm || undefined,
                            establishmentId: establishmentId || 'demo',
                          })}
                        </p>
                        <p className="text-[11px] text-[#5B8A62] font-semibold mt-0.5">
                          query Prisma (PostgreSQL): where &#123; isActive: true,
                          currentStock: &#123; gt: 0 &#125; &#125;
                        </p>
                      </>
                    ) : (
                      <p className="text-[11px] text-[#C24E48] font-semibold">
                        Tool não acionada — Intenção de transbordo humano detectada diretamente.
                      </p>
                    )}
                  </div>
                </div>

                {/* Tabela dos itens retornados pelo estoque para a IA */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#2C221E]">
                      Itens Retornados à IA ({activeTurn.matchedProducts.length})
                    </h4>
                    <span className="text-[11px] text-[#70625B]">
                      Limite: 10 itens
                    </span>
                  </div>

                  {activeTurn.matchedProducts.length > 0 ? (
                    <div className="divide-y divide-[#EFE8DE] rounded-xl border border-[#EFE8DE] bg-white overflow-hidden">
                      {activeTurn.matchedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-3 flex items-center justify-between gap-2 text-xs hover:bg-[#FAF6F0]/50"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-[#2C221E] truncate">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-[#70625B]">
                              {prod.category} • Saldo:{' '}
                              <strong className="text-[#5B8A62]">
                                {prod.currentStock} {prod.unit}
                              </strong>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-extrabold text-[#2C221E]">
                              R$ {(prod.dayPrice || 0).toFixed(2).replace('.', ',')}
                            </p>
                            <p className="text-[10px] font-semibold text-[#C87A5B]">
                              Noite: R${' '}
                              {(
                                prod.nightPrice ||
                                Number(((prod.dayPrice || 0) * 1.2).toFixed(2))
                              )
                                .toFixed(2)
                                .replace('.', ',')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] p-4 text-center text-xs text-[#70625B]">
                      Nenhum produto consultado neste turno (fluxo de transbordo humano).
                    </div>
                  )}
                </div>
              </div>
            )}

            {inspectorTab === 'payload' && (
              <div className="space-y-4">
                {/* Request Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2C221E] flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-[#C87A5B]" />
                      <span>Request: POST /webhooks/blip/chat</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleCopy(formattedRequestJson, 'req')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C87A5B] hover:text-[#B2684B]"
                    >
                      {copiedBlock === 'req' ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copiar JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="rounded-xl border border-[#EFE8DE] bg-[#2C221E] p-3 text-[11px] font-mono text-[#FAF6F0] overflow-x-auto">
                    {formattedRequestJson}
                  </pre>
                </div>

                {/* Response Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2C221E]">
                      Response (200 OK — BlipWebhookResponseDto)
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleCopy(formattedResponseJson, 'res')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C87A5B] hover:text-[#B2684B]"
                    >
                      {copiedBlock === 'res' ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copiar JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="rounded-xl border border-[#EFE8DE] bg-[#2C221E] p-3 text-[11px] font-mono text-[#FAF6F0] overflow-x-auto whitespace-pre-wrap">
                    {formattedResponseJson}
                  </pre>
                </div>
              </div>
            )}

            {inspectorTab === 'blip-config' && (
              <div className="space-y-3.5 text-xs text-[#2C221E]">
                <div className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] p-3.5 space-y-2">
                  <p className="font-bold text-[#2C221E]">
                    Como configurar no Blip Builder (Ação HTTP):
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-[#70625B]">
                    <li>
                      Crie um bloco com Ação de Entrada{' '}
                      <strong className="text-[#2C221E]">Requisição HTTP</strong>.
                    </li>
                    <li>
                      Método: <strong className="text-[#2C221E]">POST</strong> | URL:{' '}
                      <code className="bg-white px-1 py-0.5 rounded border border-[#EFE8DE] font-mono">
                        https://seu-dominio/webhooks/blip/chat
                      </code>
                    </li>
                    <li>
                      Adicione o Header{' '}
                      <code className="bg-white px-1 py-0.5 rounded border border-[#EFE8DE] font-mono">
                        x-blip-secret: meu_botequim_blip_secret_2026
                      </code>
                    </li>
                    <li>
                      Na Condição de Saída: se{' '}
                      <code className="bg-white px-1 py-0.5 rounded border border-[#EFE8DE] font-mono">
                        respostaIa@intent
                      </code>{' '}
                      for igual a <strong className="text-[#C24E48]">TRANSBORDO_HUMANO</strong>, envie para o bloco{' '}
                      <strong className="text-[#2C221E]">Atendimento Humano</strong>.
                    </li>
                  </ol>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2C221E]">
                      Body do Bloco HTTP no Blip Builder:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        void handleCopy(blipBuilderBodyTemplate, 'blip-tpl')
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C87A5B] hover:text-[#B2684B]"
                    >
                      {copiedBlock === 'blip-tpl' ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copiar Template</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="rounded-xl border border-[#EFE8DE] bg-[#2C221E] p-3 text-[11px] font-mono text-[#FAF6F0] overflow-x-auto">
                    {blipBuilderBodyTemplate}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlipAiPlayground;
