import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  Check,
  ShieldCheck,
  DollarSign,
  TrendingDown,
  CalendarCheck,
  ShoppingBag,
  Zap,
  LogIn,
  Store,
  ChevronDown,
} from 'lucide-react';
import { AuthModal } from '../components/meubotequim/AuthModal';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  isAuthenticated: boolean;
  onLogout?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToDashboard,
  isAuthenticated,
  onLogout,
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    onNavigateToDashboard();
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C221E] font-sans selection:bg-[#C87A5B]/20 selection:text-[#2C221E] relative overflow-x-hidden">
      {/* Luz ambiente superior suave com a paleta terracota/areia do MeuBotequim */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[850px] -z-10 rounded-full blur-[130px] opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(200, 122, 91, 0.16) 0%, rgba(221, 167, 106, 0.10) 40%, transparent 70%)',
        }}
      />

      {/* 1. Header / Navbar Flutuante em Pílula (Estilo Automark com Cores MeuBotequim) */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
        <nav className="mx-auto max-w-7xl flex items-center justify-between rounded-full border border-[#EFE8DE] bg-[#FFFFFF]/90 px-4 py-2.5 backdrop-blur-md shadow-soft-md transition-all">
          {/* Logo Oficial MeuBotequim */}
          <div
            className="flex items-center gap-2.5 pl-1 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#EFE8DE] bg-[#F4EDE4] shadow-soft transition-transform hover:scale-105">
              <img
                src="/logo.png"
                alt="MeuBotequim Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-[#2C221E]">
                Meu<span className="text-[#C87A5B]">Botequim</span>
              </span>
              <span className="rounded-full bg-[#FAF6F0] px-2 py-0.5 text-[10px] font-bold text-[#70625B] border border-[#EFE8DE]">
                v2.4
              </span>
            </div>
          </div>

          {/* Menu Central Desktop */}
          <ul className="hidden md:flex items-center gap-1 rounded-full bg-[#FAF6F0] border border-[#EFE8DE] px-4 py-1 text-xs font-semibold text-[#70625B]">
            <li>
              <a
                href="#problemas"
                className="px-3 py-1.5 rounded-full hover:text-[#2C221E] hover:bg-[#FFFFFF] transition-colors"
              >
                O Desperdício
              </a>
            </li>
            <li>
              <a
                href="#recursos"
                className="px-3 py-1.5 rounded-full hover:text-[#2C221E] hover:bg-[#FFFFFF] transition-colors"
              >
                Recursos
              </a>
            </li>
            <li>
              <a
                href="#como-funciona"
                className="px-3 py-1.5 rounded-full hover:text-[#2C221E] hover:bg-[#FFFFFF] transition-colors"
              >
                Como Funciona
              </a>
            </li>
            <li>
              <a
                href="#planos"
                className="px-3 py-1.5 rounded-full hover:text-[#2C221E] hover:bg-[#FFFFFF] transition-colors"
              >
                Planos
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="px-3 py-1.5 rounded-full hover:text-[#2C221E] hover:bg-[#FFFFFF] transition-colors"
              >
                Dúvidas
              </a>
            </li>
          </ul>

          {/* Ações Direitas */}
          <div className="flex items-center gap-2.5 pr-1">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#C87A5B] hover:bg-[#B2684B] px-4 py-2 text-xs font-bold text-white shadow-soft transition-all active:scale-95"
                >
                  <Store className="h-3.5 w-3.5" />
                  <span>Acessar Painel</span>
                </button>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="text-xs text-[#70625B] hover:text-[#2C221E] px-2 py-1 transition-colors font-medium"
                  >
                    Sair
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('login')}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#70625B] hover:text-[#2C221E] px-3 py-1.5 transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5 text-[#C87A5B]" />
                  <span>Entrar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('register')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#C87A5B] hover:bg-[#B2684B] px-4 py-2 text-xs font-bold text-white shadow-soft transition-all active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Cadastrar Meu Bar</span>
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-24 space-y-24 sm:space-y-32">
        {/* 2. HERO SECTION ESTILO AUTOMARK NA PALETA MEUBOTEQUIM */}
        <section className="relative px-4 sm:px-6 lg:px-8 text-center pt-6">
          <div className="mx-auto max-w-5xl">
            {/* Pill Tag no Topo */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C87A5B]/30 bg-[#C87A5B]/10 px-4 py-1.5 text-xs font-bold text-[#C87A5B] backdrop-blur-md mb-8 animate-in fade-in slide-in-from-top-4">
              <span className="flex h-2 w-2 rounded-full bg-[#C87A5B] animate-pulse" />
              <span>O Fim do Estoque Furado no Final de Semana</span>
            </div>

            {/* Headline Principal */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#2C221E] leading-[1.15] mb-6">
              O Sistema Inteligente de Estoque para{' '}
              <span className="text-[#C87A5B] underline decoration-[#C87A5B]/30 underline-offset-8">
                Bares, Botecos & Restaurantes
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="mx-auto max-w-2xl text-sm sm:text-base lg:text-lg text-[#70625B] font-normal leading-relaxed mb-10">
              Faça a <strong>auditoria de balcão em 3 minutos</strong>, preveja as compras de Chopp para o fim de semana e elimine o prejuízo com quebras, validade e desvios.
            </p>

            {/* Botões Principais de Ação */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C87A5B] hover:bg-[#B2684B] px-7 py-4 text-sm font-extrabold text-white shadow-soft-lg active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Começar Grátis por 14 Dias</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#EFE8DE] bg-[#FFFFFF] px-6 py-4 text-sm font-bold text-[#2C221E] shadow-soft hover:bg-[#FAF6F0] active:scale-95 transition-all"
              >
                <span>Ver Demonstração do Painel</span>
                <ChevronRight className="h-4 w-4 text-[#70625B]" />
              </button>
            </div>

            {/* Badges de confiança */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#70625B] font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#5B8A62]" />
                Sem cartão de crédito
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#5B8A62]" />
                Pronto para usar em 3 minutos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#5B8A62]" />
                Multi-perfil (Dono, Gerente, Balcão)
              </span>
            </div>
          </div>

          {/* 3. MOCKUP INTERATIVO (Janela do Sistema com Paleta MeuBotequim) */}
          <div className="mt-14 mx-auto max-w-6xl">
            <div className="relative rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-3 sm:p-5 shadow-soft-lg">
              {/* Barra superior de janela de navegador */}
              <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-3 mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#C24E48]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#DF9B42]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#5B8A62]/80" />
                  <span className="ml-3 text-xs font-mono text-[#70625B] hidden sm:inline">
                    https://meubotequim.com.br/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#5B8A62]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#5B8A62] border border-[#5B8A62]/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5B8A62] animate-pulse" />
                    Turno Ativo • BeerGod - Matriz
                  </span>
                </div>
              </div>

              {/* Preview dos 4 Cards de KPI Reais do MeuBotequim */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left mb-4">
                <div className="rounded-2xl border border-[#EFE8DE] bg-[#FAF6F0]/60 p-4">
                  <div className="flex items-center justify-between text-xs text-[#70625B] mb-2">
                    <span>Valor em Estoque</span>
                    <DollarSign className="h-4 w-4 text-[#C87A5B]" />
                  </div>
                  <p className="text-xl font-extrabold text-[#2C221E]">R$ 48.720,00</p>
                  <p className="text-[11px] text-[#5B8A62] mt-1 font-semibold">+3,2% no mês</p>
                </div>

                <div className="rounded-2xl border border-[#C24E48]/30 bg-[#C24E48]/5 p-4">
                  <div className="flex items-center justify-between text-xs text-[#C24E48] mb-2">
                    <span className="font-bold">Nível Crítico</span>
                    <AlertTriangle className="h-4 w-4 text-[#C24E48]" />
                  </div>
                  <p className="text-xl font-extrabold text-[#2C221E]">5 Itens</p>
                  <p className="text-[11px] text-[#C24E48] mt-1 font-semibold">Reposição Imediata</p>
                </div>

                <div className="rounded-2xl border border-[#EFE8DE] bg-[#FAF6F0]/60 p-4">
                  <div className="flex items-center justify-between text-xs text-[#70625B] mb-2">
                    <span>Perdas & Desperdício</span>
                    <TrendingDown className="h-4 w-4 text-[#C24E48]" />
                  </div>
                  <p className="text-xl font-extrabold text-[#2C221E]">R$ 845,00</p>
                  <p className="text-[11px] text-[#5B8A62] mt-1 font-semibold">-14,5% vs. mês anterior</p>
                </div>

                <div className="rounded-2xl border border-[#DF9B42]/30 bg-[#DF9B42]/5 p-4">
                  <div className="flex items-center justify-between text-xs text-[#70625B] mb-2">
                    <span>Giro Projetado (FDS)</span>
                    <CalendarCheck className="h-4 w-4 text-[#DF9B42]" />
                  </div>
                  <p className="text-xl font-extrabold text-[#2C221E]">R$ 19.350,00</p>
                  <p className="text-[11px] text-[#DF9B42] mt-1 font-semibold">Pico de Sex/Sáb/Dom</p>
                </div>
              </div>

              {/* Mini Tabela de Alerta do Mockup */}
              <div className="rounded-2xl border border-[#EFE8DE] bg-[#FAF6F0]/30 p-3 sm:p-4 text-left">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-[#2C221E]">Atenção Prioritária para o Fim de Semana</span>
                  <button
                    type="button"
                    onClick={onNavigateToDashboard}
                    className="text-[11px] text-[#C87A5B] hover:text-[#B2684B] font-bold"
                  >
                    Abrir no modo completo →
                  </button>
                </div>
                <div className="divide-y divide-[#EFE8DE] text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#2C221E]">Chopp Pilsen 50L (Barril)</p>
                      <p className="text-[10px] text-[#70625B]">Ambev / Brahma • Chopp & Cervejas</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#C24E48] font-extrabold">1 barril (Mín: 4)</span>
                      <span className="rounded-lg bg-[#C24E48]/15 px-2 py-0.5 text-[10px] font-bold text-[#C24E48] border border-[#C24E48]/30">
                        CRÍTICO
                      </span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#2C221E]">Gin Tanqueray London Dry 750ml</p>
                      <p className="text-[10px] text-[#70625B]">Diageo • Destilados Premium</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#C24E48] font-extrabold">2 gf (Mín: 6)</span>
                      <span className="rounded-lg bg-[#C24E48]/15 px-2 py-0.5 text-[10px] font-bold text-[#C24E48] border border-[#C24E48]/30">
                        CRÍTICO
                      </span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#2C221E]">Cerveja Heineken Long Neck 330ml</p>
                      <p className="text-[10px] text-[#70625B]">Heineken • Chopp & Cervejas</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#DF9B42] font-extrabold">14 un (Mín: 48)</span>
                      <span className="rounded-lg bg-[#DF9B42]/15 px-2 py-0.5 text-[10px] font-bold text-[#DF9B42] border border-[#DF9B42]/30">
                        ALERTA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. AS DORES DO DONO DE BAR (Automark Pain-points Section) */}
        <section id="problemas" className="px-4 sm:px-6 lg:px-8 text-center scroll-mt-28">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2C221E] mb-4">
              Você ainda perde até 20% do faturamento no{' '}
              <span className="text-[#C24E48]">Ralo do Desperdício?</span>
            </h2>
            <p className="text-sm sm:text-base text-[#70625B] max-w-2xl mx-auto mb-10">
              Não adianta encher o salão e vender bem no sábado se o lucro escorre pelo balcão em compras de emergência, chopp perdido e anotações em papel.
            </p>

            {/* Grupo de Pílulas com os Problemas Clássicos de Bares */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
              {[
                'Chopp acabando no pico de sábado à noite',
                'Garrafas quebradas sem registro de avaria',
                'Furtos e desvios ocultos no balcão',
                'Planilhas confusas que ninguém preenche',
                'Compras de emergência pagando preço de varejo',
                'Limão, frutas e insumos estragando na geladeira',
                'Contagem viciada em que o bartender chuta o saldo',
              ].map((problem, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-full border border-[#C24E48]/25 bg-[#C24E48]/5 px-4 py-2 text-xs font-semibold text-[#2C221E] shadow-soft"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C24E48] shrink-0" />
                  <span>{problem}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BENTO GRID: RECURSOS ALL-IN-ONE (Automark Bento Style com Cores MeuBotequim) */}
        <section id="recursos" className="px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2C221E] mb-4">
                Substitua o caderninho e planilhas por um{' '}
                <span className="text-[#C87A5B]">Sistema Ágil e Inteligente</span>
              </h2>
              <p className="text-sm sm:text-base text-[#70625B]">
                Criado especificamente para a dinâmica veloz de bares, pubs e restaurantes. Tudo ao alcance de 2 cliques no celular.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1: Previsão de Giro FDS */}
              <div className="rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-7 shadow-soft hover:shadow-soft-md transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DF9B42]/10 text-[#DF9B42] border border-[#DF9B42]/30 mb-5 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#2C221E] mb-2">Previsão de Giro para o Fim de Semana</h3>
                <p className="text-xs text-[#70625B] leading-relaxed mb-4">
                  O MeuBotequim calcula a demanda de Sex/Sáb/Dom e te avisa exatamente quantos barris de chopp e caixas de cerveja pedir antes da quinta-feira.
                </p>
                <div className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] p-3 text-[11px] text-[#2C221E]">
                  <p className="text-[#5B8A62] font-bold">✓ Sugestão Automática de Compra</p>
                  <p className="text-[#70625B]">Evite pagar frete urgente ou ficar na mão no domingo.</p>
                </div>
              </div>

              {/* Card 2: Balanço Cego em 3 Minutos */}
              <div className="rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-7 shadow-soft hover:shadow-soft-md transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C87A5B]/10 text-[#C87A5B] border border-[#C87A5B]/30 mb-5 group-hover:scale-105 transition-transform">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#2C221E] mb-2">Balanço Cego de Balcão (3 Minutos)</h3>
                <p className="text-xs text-[#70625B] leading-relaxed mb-4">
                  O bartender conta as garrafas e barris na troca de turno sem saber o saldo do sistema. O sistema calcula a divergência exata na hora.
                </p>
                <div className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] p-3 text-[11px] text-[#2C221E]">
                  <p className="text-[#C87A5B] font-bold">✓ Acabe com contagens "maquiadas"</p>
                  <p className="text-[#70625B]">Descubra sobras ou faltas imediatamente na passagem de turno.</p>
                </div>
              </div>

              {/* Card 3: Controle de Perdas & Sangrias */}
              <div className="rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-7 shadow-soft hover:shadow-soft-md transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C24E48]/10 text-[#C24E48] border border-[#C24E48]/30 mb-5 group-hover:scale-105 transition-transform">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#2C221E] mb-2">Registro de Perdas & Descarte de Chopp</h3>
                <p className="text-xs text-[#70625B] leading-relaxed mb-4">
                  Quebrou uma garrafa de Gin ou descartou espuma da serpentina? Lance a perda em 2 toques e saiba no fim do mês o valor exato do desperdício.
                </p>
                <div className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] p-3 text-[11px] text-[#2C221E]">
                  <p className="text-[#C24E48] font-bold">✓ Motivos de quebra auditados</p>
                  <p className="text-[#70625B]">Validade, sangria, quebra de taça ou garrafa.</p>
                </div>
              </div>

              {/* Card 4: Lista de Reposição & WhatsApp */}
              <div className="rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-7 shadow-soft hover:shadow-soft-md transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5B8A62]/10 text-[#5B8A62] border border-[#5B8A62]/30 mb-5 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#2C221E] mb-2">Lista de Compras Pronta pro WhatsApp</h3>
                <p className="text-xs text-[#70625B] leading-relaxed mb-4">
                  Adicione os itens em alerta à lista de reposição e copie a mensagem formatada para disparar direto para o seu fornecedor Ambev, Heineken ou Ceasa.
                </p>
                <div className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] p-3 text-[11px] text-[#2C221E]">
                  <p className="text-[#5B8A62] font-bold">✓ Cotação sem estresse</p>
                  <p className="text-[#70625B]">Quantidades ideais calculadas automaticamente.</p>
                </div>
              </div>

              {/* Card 5: Multi-Tenant & Perfis Isolados */}
              <div className="rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-7 shadow-soft hover:shadow-soft-md transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDA76A]/15 text-[#C87A5B] border border-[#DDA76A]/30 mb-5 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#2C221E] mb-2">Perfis Separados com Segurança</h3>
                <p className="text-xs text-[#70625B] leading-relaxed mb-4">
                  O Dono vê custos e lucros; o Gerente gerencia compras e entradas; o Bartender tem acesso simplificado para auditar e dar baixas operacionais.
                </p>
                <div className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] p-3 text-[11px] text-[#2C221E]">
                  <p className="text-[#C87A5B] font-bold">✓ Permissões Proprietário / Bartender</p>
                  <p className="text-[#70625B]">Dados do seu bar 100% isolados na nuvem.</p>
                </div>
              </div>

              {/* Card 6: Conexão em Tempo Real & Offline */}
              <div className="rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-7 shadow-soft hover:shadow-soft-md transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF6F0] text-[#70625B] border border-[#EFE8DE] mb-5 group-hover:scale-105 transition-transform">
                  <Zap className="h-6 w-6 text-[#C87A5B]" />
                </div>
                <h3 className="text-lg font-bold text-[#2C221E] mb-2">Funciona em Qualquer Dispositivo</h3>
                <p className="text-xs text-[#70625B] leading-relaxed mb-4">
                  Abra no celular do balcão, no tablet do caixa ou no notebook da gerência. Sincronização instantânea na nuvem com criptografia de ponta a ponta.
                </p>
                <div className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] p-3 text-[11px] text-[#2C221E]">
                  <p className="text-[#5B8A62] font-bold">✓ Responsivo e ultra veloz</p>
                  <p className="text-[#70625B]">Sem travamentos na correria da sexta-feira.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. OS 5 PASSOS DO BAR LUCRATIVO (Automark 5 steps style) */}
        <section id="como-funciona" className="px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2C221E] mb-3">
              Os 5 Passos da Operação no <span className="text-[#C87A5B]">MeuBotequim</span>
            </h2>
            <p className="text-sm text-[#70625B]">Como uma rotina de 5 minutos blinda o seu estoque e protege seu lucro.</p>
          </div>

          <div className="mx-auto max-w-4xl space-y-3">
            {[
              {
                step: '01',
                title: 'ENTRADA RÁPIDA DE NOTAS & CARGAS',
                desc: 'Recebeu o caminhão da distribuidora? Lance as caixas e barris em segundos pelo celular.',
              },
              {
                step: '02',
                title: 'BAIXA OPERACIONAL NO TURNO',
                desc: 'Registre as sangrias de chopp e o consumo do balcão sem burocracia.',
              },
              {
                step: '03',
                title: 'BALANÇO CEGO NA TROCA DE TURNO',
                desc: 'Conferência limpa em 3 minutos sem que o funcionário veja o saldo esperado.',
              },
              {
                step: '04',
                title: 'ALERTA ANTECIPADO DE RUPTURA',
                desc: 'O sistema avisa com antecedência os itens que vão faltar antes do fim de semana começar.',
              },
              {
                step: '05',
                title: 'PEDIDO IDEAL DIRETO AO FORNECEDOR',
                desc: 'Gere a lista exata sem estourar seu caixa nem deixar o cliente sem a bebida favorita.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-[#EFE8DE] bg-[#FFFFFF] p-5 shadow-soft hover:bg-[#FAF6F0]/60 transition-all gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#C87A5B]">
                    {item.step}
                  </span>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-[#2C221E]">{item.title}</h4>
                    <p className="text-xs text-[#70625B]">{item.desc}</p>
                  </div>
                </div>
                <div className="self-end sm:self-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5B8A62] bg-[#5B8A62]/10 px-2.5 py-1 rounded-full border border-[#5B8A62]/30">
                    <CheckCircle2 className="h-3 w-3" />
                    Automático
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. TABELA DE PLANOS DE ASSINATURA (Automark Pricing com Paleta MeuBotequim) */}
        <section id="planos" className="px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <div className="mx-auto max-w-5xl text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2C221E] mb-3">
              Planos Transparentes para o Tamanho do Seu Bar
            </h2>
            <p className="text-sm text-[#70625B] mb-8">
              Comece com 14 dias de teste grátis. Cancele quando quiser, sem fidelidade.
            </p>

            {/* Switch Mensal / Anual */}
            <div className="inline-flex items-center gap-3 rounded-full border border-[#EFE8DE] bg-[#FFFFFF] shadow-soft p-1.5 text-xs font-bold text-[#70625B]">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  !isAnnual ? 'bg-[#C87A5B] text-white font-extrabold shadow-soft' : 'hover:text-[#2C221E]'
                }`}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`rounded-full px-4 py-1.5 transition-all flex items-center gap-1.5 ${
                  isAnnual ? 'bg-[#C87A5B] text-white font-extrabold shadow-soft' : 'hover:text-[#2C221E]'
                }`}
              >
                <span>Anual</span>
                <span className="rounded-full bg-[#5B8A62]/15 text-[#5B8A62] text-[10px] px-1.5 py-0.2 border border-[#5B8A62]/30">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plano 1: Botequim Starter */}
            <div className="rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-7 flex flex-col justify-between shadow-soft">
              <div>
                <h3 className="text-lg font-bold text-[#2C221E] mb-1">Botequim Starter</h3>
                <p className="text-xs text-[#70625B] mb-6">Para botecos e quiosques iniciando o controle digital.</p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-[#2C221E]">
                    {isAnnual ? 'R$ 71' : 'R$ 89'}
                  </span>
                  <span className="text-xs text-[#70625B]"> /mês</span>
                </div>
                <ul className="space-y-3 text-xs text-[#2C221E] mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#5B8A62]" /> Até 100 SKUs monitorados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#5B8A62]" /> 2 Usuários (Dono + Gerente)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#5B8A62]" /> Alertas de estoque crítico
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#5B8A62]" /> Lista de compras rápida
                  </li>
                  <li className="flex items-center gap-2 text-[#70625B]/50">
                    <span className="h-4 w-4 block text-center">-</span> Balanço cego ilimitado
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] py-3 text-xs font-bold text-[#2C221E] hover:bg-[#EFE8DE]/60 transition-all"
              >
                Testar 14 Dias Grátis
              </button>
            </div>

            {/* Plano 2: Bar Pro (Destaque Automark em Terracota) */}
            <div className="rounded-3xl border-2 border-[#C87A5B] bg-[#FFFFFF] p-7 flex flex-col justify-between relative shadow-soft-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#C87A5B] px-3.5 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-soft">
                Mais Escolhido
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C221E] mb-1">Bar Pro</h3>
                <p className="text-xs text-[#70625B] mb-6">Para bares, pubs e casas noturnas com alta rotatividade.</p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-[#2C221E]">
                    {isAnnual ? 'R$ 119' : 'R$ 149'}
                  </span>
                  <span className="text-xs text-[#70625B]"> /mês</span>
                </div>
                <ul className="space-y-3 text-xs text-[#2C221E] mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#C87A5B]" /> <strong>Produtos & SKUs Ilimitados</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#C87A5B]" /> <strong>Usuários Ilimitados</strong> (Dono, Gerente, Balcão)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#C87A5B]" /> <strong>Balanço Cego de Balcão (3 Minutos)</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#C87A5B]" /> Previsão de Giro para Fim de Semana
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#C87A5B]" /> Controle de Perdas & Sangrias de Chopp
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#C87A5B]" /> Suporte Prioritário no WhatsApp
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className="w-full rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] py-3.5 text-xs font-black text-white active:scale-95 transition-all shadow-soft"
              >
                Começar Teste Pro Grátis
              </button>
            </div>

            {/* Plano 3: Redes & Franquias */}
            <div className="rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-7 flex flex-col justify-between shadow-soft">
              <div>
                <h3 className="text-lg font-bold text-[#2C221E] mb-1">Redes & Multi-Bares</h3>
                <p className="text-xs text-[#70625B] mb-6">Para grupos gastronômicos com 2 ou mais filiais/unidades.</p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-[#2C221E]">
                    {isAnnual ? 'R$ 239' : 'R$ 299'}
                  </span>
                  <span className="text-xs text-[#70625B]"> /mês</span>
                </div>
                <ul className="space-y-3 text-xs text-[#2C221E] mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#5B8A62]" /> Múltiplas Unidades / Filiais
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#5B8A62]" /> Visão consolidada de estoques
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#5B8A62]" /> Transferência de insumos entre bares
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#5B8A62]" /> Relatórios executivos de DRE/Perdas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#5B8A62]" /> Onboarding dedicado com consultor
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] py-3 text-xs font-bold text-[#2C221E] hover:bg-[#EFE8DE]/60 transition-all"
              >
                Falar com Especialista
              </button>
            </div>
          </div>
        </section>

        {/* 8. FAQ INTERATIVO */}
        <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto scroll-mt-28">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C221E] mb-2">Dúvidas Frequentes</h2>
            <p className="text-xs text-[#70625B]">Tudo o que você precisa saber antes de começar.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Como funciona o teste grátis de 14 dias?',
                a: 'Você cadastra o seu bar em menos de 1 minuto, sem precisar colocar cartão de crédito. Tem acesso total ao sistema durante 14 dias para auditar seu estoque e testar no dia a dia com sua equipe.',
              },
              {
                q: 'Preciso instalar algum aplicativo no computador ou celular?',
                a: 'Não! O MeuBotequim é 100% web na nuvem. Você e sua equipe podem acessar direto pelo navegador do celular, tablet ou computador pelo endereço meubotequim.com.br.',
              },
              {
                q: 'Como funciona o Balanço Cego de Balcão?',
                a: 'O funcionário abre a tela de contagem e digita quantos itens ou barris contou fisicamente. O sistema NÃO mostra a quantidade esperada, evitando que o operador simplesmente repita o número do sistema. O relatório de divergência é enviado direto para o dono.',
              },
              {
                q: 'Consigo cadastrar outros funcionários com permissões diferentes?',
                a: 'Sim! Você pode criar acessos para Gerentes (que acompanham compras e entradas) e Bartenders/Garçons (que só realizam contagens e baixas rápidas), sem que eles tenham acesso a dados de lucro ou faturamento.',
              },
              {
                q: 'Posso cancelar a qualquer momento?',
                a: 'Sim, sem nenhuma multa ou contrato de fidelidade. Você tem total controle da sua assinatura.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#EFE8DE] bg-[#FFFFFF] shadow-soft overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-[#2C221E]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#C87A5B] transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-[#70625B] leading-relaxed border-t border-[#EFE8DE] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 9. BANNER FINAL CTA (Estilo Automark em Tom Espresso e Terracota) */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl border border-[#EFE8DE] bg-gradient-to-br from-[#2C221E] via-[#241B18] to-[#1A1310] p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-soft-lg">
            <div
              className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-30 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(200, 122, 91, 0.4) 0%, transparent 70%)',
              }}
            />
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
              Pronto para colocar o estoque do seu bar no piloto automático?
            </h2>
            <p className="mx-auto max-w-xl text-xs sm:text-sm text-[#FAF6F0]/85 mb-8 font-normal">
              Junte-se a donos de bares que pararam de perder dinheiro com quebras, chopp vencido e furos de caixa no fim de semana.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C87A5B] hover:bg-[#B2684B] px-8 py-4 text-xs sm:text-sm font-black text-white shadow-soft transition-all active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Começar Teste Grátis de 14 Dias</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-xs sm:text-sm font-bold text-white hover:bg-white/15 transition-all"
              >
                <span>Acessar Demonstração</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 10. RODAPÉ INSTITUCIONAL COM O LOGO OFICIAL */}
      <footer className="border-t border-[#EFE8DE] bg-[#FFFFFF] py-10 text-xs text-[#70625B]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-[#EFE8DE] bg-[#F4EDE4]">
              <img
                src="/logo.png"
                alt="MeuBotequim"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-extrabold text-[#2C221E]">
              Meu<span className="text-[#C87A5B]">Botequim</span>
            </span>
            <span className="text-[#EFE8DE]">|</span>
            <span>© {new Date().getFullYear()} MeuBotequim — Sistema Especializado para Bares, Botecos & Restaurantes.</span>
          </div>

          <div className="flex items-center gap-5 text-[#70625B]">
            <a href="#recursos" className="hover:text-[#2C221E] transition-colors">Recursos</a>
            <a href="#planos" className="hover:text-[#2C221E] transition-colors">Preços</a>
            <button
              type="button"
              onClick={() => handleOpenAuth('login')}
              className="hover:text-[#2C221E] transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>
      </footer>

      {/* Modal de Autenticação & Onboarding SaaS */}
      <AuthModal
        key={`${authModalMode}-${isAuthModalOpen}`}
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default LandingPage;
