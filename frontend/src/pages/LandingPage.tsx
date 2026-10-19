import React, { useState } from 'react';
import {
  Beer,
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
    <div className="min-h-screen bg-[#07080B] text-zinc-100 font-sans selection:bg-[#C87A5B]/30 selection:text-[#FAF6F0] relative overflow-x-hidden">
      {/* Luz ambiente superior estilo Automark (Glow radial âmbar/cobre) */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] -z-10 rounded-full blur-[140px] opacity-40"
        style={{
          background:
            'radial-gradient(circle, rgba(200, 122, 91, 0.45) 0%, rgba(221, 167, 106, 0.2) 40%, transparent 70%)',
        }}
      />

      {/* 1. Header / Navbar Flutuante Estilo Automark */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
        <nav className="mx-auto max-w-7xl flex items-center justify-between rounded-full border border-white/10 bg-[#0C0E14]/80 px-4 py-2.5 backdrop-blur-xl shadow-2xl transition-all">
          {/* Logo MeuBotequim */}
          <div className="flex items-center gap-2.5 pl-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#C87A5B] to-[#DDA76A] shadow-md shadow-[#C87A5B]/20">
              <Beer className="h-5 w-5 text-[#07080B]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">
                Meu<span className="text-[#E08D6E]">Botequim</span>
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/20">
                SaaS
              </span>
            </div>
          </div>

          {/* Menu Central Desktop */}
          <ul className="hidden md:flex items-center gap-1 rounded-full bg-white/[0.03] border border-white/5 px-4 py-1 text-xs font-semibold text-zinc-300">
            <li>
              <a href="#problemas" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
                O Desperdício
              </a>
            </li>
            <li>
              <a href="#recursos" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
                Recursos
              </a>
            </li>
            <li>
              <a href="#como-funciona" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
                Como Funciona
              </a>
            </li>
            <li>
              <a href="#planos" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
                Planos
              </a>
            </li>
            <li>
              <a href="#faq" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
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
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C87A5B] to-[#DDA76A] px-4 py-2 text-xs font-bold text-[#07080B] shadow-lg shadow-[#C87A5B]/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Store className="h-3.5 w-3.5" />
                  <span>Acessar Painel</span>
                </button>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="text-xs text-zinc-400 hover:text-white px-2 py-1 transition-colors"
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
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Entrar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('register')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C87A5B] to-[#DDA76A] px-4 py-2 text-xs font-bold text-[#07080B] shadow-lg shadow-[#C87A5B]/25 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#07080B]" />
                  <span>Cadastrar Meu Bar</span>
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-24 space-y-24 sm:space-y-32">
        {/* 2. HERO SECTION ESTILO AUTOMARK */}
        <section className="relative px-4 sm:px-6 lg:px-8 text-center pt-6">
          <div className="mx-auto max-w-5xl">
            {/* Pill Tag no Topo */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C87A5B]/40 bg-[#C87A5B]/10 px-4 py-1.5 text-xs font-bold text-[#E08D6E] backdrop-blur-md mb-8 animate-in fade-in slide-in-from-top-4">
              <span className="flex h-2 w-2 rounded-full bg-[#E08D6E] animate-pulse" />
              <span>O Fim do Estoque Furado no Final de Semana</span>
            </div>

            {/* Headline com palavras-chave em destaque */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] mb-6">
              O Sistema Inteligente de Estoque para{' '}
              <span className="bg-gradient-to-r from-[#E08D6E] via-[#E8B27A] to-[#DDA76A] bg-clip-text text-transparent underline decoration-[#C87A5B]/40 underline-offset-8">
                Bares, Botecos & Restaurantes
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="mx-auto max-w-2xl text-sm sm:text-base lg:text-lg text-zinc-400 font-normal leading-relaxed mb-10">
              Faça a <strong>auditoria de balcão em 3 minutos</strong>, preveja as compras de Chopp para o fim de semana e elimine o prejuízo com quebras, validade e desvios.
            </p>

            {/* Botões Principais de Ação */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C87A5B] to-[#DDA76A] px-7 py-4 text-sm font-extrabold text-[#07080B] shadow-xl shadow-[#C87A5B]/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Começar Grátis por 14 Dias</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white backdrop-blur-md hover:bg-white/[0.08] hover:border-white/25 active:scale-95 transition-all"
              >
                <span>Ver Demonstração do Painel</span>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </button>
            </div>

            {/* Badges de confiança */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#E08D6E]" />
                Sem cartão de crédito
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#E08D6E]" />
                Pronto para usar em 3 minutos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#E08D6E]" />
                Multi-perfil (Dono, Gerente, Balcão)
              </span>
            </div>
          </div>

          {/* 3. MOCKUP 3D / SHOWCASE INTERATIVO (Automark Video/App Showcase) */}
          <div className="mt-14 mx-auto max-w-6xl">
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#141721] to-[#0A0C11] p-3 sm:p-5 shadow-[0_20px_80px_-20px_rgba(200,122,91,0.25)] backdrop-blur-2xl">
              {/* Barra superior de janela navegador */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs font-mono text-zinc-500 hidden sm:inline">
                    https://meubotequim.com.br/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Turno Ativo • BeerGod - Matriz
                  </span>
                </div>
              </div>

              {/* Preview dos 4 Cards de KPI Reais do MeuBotequim */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left mb-4">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span>Valor em Estoque</span>
                    <DollarSign className="h-4 w-4 text-[#E08D6E]" />
                  </div>
                  <p className="text-xl font-extrabold text-white">R$ 48.720,00</p>
                  <p className="text-[11px] text-emerald-400 mt-1 font-semibold">+3,2% no mês</p>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span className="text-red-300 font-bold">Nível Crítico</span>
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                  <p className="text-xl font-extrabold text-white">5 Itens</p>
                  <p className="text-[11px] text-red-400 mt-1 font-semibold">Reposição Imediata</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span>Perdas & Desperdício</span>
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  </div>
                  <p className="text-xl font-extrabold text-white">R$ 845,00</p>
                  <p className="text-[11px] text-emerald-400 mt-1 font-semibold">-14,5% vs. mês anterior</p>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span>Giro Projetado (FDS)</span>
                    <CalendarCheck className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="text-xl font-extrabold text-white">R$ 19.350,00</p>
                  <p className="text-[11px] text-amber-300 mt-1 font-semibold">Pico de Sex/Sáb/Dom</p>
                </div>
              </div>

              {/* Mini Tabela de Alerta do Mockup */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-3 sm:p-4 text-left">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-zinc-200">Atenção Prioritária para o Fim de Semana</span>
                  <button
                    type="button"
                    onClick={onNavigateToDashboard}
                    className="text-[11px] text-[#E08D6E] hover:underline font-bold"
                  >
                    Abrir no modo completo →
                  </button>
                </div>
                <div className="divide-y divide-white/5 text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Chopp Pilsen 50L (Barril)</p>
                      <p className="text-[10px] text-zinc-500">Ambev / Brahma • Chopp & Cervejas</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-red-400 font-extrabold">1 barril (Mín: 4)</span>
                      <span className="rounded-lg bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-300 border border-red-500/30">
                        CRÍTICO
                      </span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Gin Tanqueray London Dry 750ml</p>
                      <p className="text-[10px] text-zinc-500">Diageo • Destilados Premium</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-red-400 font-extrabold">2 gf (Mín: 6)</span>
                      <span className="rounded-lg bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-300 border border-red-500/30">
                        CRÍTICO
                      </span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Cerveja Heineken Long Neck 330ml</p>
                      <p className="text-[10px] text-zinc-500">Heineken • Chopp & Cervejas</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400 font-extrabold">14 un (Mín: 48)</span>
                      <span className="rounded-lg bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
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
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Você ainda perde até 20% do faturamento no{' '}
              <span className="text-[#E08D6E]">Ralo do Desperdício?</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mb-10">
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
                  className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/[0.05] px-4 py-2 text-xs font-semibold text-zinc-300 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                  <span>{problem}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BENTO GRID: RECURSOS ALL-IN-ONE (Automark Bento Style) */}
        <section id="recursos" className="px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
                Substitua o caderninho e planilhas por um{' '}
                <span className="text-[#E08D6E]">Sistema Ágil e Inteligente</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-400">
                Criado especificamente para a dinâmica veloz de bares, pubs e restaurantes. Tudo ao alcance de 2 cliques no celular.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Previsão de Giro FDS */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-5 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Previsão de Giro para o Fim de Semana</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  O MeuBotequim calcula a demanda de Sex/Sáb/Dom e te avisa exatamente quantos barris de chopp e caixas de cerveja pedir antes da quinta-feira.
                </p>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-[11px] font-mono text-zinc-300">
                  <p className="text-emerald-400 font-bold">✓ Sugestão Automática de Compra</p>
                  <p className="text-zinc-500">Evite pagar frete urgente ou ficar na mão no domingo.</p>
                </div>
              </div>

              {/* Card 2: Balanço Cego em 3 Minutos */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C87A5B]/15 text-[#E08D6E] border border-[#C87A5B]/30 mb-5 group-hover:scale-105 transition-transform">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Balanço Cego de Balcão (3 Minutos)</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  O bartender conta as garrafas e barris na troca de turno sem saber o saldo do sistema. O sistema calcula a divergência exata na hora.
                </p>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-[11px] font-mono text-zinc-300">
                  <p className="text-[#E08D6E] font-bold">✓ Acabe com contagens "maquiadas"</p>
                  <p className="text-zinc-500">Descubra sobras ou faltas imediatamente na passagem de turno.</p>
                </div>
              </div>

              {/* Card 3: Controle de Perdas & Sangrias */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 mb-5 group-hover:scale-105 transition-transform">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Registro de Perdas & Descarte de Chopp</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Quebrou uma garrafa de Gin ou descartou espuma da serpentina? Lance a perda em 2 toques e saiba no fim do mês o valor exato do desperdício.
                </p>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-[11px] font-mono text-zinc-300">
                  <p className="text-red-400 font-bold">✓ Motivos de quebra auditados</p>
                  <p className="text-zinc-500">Validade, sangria, quebra de taça ou garrafa.</p>
                </div>
              </div>

              {/* Card 4: Lista de Reposição & WhatsApp */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Lista de Compras Pronta pro WhatsApp</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Adicione os itens em alerta à lista de reposição e copie a mensagem formatada para disparar direto para o seu fornecedor Ambev, Heineken ou Ceasa.
                </p>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-[11px] font-mono text-zinc-300">
                  <p className="text-emerald-400 font-bold">✓ Cotação sem estresse</p>
                  <p className="text-zinc-500">Quantidades ideais calculadas automaticamente.</p>
                </div>
              </div>

              {/* Card 5: Multi-Tenant & Perfis Isolados */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-5 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Perfis Separados com Segurança</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  O Dono vê custos e lucros; o Gerente gerencia compras e entradas; o Bartender tem acesso simplificado para auditar e dar baixas operacionais.
                </p>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-[11px] font-mono text-zinc-300">
                  <p className="text-blue-400 font-bold">✓ Permissões Proprietário / Bartender</p>
                  <p className="text-zinc-500">Dados do seu bar 100% isolados na nuvem.</p>
                </div>
              </div>

              {/* Card 6: Conexão em Tempo Real & Offline */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 hover:bg-white/[0.04] transition-all relative overflow-hidden group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-5 group-hover:scale-105 transition-transform">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Funciona em Qualquer Dispositivo</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Abra no celular do balcão, no tablet do caixa ou no notebook da gerência. Sincronização instantânea na nuvem com criptografia de ponta a ponta.
                </p>
                <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-[11px] font-mono text-zinc-300">
                  <p className="text-purple-400 font-bold">✓ Responsivo e ultra veloz</p>
                  <p className="text-zinc-500">Sem lentidão no meio da correria do salão.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. OS 5 PASSOS DO BAR LUCRATIVO (Automark 5 steps style) */}
        <section id="como-funciona" className="px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Os 5 Passos da Operação no <span className="text-[#E08D6E]">MeuBotequim</span>
            </h2>
            <p className="text-sm text-zinc-400">Como uma rotina de 5 minutos blinda o seu estoque e protege seu lucro.</p>
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
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#E08D6E]/80">
                    {item.step}
                  </span>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-zinc-400">{item.desc}</p>
                  </div>
                </div>
                <div className="self-end sm:self-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" />
                    Automático
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. TABELA DE PLANOS DE ASSINATURA (Automark Pricing) */}
        <section id="planos" className="px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <div className="mx-auto max-w-5xl text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Planos Transparentes para o Tamanho do Seu Bar
            </h2>
            <p className="text-sm text-zinc-400 mb-8">
              Comece com 14 dias de teste grátis. Cancele quando quiser, sem fidelidade.
            </p>

            {/* Switch Mensal / Anual */}
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] p-1.5 text-xs font-bold text-zinc-400">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  !isAnnual ? 'bg-gradient-to-r from-[#C87A5B] to-[#DDA76A] text-[#07080B] font-extrabold shadow-md' : 'hover:text-white'
                }`}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`rounded-full px-4 py-1.5 transition-all flex items-center gap-1.5 ${
                  isAnnual ? 'bg-gradient-to-r from-[#C87A5B] to-[#DDA76A] text-[#07080B] font-extrabold shadow-md' : 'hover:text-white'
                }`}
              >
                <span>Anual</span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plano 1: Botequim Starter */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Botequim Starter</h3>
                <p className="text-xs text-zinc-400 mb-6">Para botecos e quiosques iniciando o controle digital.</p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-white">
                    {isAnnual ? 'R$ 71' : 'R$ 89'}
                  </span>
                  <span className="text-xs text-zinc-400"> /mês</span>
                </div>
                <ul className="space-y-3 text-xs text-zinc-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> Até 100 SKUs monitorados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> 2 Usuários (Dono + Gerente)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> Alertas de estoque crítico
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> Lista de compras rápida
                  </li>
                  <li className="flex items-center gap-2 text-zinc-600">
                    <span className="h-4 w-4 block text-center">-</span> Balanço cego ilimitado
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] py-3 text-xs font-bold text-white hover:bg-white/[0.08] transition-all"
              >
                Testar 14 Dias Grátis
              </button>
            </div>

            {/* Plano 2: Bar Pro (Destaque Automark) */}
            <div className="rounded-3xl border-2 border-[#C87A5B] bg-gradient-to-b from-[#C87A5B]/10 to-[#0A0C11] p-7 flex flex-col justify-between relative shadow-2xl shadow-[#C87A5B]/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#C87A5B] to-[#DDA76A] px-3 py-0.5 text-[10px] font-extrabold text-[#07080B] uppercase tracking-wider">
                Mais Escolhido
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Bar Pro</h3>
                <p className="text-xs text-zinc-400 mb-6">Para bares, pubs e casas noturnas com alta rotatividade.</p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-white">
                    {isAnnual ? 'R$ 119' : 'R$ 149'}
                  </span>
                  <span className="text-xs text-zinc-400"> /mês</span>
                </div>
                <ul className="space-y-3 text-xs text-zinc-200 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> <strong>Produtos & SKUs Ilimitados</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> <strong>Usuários Ilimitados</strong> (Dono, Gerente, Balcão)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> <strong>Balanço Cego de Balcão (3 Minutos)</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> Previsão de Giro para Fim de Semana
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> Controle de Perdas & Sangrias de Chopp
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> Suporte Prioritário no WhatsApp
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className="w-full rounded-xl bg-gradient-to-r from-[#C87A5B] to-[#DDA76A] py-3.5 text-xs font-black text-[#07080B] hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#C87A5B]/30"
              >
                Começar Teste Pro Grátis
              </button>
            </div>

            {/* Plano 3: Redes & Franquias */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Redes & Multi-Bares</h3>
                <p className="text-xs text-zinc-400 mb-6">Para grupos gastronômicos com 2 ou mais filiais/unidades.</p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-white">
                    {isAnnual ? 'R$ 239' : 'R$ 299'}
                  </span>
                  <span className="text-xs text-zinc-400"> /mês</span>
                </div>
                <ul className="space-y-3 text-xs text-zinc-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> Múltiplas Unidades / Filiais
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> Visão consolidada de estoques
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> Transferência de insumos entre bares
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> Relatórios executivos de DRE/Perdas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#E08D6E]" /> Onboarding dedicado com consultor
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] py-3 text-xs font-bold text-white hover:bg-white/[0.08] transition-all"
              >
                Falar com Especialista
              </button>
            </div>
          </div>
        </section>

        {/* 8. FAQ INTERATIVO */}
        <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto scroll-mt-28">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Dúvidas Frequentes</h2>
            <p className="text-xs text-zinc-400">Tudo o que você precisa saber antes de começar.</p>
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
                className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-zinc-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#E08D6E]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 9. BANNER FINAL CTA (Automark Glow Banner) */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl border border-[#C87A5B]/30 bg-gradient-to-br from-[#1C151B] via-[#100D12] to-[#07080B] p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
            <div
              className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-40 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(200, 122, 91, 0.4) 0%, transparent 70%)',
              }}
            />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Pronto para colocar o estoque do seu bar no piloto automático?
            </h2>
            <p className="mx-auto max-w-xl text-xs sm:text-sm text-zinc-400 mb-8">
              Junte-se a donos de bares que pararam de perder dinheiro com quebras, chopp vencido e furos de caixa no fim de semana.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C87A5B] to-[#DDA76A] px-8 py-4 text-xs sm:text-sm font-black text-[#07080B] shadow-xl shadow-[#C87A5B]/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Começar Teste Grátis de 14 Dias</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-all"
              >
                <span>Acessar Demonstração</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 10. RODAPÉ ESTILO AUTOMARK */}
      <footer className="border-t border-white/10 bg-[#0A0C11] py-10 text-xs text-zinc-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#C87A5B] to-[#DDA76A]">
              <Beer className="h-4 w-4 text-[#07080B]" />
            </div>
            <span className="font-extrabold text-white">
              Meu<span className="text-[#E08D6E]">Botequim</span>
            </span>
            <span className="text-zinc-600">|</span>
            <span>© {new Date().getFullYear()} MeuBotequim SaaS. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-5 text-zinc-400">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#planos" className="hover:text-white transition-colors">Preços</a>
            <button type="button" onClick={() => handleOpenAuth('login')} className="hover:text-white transition-colors">
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
