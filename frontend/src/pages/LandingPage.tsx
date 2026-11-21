import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Flame,
  Search,
  ShoppingBag,
  Utensils,
  Star,
  Play,
  Clock,
  Heart,
  Plus,
  X,
  Check,
  Award,
  Leaf,
  Zap,
  CalendarCheck,
  Users,
  ChevronLeft,
  ChevronRight,
  Send,
  Lock,
  MessageSquare,
  Store,
  LogIn,
  Menu,
  ArrowRight,
  Sparkles,
  Minus,
} from 'lucide-react';
import { AuthModal } from '../components/meubotequim/AuthModal';
import { BlipChatWidget, openBlipChatWidget } from '../components/BlipChatWidget';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  isAuthenticated: boolean;
  onLogout?: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  categoryKey: string;
  categoryLabel: string;
  priceDay: number;
  priceNight: number;
  oldPrice?: number;
  rating: string;
  reviewsCount: number;
  stockCount: number;
  unit: string;
  prepTimeMinutes: number;
  caloriesOrAbv: string;
  badge?: {
    text: string;
    variant: 'hot' | 'new' | 'primary';
  };
  image: string;
  shortDesc: string;
  fullDesc: string;
  tags: string[];
}

interface GalleryItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const CATEGORIES = [
  {
    key: 'all',
    name: 'Todos os Itens',
    count: '36 SKUs',
    image:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80',
  },
  {
    key: 'chopp',
    name: 'Chopp & Cervejas',
    count: '12 itens',
    image:
      'https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?auto=format&fit=crop&w=400&q=80',
  },
  {
    key: 'destilados',
    name: 'Drinks & Destilados',
    count: '9 itens',
    image:
      'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80',
  },
  {
    key: 'cachacas',
    name: 'Cachaças & Caipirinhas',
    count: '6 itens',
    image:
      'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=400&q=80',
  },
  {
    key: 'porcoes',
    name: 'Petiscos de Boteco',
    count: '5 itens',
    image:
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80',
  },
  {
    key: 'insumos',
    name: 'Insumos & Mixers',
    count: '4 itens',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
  },
];

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    title: 'Chopp Pilsen 50L (Caldeireta & Barril Ambev)',
    categoryKey: 'chopp',
    categoryLabel: 'Chopp & Cervejas',
    priceDay: 12.0,
    priceNight: 15.0,
    oldPrice: 16.5,
    rating: '4.9',
    reviewsCount: 310,
    stockCount: 64,
    unit: 'caldeiretas / 1 barril',
    prepTimeMinutes: 2,
    caloriesOrAbv: '5.0% ABV • -2°C',
    badge: { text: 'Gelado -2°C', variant: 'hot' },
    image:
      'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80',
    shortDesc:
      'Tiragem perfeita na serpentina a -2°C com colarinho cremoso e controle de sangria por barril.',
    fullDesc:
      'Chopp Pilsen monitorado em tempo real no MeuBotequim. Cada sangria ou perda de espuma na troca de barril é auditada no balcão, com virada automática para tarifa noturna pós-00h.',
    tags: ['Serpentina -2°C', 'Tarifa Noturna', 'Curva A'],
  },
  {
    id: 'item-2',
    title: 'Cerveja Heineken Long Neck 330ml',
    categoryKey: 'chopp',
    categoryLabel: 'Chopp & Cervejas',
    priceDay: 12.0,
    priceNight: 15.0,
    oldPrice: 16.0,
    rating: '4.9',
    reviewsCount: 245,
    stockCount: 14,
    unit: 'garrafas',
    prepTimeMinutes: 1,
    caloriesOrAbv: '5.0% ABV • Puro Malte',
    badge: { text: 'Alta Rotatividade', variant: 'new' },
    image:
      'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
    shortDesc:
      'Long neck 330ml trincando na geladeira do balcão, pronta para venda avulsa ou balde com 6 unidades.',
    fullDesc:
      'Produto líder de saída nas sextas e sábados. O MeuBotequim alerta automaticamente quando a geladeira cai abaixo do estoque mínimo de 48 unidades e gera o pedido direto para o fornecedor no WhatsApp.',
    tags: ['Long Neck 330ml', 'Alerta de Reposição', 'Balde c/ Gelo'],
  },
  {
    id: 'item-3',
    title: 'Gin Tanqueray London Dry & Tônica Botânica',
    categoryKey: 'destilados',
    categoryLabel: 'Drinks & Destilados',
    priceDay: 32.0,
    priceNight: 38.0,
    oldPrice: 42.0,
    rating: '5.0',
    reviewsCount: 178,
    stockCount: 24,
    unit: 'doses (2 garrafas)',
    prepTimeMinutes: 4,
    caloriesOrAbv: '47.3% ABV • 60ml',
    badge: { text: 'Drink Autoral', variant: 'primary' },
    image:
      'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80',
    shortDesc:
      'Dose dupla medida no dosador (60ml), água tônica Antarctica bem gelada, zimbro, alecrim e limão taiti.',
    fullDesc:
      'Cada taça vendida desconta automaticamente 60ml da garrafa de Gin Tanqueray 750ml, 1 lata de água tônica e 50g de limão taiti na ficha técnica do MeuBotequim.',
    tags: ['Ficha Técnica Ativa', 'Balanço Cego', 'Destilado Premium'],
  },
  {
    id: 'item-4',
    title: 'Cachaça Salinas & Caipirinha de Limão Taiti',
    categoryKey: 'cachacas',
    categoryLabel: 'Cachaças & Caipirinhas',
    priceDay: 24.0,
    priceNight: 28.0,
    rating: '4.9',
    reviewsCount: 134,
    stockCount: 18,
    unit: 'doses / coquetéis',
    prepTimeMinutes: 4,
    caloriesOrAbv: '42% ABV • Alambique',
    badge: { text: 'Tradição de Boteco', variant: 'hot' },
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    shortDesc:
      'Cachaça artesanal envelhecida em bálsamo servida na dose ou batida com limão taiti fresco e gelo filtrado.',
    fullDesc:
      'O clássico indispensável do botequim brasileiro. Controle integrado do estoque de garrafas de Salinas 700ml, pacotes de gelo filtrado e quilos de limão taiti do hortifrúti.',
    tags: ['Salinas MG', 'Limão Taiti Fresco', 'Gelo Filtrado'],
  },
  {
    id: 'item-5',
    title: 'Smash Burger de Boteco & Cebola no Chopp Escuro',
    categoryKey: 'porcoes',
    categoryLabel: 'Petiscos de Boteco',
    priceDay: 36.9,
    priceNight: 42.9,
    oldPrice: 46.0,
    rating: '4.9',
    reviewsCount: 192,
    stockCount: 28,
    unit: 'porções',
    prepTimeMinutes: 12,
    caloriesOrAbv: '620 kcal • Chapa',
    badge: { text: 'Mais Pedido', variant: 'hot' },
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    shortDesc:
      'Blend duplo prensado na chapa, cheddar inglês derretido, cebola caramelizada na cerveja preta e brioche.',
    fullDesc:
      'Preparado na chapa do balcão para harmonizar com Chopp Pilsen e IPA. Possui controle completo de CMV (Custo de Mercadoria Vendida) e margem calculada no painel.',
    tags: ['Harmoniza c/ Chopp', 'Chapa Quente', 'Alta Margem'],
  },
  {
    id: 'item-6',
    title: 'Porção de Batata Rústica & Petiscos Crocantes',
    categoryKey: 'porcoes',
    categoryLabel: 'Petiscos de Boteco',
    priceDay: 32.0,
    priceNight: 37.0,
    rating: '4.8',
    reviewsCount: 164,
    stockCount: 22,
    unit: 'porções',
    prepTimeMinutes: 10,
    caloriesOrAbv: '540 kcal • Tira-Gosto',
    badge: { text: 'Para Compartilhar', variant: 'new' },
    image:
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
    shortDesc:
      'Porção generosa de batatas crocantes com alecrim, alho confitado, páprica defumada e maionese da casa.',
    fullDesc:
      'O tira-gosto campeão de pedidos nas mesas de quinta a domingo. Integrado ao assistente da Blip para sugestão automática quando o cliente consulta cervejas disponíveis.',
    tags: ['Tira-Gosto', 'Mesa & Balcão', 'Giro Rápido'],
  },
];

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 0,
    title: 'Torneiras de Chopp & Controle de Sangria',
    subtitle: 'Monitoramento de Barris 30L e 50L',
    description:
      'Controle cada barril engatado, registre sangrias de espuma em 2 toques e receba alerta antes que o chopp acabe no pico de sábado.',
    image:
      'https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 1,
    title: 'Balanço Cego de Destilados em 3 Minutos',
    subtitle: 'Auditoria Anti-Furto na Troca de Turno',
    description:
      'O bartender conta as garrafas de Gin, Vodka, Whisky e Cachaça sem ver o saldo esperado no sistema, eliminando contagens viciadas.',
    image:
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Coquetelaria & Ficha Técnica por Dose',
    subtitle: 'Margem de Lucro Diurna e Noturna',
    description:
      'Saiba o custo exato de cada Gin Tônica ou Caipirinha e ative o acréscimo automático de +20% pós-meia-noite.',
    image:
      'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Insumos de Balcão, Gelo & Hortifrúti',
    subtitle: 'Zero Ruptura de Limão, Tônica e Gelo',
    description:
      'Controle pacotes de gelo filtrado, limão taiti e mixers com lista de reposição formatada para disparo no WhatsApp.',
    image:
      'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Salão Conectado ao Assistente Blip Chat IA',
    subtitle: 'Atendimento Inteligente c/ Neon PostgreSQL',
    description:
      'Clientes consultam disponibilidade e preços reais pelo chat; a IA aciona consultarEstoqueDisponivel direto no banco.',
    image:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  },
];

const TIMELINE_STEPS = [
  {
    year: 'Passo 01',
    title: 'Entrada Rápida de Mercadorias & Notas',
    description:
      'Chegou o caminhão da Ambev, Heineken ou distribuidora? Lance barris, fardos e insumos pelo celular em menos de 30 segundos.',
  },
  {
    year: 'Passo 02',
    title: 'Atendimento Inteligente Blip Chat + Gemini IA',
    description:
      'Clientes consultam preços diurnos/noturnos e disponibilidade real no chat. O bot executa Function Calling direto no estoque do MongoDB.',
  },
  {
    year: 'Passo 03',
    title: 'Balanço Cego de Balcão em 3 Minutos',
    description:
      'Na virada de turno, o bartender informa a contagem física sem ver o saldo esperado no sistema, eliminando contagens viciadas e desvios.',
  },
  {
    year: 'Passo 04',
    title: 'Lista de Compras Pronta para o WhatsApp',
    description:
      'O sistema identifica os itens em nível crítico para o fim de semana e gera a mensagem formatada para enviar direto ao fornecedor.',
  },
];

const TEAM_ROLES = [
  {
    name: 'Moe Szyslak',
    role: 'Proprietário (Taverna do Moe)',
    experience: 'Visão de Lucro, DRE & Custos de Barris',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Thomas Shelby',
    role: 'Gerente (The Garrison Pub)',
    experience: 'Compras, Entradas & Fornecedores',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sanji Vinsmoke',
    role: 'Chefe de Bar & Cozinha (Baratie)',
    experience: 'Balanço Cego, Fichas Técnicas & Chopp',
    image:
      'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'J.A.R.V.I.S. (Blip IA)',
    role: 'Concierge Virtual 24h',
    experience: 'Consulta Estoque no Neon & Transbordo',
    image: '/logo.png',
  },
];

const TESTIMONIALS = [
  {
    name: 'Tifa Lockhart',
    role: 'Sócia do 7th Heaven Bar (Setor 7)',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    quote:
      'Antes do MeuBotequim a gente perdia quase 2 barris de chopp por mês no 7th Heaven sem saber se era espuma, vazamento ou desvio. O balanço cego em 3 minutos mudou nossa rotina.',
  },
  {
    name: 'Ted Mosby & Barney Stinson',
    role: "Fundadores do Bar Puzzles & Clientes do MacLaren's",
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    quote:
      'Quando abrimos o Puzzles, nosso maior medo era o chopp acabar no meio de uma noite lendária. A tarifa noturna pós-meia-noite aumentou nossa margem e o bot da Blip já responde o preço certo.',
  },
  {
    name: 'Guinan',
    role: 'Gerente do Lounge Ten Forward',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    quote:
      'A lista de compras integrada ao WhatsApp economiza 2 horas toda quinta-feira. Em 2 cliques eu mando o pedido exato de destilados e insumos para a distribuidora antes do fim de semana.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToDashboard,
  isAuthenticated,
  onLogout,
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [activeNavSection, setActiveNavSection] = useState<string>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Search Overlay state (Sarab FIX 1)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Menu Category filter & Detail Modal state (Sarab FIX 3 & FIX 4)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set(['item-1', 'item-4']));
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [detailQty, setDetailQty] = useState<number>(1);

  // Gallery Lightbox Popup state (Sarab FIX 7)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);

  // Countdown Timer state (Sarab Special Offer section)
  const [countdown, setCountdown] = useState({ hours: 6, minutes: 42, seconds: 19 });

  // Pricing switch in Hours & Plans section
  const [isAnnualPlan, setIsAnnualPlan] = useState(false);

  // Reservation / Demo Booking form state (Sarab Reservation section)
  const [resForm, setResForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    barSize: 'Bar Médio (50 a 150 lugares)',
    date: '',
    time: '19:00',
    notes: '',
  });
  const [resSubmitted, setResSubmitted] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Countdown tick
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 8, minutes: 45, seconds: 30 };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Keyboard Escape handler for overlays/modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setDetailItem(null);
        setActiveGalleryIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    onNavigateToDashboard();
  };

  const handleCategorySelect = (catKey: string, shouldScroll = false) => {
    setSelectedCategory(catKey);
    if (shouldScroll) {
      const el = document.getElementById('menu');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const matchesCat =
      selectedCategory === 'all' || item.categoryKey === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSearchApply = (term?: string, catKey?: string) => {
    if (term !== undefined) {
      setSearchQuery(term);
    }
    if (catKey !== undefined) {
      setSelectedCategory(catKey);
    }
    setIsSearchOpen(false);
    const menuEl = document.getElementById('menu');
    menuEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.fullName.trim() || !resForm.phone.trim()) {
      return;
    }
    setResSubmitted(true);
    setTimeout(() => {
      setResSubmitted(false);
    }, 6000);
  };

  return (
    <div className="min-h-dvh bg-[#FAF6F0] text-[#2C221E] font-sans selection:bg-[#C87A5B]/20 selection:text-[#2C221E] relative overflow-x-hidden">
      {/* ============================================================
          1. STICKY NAVBAR (Sarab #nav style + accessible aria-current)
          ============================================================ */}
      <header
        id="nav"
        className={`sticky top-0 z-50 bg-white transition-all duration-300 border-b border-[#EFE8DE] ${
          isScrolled ? 'shadow-soft-lg py-2.5' : 'shadow-soft py-3.5'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={() => setActiveNavSection('hero')}
            className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B] rounded-xl"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C87A5B] text-white shadow-soft overflow-hidden border-2 border-[#FAF6F0] transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="MeuBotequim Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="whitespace-nowrap">
              <div className="text-xl font-black tracking-tight text-[#2C221E] leading-none">
                Meu<span className="text-[#C87A5B]">Botequim</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#70625B] mt-1">
                Bar, Estoque &amp; Cardápio
              </div>
            </div>
          </a>

          {/* Navigation Links (Desktop) */}
          <nav aria-label="Navegação Principal" className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1 xl:gap-1.5">
              {[
                { id: 'hero', label: 'Início' },
                { id: 'category', label: 'Categorias' },
                { id: 'about', label: 'O Sistema' },
                { id: 'menu', label: 'Cardápio' },
                { id: 'special', label: 'Tarifa Noturna' },
                { id: 'history', label: 'Operação' },
                { id: 'hours', label: 'Planos' },
                { id: 'reservation', label: 'Contato' },
              ].map((link) => {
                const isActive = activeNavSection === link.id;
                return (
                  <li key={link.id} className="flex items-center">
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setActiveNavSection(link.id)}
                      className={`relative inline-flex items-center whitespace-nowrap px-2.5 xl:px-3 py-2 text-xs font-bold leading-none transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B] ${
                        isActive
                          ? 'text-[#C87A5B] after:content-[""] after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-[3px] after:bg-[#C87A5B] after:rounded-t-full'
                          : 'text-[#2C221E] hover:text-[#C87A5B]'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Actions: Search Trigger + Auth / Dashboard CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Pesquisar no cardápio e estoque"
              title="Pesquisar item no cardápio"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] text-[#2C221E] hover:bg-[#C87A5B]/15 hover:text-[#C87A5B] hover:border-[#C87A5B]/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
            >
              <Search className="h-4 w-4" />
            </button>

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] px-4 py-2.5 text-xs font-bold text-white shadow-soft transition-all active:scale-95"
                >
                  <Store className="h-3.5 w-3.5 shrink-0" />
                  <span>Abrir Painel</span>
                </button>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="hidden sm:inline-flex whitespace-nowrap text-xs font-semibold text-[#70625B] hover:text-[#2C221E] px-2 py-1"
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
                  className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] hover:bg-[#EFE8DE] px-3.5 py-2.5 text-xs font-bold text-[#2C221E] transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5 text-[#C87A5B] shrink-0" />
                  <span>Entrar</span>
                </button>
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] px-4 py-2.5 text-xs font-bold text-white shadow-soft transition-all active:scale-95"
                >
                  <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                  <span>Painel Ao Vivo</span>
                </button>
              </>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menu de navegação"
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] text-[#2C221E]"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Collapsible Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EFE8DE] bg-white px-4 py-4 space-y-2 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'hero', label: 'Início' },
                { id: 'category', label: 'Categorias' },
                { id: 'about', label: 'O Sistema' },
                { id: 'menu', label: 'Cardápio & Estoque' },
                { id: 'special', label: 'Tarifa Noturna' },
                { id: 'history', label: 'Operação' },
                { id: 'hours', label: 'Horários & Planos' },
                { id: 'reservation', label: 'Agendar Demo' },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => {
                    setActiveNavSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl px-3 py-2 text-xs font-bold text-[#2C221E] hover:bg-[#FAF6F0] hover:text-[#C87A5B]"
                >
                  {link.label}
                </a>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="pt-2 border-t border-[#EFE8DE] flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenAuth('login');
                  }}
                  className="flex-1 rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] py-2.5 text-xs font-bold text-[#2C221E]"
                >
                  Entrar na Conta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenAuth('register');
                  }}
                  className="flex-1 rounded-xl bg-[#C87A5B] py-2.5 text-xs font-bold text-white"
                >
                  Cadastrar Meu Bar
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ============================================================
          SEARCH OVERLAY POPUP (Sarab #searchOv style)
          ============================================================ */}
      {isSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pesquisar no cardápio e estoque"
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#161210]/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl border border-[#EFE8DE] bg-white p-6 sm:p-8 shadow-soft-lg space-y-6"
          >
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Fechar busca"
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF6F0] text-[#70625B] hover:bg-[#C87A5B] hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C87A5B]">
                Busca Rápida de Cardápio &amp; Estoque
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#2C221E] mt-1">
                O que você procura no balcão hoje?
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchApply(searchQuery);
              }}
              className="flex items-center gap-2 rounded-2xl border-2 border-[#EFE8DE] bg-[#FAF6F0] p-1.5 focus-within:border-[#C87A5B] focus-within:bg-white transition-colors"
            >
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar chopp, cerveja Heineken, smash burger, gin..."
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-[#2C221E] focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] px-5 py-2.5 text-xs font-bold text-white transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Buscar</span>
              </button>
            </form>

            {/* Categories inside search popup */}
            <div>
              <p className="text-xs font-bold text-[#70625B] mb-2.5">
                Filtrar por Categoria:
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => handleSearchApply('', cat.key)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
                      selectedCategory === cat.key
                        ? 'border-[#C87A5B] bg-[#C87A5B] text-white'
                        : 'border-[#EFE8DE] bg-[#FAF6F0] text-[#2C221E] hover:border-[#C87A5B]'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div className="border-t border-[#EFE8DE] pt-4">
              <p className="text-xs font-bold text-[#2C221E] flex items-center gap-1.5 mb-2.5">
                <Flame className="h-3.5 w-3.5 text-[#DDA76A]" />
                <span>Mais Buscados no Turno da Noite</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Smash Botequim',
                  'Chopp Pilsen',
                  'Heineken',
                  'Frango Nashville',
                  'Gin Tanqueray',
                  'Petit Gâteau',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSearchApply(tag, 'all')}
                    className="rounded-lg bg-[#FAF6F0] hover:bg-[#C87A5B]/15 hover:text-[#C87A5B] border border-[#EFE8DE] px-3 py-1 text-xs font-semibold text-[#70625B] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          3. SPLIT 50/50 HERO SECTION (Sarab #hero layout)
          ============================================================ */}
      <section
        id="hero"
        className="relative min-h-[86dvh] flex items-center bg-[#FAF6F0] py-14 sm:py-20 overflow-hidden"
      >
        {/* Subtle Watermark Text in Background (Sarab .hbgtxt) */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black tracking-tighter text-[#2C221E]/[0.03] whitespace-nowrap"
        >
          BOTEQUIM
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Badge, Headline, Description, CTAs, 4 Stats */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-white p-1.5 pr-4 shadow-soft border border-[#EFE8DE]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C87A5B] text-white">
                  <Star className="h-3.5 w-3.5 fill-current" />
                </span>
                <span className="text-xs font-bold text-[#2C221E]">
                  #1 Gestão de Balcão, Cardápio &amp; Atendimento Blip IA
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#2C221E] leading-[1.08]">
                Sabor de Boteco,{' '}
                <span className="text-[#C87A5B] underline decoration-[#C87A5B]/30 underline-offset-8">
                  Estoque Blindado
                </span>{' '}
                em Cada Turno
              </h1>

              <p className="text-sm sm:text-base text-[#70625B] leading-relaxed max-w-xl">
                Una a vitrine gastronômica do seu bar ao controle de estoque em tempo real. Faça o{' '}
                <strong className="text-[#2C221E]">balanço cego em 3 minutos</strong>, ative a tabela noturna pós-00h e deixe o assistente da{' '}
                <strong className="text-[#2C221E]">Blip com IA</strong> responder seus clientes consultando o saldo real do balcão.
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#C87A5B] hover:bg-[#B2684B] px-7 py-4 text-sm font-extrabold text-white shadow-soft-lg transition-all active:scale-95"
                >
                  <Utensils className="h-4 w-4" />
                  <span>Explorar Cardápio Vivo</span>
                </a>

                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="group inline-flex items-center gap-3 rounded-full pr-4 py-1.5 text-sm font-bold text-[#2C221E] hover:text-[#C87A5B] transition-colors"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#C87A5B] shadow-soft-md border border-[#EFE8DE] group-hover:bg-[#C87A5B] group-hover:text-white transition-all">
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  </span>
                  <span>Testar Painel &amp; Blip IA</span>
                </button>
              </div>

              {/* 4 Stats Row (Sarab .hstats) */}
              <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-8 border-t border-[#EFE8DE]">
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-[#2C221E]">
                    850<em className="not-italic text-[#C87A5B]">+</em>
                  </span>
                  <small className="text-[11px] font-bold uppercase tracking-wider text-[#70625B]">
                    Bares Ativos
                  </small>
                </div>
                <div className="h-9 w-px bg-[#EFE8DE]" />
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-[#2C221E]">
                    3<em className="not-italic text-[#C87A5B]">min</em>
                  </span>
                  <small className="text-[11px] font-bold uppercase tracking-wider text-[#70625B]">
                    Balanço Cego
                  </small>
                </div>
                <div className="h-9 w-px bg-[#EFE8DE]" />
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-[#2C221E]">
                    -20<em className="not-italic text-[#5B8A62]">%</em>
                  </span>
                  <small className="text-[11px] font-bold uppercase tracking-wider text-[#70625B]">
                    Perdas &amp; Quebras
                  </small>
                </div>
                <div className="h-9 w-px bg-[#EFE8DE] hidden sm:block" />
                <div className="hidden sm:block">
                  <span className="block text-2xl sm:text-3xl font-black text-[#2C221E]">
                    24<em className="not-italic text-[#DDA76A]">h</em>
                  </span>
                  <small className="text-[11px] font-bold uppercase tracking-wider text-[#70625B]">
                    Bot Blip IA
                  </small>
                </div>
              </div>
            </div>

            {/* Right Column: Circular Dish Image + 3 Floating Cards (Sarab .hcircle + .fcard) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
                <div className="w-[88%] h-[88%] rounded-full bg-[#F4EDE4] border-8 border-white shadow-soft-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=1000&q=85"
                    alt="Chopp Pilsen Gelado e Balcão MeuBotequim"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Floating Card 1: Top-Left */}
                <div className="absolute top-6 left-0 sm:-left-4 rounded-2xl bg-white p-3 shadow-soft-lg border border-[#EFE8DE] flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C87A5B]/15 text-[#C87A5B]">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-extrabold text-[#2C221E]">
                      Tarifa Noturna
                    </span>
                    <span className="block text-[11px] text-[#70625B]">
                      +20% automático pós-00h
                    </span>
                  </div>
                </div>

                {/* Floating Card 2: Middle-Right */}
                <div className="absolute top-1/3 right-0 sm:-right-6 rounded-2xl bg-white p-3 shadow-soft-lg border border-[#EFE8DE] flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B8A62]/15 text-[#5B8A62]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-extrabold text-[#2C221E]">
                      Estoque Ao Vivo
                    </span>
                    <span className="block text-[11px] text-[#5B8A62] font-semibold">
                      Sincronizado c/ Blip IA
                    </span>
                  </div>
                </div>

                {/* Floating Card 3: Bottom-Right */}
                <div className="absolute bottom-8 right-4 sm:right-0 rounded-2xl bg-white p-3 shadow-soft-lg border border-[#EFE8DE] flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDA76A]/20 text-[#D97706]">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-extrabold text-[#2C221E]">
                      4.9 / 5.0
                    </span>
                    <span className="block text-[11px] text-[#70625B]">
                      +2.000 avaliações
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. MARQUEE STRIP (Sarab .mqsec style)
          ============================================================ */}
      <div className="bg-[#C87A5B] py-3.5 overflow-hidden border-y border-[#B2684B]">
        <div className="animate-sarab-marquee">
          {[...Array(2)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex items-center gap-10 px-5">
              {[
                'Chopp Pilsen 50L Gelado',
                'Smash Burgers na Brasa',
                'Balanço Cego de Balcão em 3 Minutos',
                'Frango Crocante Nashville',
                'Atendimento Blip Chat + Gemini Function Calling',
                'Drinks Autorais & Gin Tanqueray',
                'Tabela de Preço Diurno & Noturno Pós-00h',
                'Lista de Reposição Direto no WhatsApp',
              ].map((item, idx) => (
                <span
                  key={`${groupIndex}-${idx}`}
                  className="inline-flex items-center gap-3 text-xs sm:text-sm font-bold text-white whitespace-nowrap"
                >
                  <span className="h-2 w-2 rounded-full bg-white/60" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          5. BROWSE BY CATEGORY (Sarab #category style)
          ============================================================ */}
      <section id="category" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] scroll-mt-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87A5B]">
              O Que Servimos &amp; Controlamos
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C221E] mt-1">
              Navegue por <span className="text-[#C87A5B]">Categoria</span>
            </h2>
            <div className="h-1 w-14 bg-[#C87A5B] rounded-full mx-auto my-3" />
            <p className="text-xs sm:text-sm text-[#70625B]">
              Clique em uma categoria para filtrar instantaneamente os pratos, chopps e destilados monitorados pelo estoque do MeuBotequim.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategorySelect(cat.key, true)}
                  className={`group rounded-2xl p-5 text-center transition-all border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B] ${
                    isSelected
                      ? 'bg-white border-[#C87A5B] shadow-soft-lg -translate-y-1'
                      : 'bg-white border-transparent hover:border-[#C87A5B]/50 shadow-soft hover:-translate-y-1'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-[#FAF6F0] shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="text-xs sm:text-sm font-extrabold text-[#2C221E] mb-0.5">
                    {cat.name}
                  </div>
                  <div className="text-[11px] font-semibold text-[#70625B]">
                    {cat.count}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          6. ABOUT / OUR STORY (Sarab #about split image-stack style)
          ============================================================ */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#EFE8DE] scroll-mt-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image Stack (Sarab .astack) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-soft-lg border border-[#EFE8DE]">
                  <img
                    src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=900&q=85"
                    alt="Prateleiras de Destilados e Balcão MeuBotequim"
                    className="w-full h-[420px] object-cover block"
                  />
                </div>

                {/* Experience Badge (Sarab .aexp) */}
                <div className="absolute top-6 -left-3 sm:-left-5 rounded-2xl bg-[#C87A5B] text-white px-5 py-4 text-center shadow-soft-lg">
                  <span className="block text-3xl font-black leading-none">
                    100%
                  </span>
                  <small className="text-[11px] font-semibold opacity-95 block mt-1">
                    Estoque &amp; Balcão<br />Sincronizados
                  </small>
                </div>

                {/* Secondary Overlapping Image (Sarab .asm) */}
                <div className="hidden sm:block absolute -bottom-6 -right-6 w-44 h-44 rounded-2xl overflow-hidden border-4 border-white shadow-soft-lg">
                  <img
                    src="https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=500&q=80"
                    alt="Bartender preparando drink no balcão"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Story & 3 Pillar Rows */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C87A5B]">
                  Por Que o MeuBotequim?
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-[#2C221E] mt-1 leading-tight">
                  Da Cozinha ao Balcão,{' '}
                  <span className="text-[#C87A5B]">Zero Furo no Estoque</span>
                </h2>
                <div className="h-1 w-14 bg-[#C87A5B] rounded-full my-3" />
                <p className="text-xs sm:text-sm text-[#70625B] leading-relaxed">
                  Não adianta lotar a casa na sexta e no sábado se o lucro escorre pelo ralo em compras de emergência, chopp sem registro de sangria e anotações em papel. O MeuBotequim conecta seu cardápio ao saldo real de garrafas, barris e insumos.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#C87A5B]/15 text-[#C87A5B]">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#2C221E]">
                      Insumos Frescos &amp; Ficha Técnica Automática
                    </h3>
                    <p className="text-xs text-[#70625B] leading-relaxed mt-0.5">
                      Saiba exatamente quanto custa cada drink ou hambúrguer e receba alertas antecipados quando o estoque atingir o ponto de pedido.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DDA76A]/20 text-[#D97706]">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#2C221E]">
                      Balanço Cego de Balcão em 3 Minutos
                    </h3>
                    <p className="text-xs text-[#70625B] leading-relaxed mt-0.5">
                      O bartender conta as garrafas na troca de turno sem ver o saldo esperado pelo sistema. Divergências são calculadas na hora para o proprietário.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5B8A62]/15 text-[#5B8A62]">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#2C221E]">
                      Atendimento Blip Chat + Gemini Function Calling
                    </h3>
                    <p className="text-xs text-[#70625B] leading-relaxed mt-0.5">
                      Nosso assistente conversacional responde clientes no Blip Chat consultando preços e estoque disponível em tempo real no MongoDB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="inline-flex items-center gap-2 rounded-full bg-[#C87A5B] hover:bg-[#B2684B] px-7 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-soft transition-all active:scale-95"
                >
                  <Store className="h-4 w-4" />
                  <span>Abrir Demonstração do Painel</span>
                </button>
                <button
                  type="button"
                  onClick={() => openBlipChatWidget()}
                  className="inline-flex items-center gap-2 rounded-full border border-[#EFE8DE] bg-[#FAF6F0] hover:bg-[#EFE8DE] px-6 py-3.5 text-xs sm:text-sm font-bold text-[#2C221E] transition-colors"
                >
                  <MessageSquare className="h-4 w-4 text-[#D97706]" />
                  <span>Conversar com o Bot Blip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. INTERACTIVE MENU & LIVE STOCK CATALOG (Sarab #menu style)
          ============================================================ */}
      <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] scroll-mt-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87A5B]">
              Vitrine Conectada ao PostgreSQL + Prisma
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C221E] mt-1">
              Nosso Cardápio &amp; <span className="text-[#C87A5B]">Estoque Ao Vivo</span>
            </h2>
            <div className="h-1 w-14 bg-[#C87A5B] rounded-full mx-auto my-3" />
            <p className="text-xs sm:text-sm text-[#70625B]">
              Cada card abaixo exibe o preço Diurno, a tarifa Noturna (pós-00h) e o saldo real disponível. Clique em qualquer item ou no botão <strong className="text-[#2C221E]">+</strong> para inspecionar os detalhes.
            </p>
          </div>

          {/* Accessible Category Filter Tablist (modern-web-guidance tabs pattern) */}
          <div
            role="tablist"
            aria-label="Filtrar itens por categoria"
            className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`relative shrink-0 rounded-full px-5 py-2.5 text-xs font-bold border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B] ${
                    isSelected
                      ? 'bg-[#C87A5B] border-[#C87A5B] text-white shadow-soft after:content-[""] after:absolute after:-bottom-1.5 after:left-4 after:right-4 after:border-b-[3px] after:border-[#2C221E]'
                      : 'bg-white border-[#EFE8DE] text-[#70625B] hover:border-[#C87A5B] hover:text-[#2C221E]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {searchQuery && (
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-white border border-[#EFE8DE] px-4 py-2.5 text-xs">
              <span>
                Exibindo resultados para: <strong className="text-[#C87A5B]">&ldquo;{searchQuery}&rdquo;</strong>
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="font-bold text-[#C24E48] hover:underline"
              >
                Limpar filtro
              </button>
            </div>
          )}

          {/* Menu Cards Grid (Sarab #mgrid / .mcard) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item) => {
              const isLiked = likedIds.has(item.id);
              const badgeColor =
                item.badge?.variant === 'new'
                  ? 'bg-[#5B8A62] text-white'
                  : item.badge?.variant === 'hot'
                  ? 'bg-[#DDA76A] text-[#2C221E]'
                  : 'bg-[#C87A5B] text-white';

              return (
                <article
                  key={item.id}
                  onClick={() => {
                    setDetailItem(item);
                    setDetailQty(1);
                  }}
                  className="group rounded-3xl bg-white border border-[#EFE8DE] overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-52 bg-[#F4EDE4] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {item.badge && (
                        <span
                          className={`absolute top-3.5 left-3.5 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-extrabold shadow-sm ${badgeColor}`}
                        >
                          <Star className="h-3 w-3 fill-current" />
                          <span>{item.badge.text}</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => toggleLike(item.id, e)}
                        aria-label={isLiked ? 'Remover dos favoritos' : 'Favoritar item'}
                        className={`absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-soft transition-transform hover:scale-110 ${
                          isLiked ? 'text-[#C24E48]' : 'text-stone-400 hover:text-[#C24E48]'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      </button>

                      {/* Real-time stock pill */}
                      <span className="absolute bottom-3 left-3.5 rounded-full bg-[#161210]/85 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white">
                        Estoque: {item.stockCount} {item.unit}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#C87A5B] mb-1">
                        <span>{item.categoryLabel}</span>
                        <span className="text-[#70625B] font-mono">
                          Noite: R$ {item.priceNight.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-[#2C221E] group-hover:text-[#C87A5B] transition-colors mb-1.5">
                        {item.title}
                      </h3>

                      <p className="text-xs text-[#70625B] leading-relaxed line-clamp-2">
                        {item.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-[#EFE8DE]/60">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-[#C87A5B]">
                          R$ {item.priceDay.toFixed(2).replace('.', ',')}
                        </span>
                        {item.oldPrice && (
                          <small className="text-xs text-stone-400 line-through">
                            R$ {item.oldPrice.toFixed(2).replace('.', ',')}
                          </small>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#D97706] font-bold mt-0.5">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{item.rating}</span>
                        <span className="text-[#70625B] font-normal text-[11px]">
                          ({item.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailItem(item);
                        setDetailQty(1);
                      }}
                      title="Ver ficha completa e estoque"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C87A5B] hover:bg-[#B2684B] text-white shadow-soft transition-transform group-hover:rotate-90"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-2 rounded-full bg-[#2C221E] hover:bg-[#C87A5B] px-8 py-4 text-xs sm:text-sm font-extrabold text-white shadow-soft-lg transition-all active:scale-95"
            >
              <Store className="h-4 w-4" />
              <span>Gerenciar Todos os Produtos e Preços no Painel</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          MENU DETAIL POPUP MODAL (Sarab #menuPop style)
          ============================================================ */}
      {detailItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={detailItem.title}
          onClick={() => setDetailItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#161210]/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-white border border-[#EFE8DE] overflow-hidden shadow-soft-lg"
          >
            <button
              type="button"
              onClick={() => setDetailItem(null)}
              aria-label="Fechar detalhes"
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#2C221E] hover:bg-[#C87A5B] hover:text-white shadow-soft transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="h-56 bg-[#F4EDE4] relative">
              <img
                src={detailItem.image}
                alt={detailItem.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-4 rounded-full bg-[#161210]/85 px-3 py-1 text-xs font-bold text-white">
                Saldo no Balcão: {detailItem.stockCount} {detailItem.unit}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C87A5B]">
                  {detailItem.categoryLabel}
                </span>
                <h3 className="text-xl font-black text-[#2C221E] mt-0.5">
                  {detailItem.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#70625B] mt-1">
                  <span className="inline-flex items-center gap-1 font-bold text-[#D97706]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {detailItem.rating} ({detailItem.reviewsCount} avaliações)
                  </span>
                  <span>•</span>
                  <span>Preparo: {detailItem.prepTimeMinutes} min</span>
                  <span>•</span>
                  <span>{detailItem.caloriesOrAbv}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#70625B] leading-relaxed">
                {detailItem.fullDesc}
              </p>

              {/* Price Diurno vs Noturno & Quantity */}
              <div className="rounded-2xl bg-[#FAF6F0] border border-[#EFE8DE] p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="block text-[11px] font-bold text-[#70625B]">
                    Total Estimado ({detailQty}x)
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-black text-[#C87A5B]">
                      R$ {(detailItem.priceDay * detailQty).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs font-bold text-[#70625B]">
                      (Pós-00h: R$ {(detailItem.priceNight * detailQty).toFixed(2).replace('.', ',')})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white rounded-xl border border-[#EFE8DE] p-1">
                  <button
                    type="button"
                    onClick={() => setDetailQty((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#FAF6F0] text-[#2C221E]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center text-xs font-extrabold text-[#2C221E]">
                    {detailQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDetailQty((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#FAF6F0] text-[#2C221E]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {detailItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-[#FAF6F0] border border-[#EFE8DE] px-2.5 py-1 text-[11px] font-semibold text-[#70625B]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDetailItem(null);
                    openBlipChatWidget();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D97706] bg-[#D97706]/10 hover:bg-[#D97706] hover:text-white py-3 text-xs font-extrabold text-[#D97706] transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Perguntar no Blip Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDetailItem(null);
                    onNavigateToDashboard();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] py-3 text-xs font-extrabold text-white shadow-soft transition-colors"
                >
                  <Store className="h-4 w-4" />
                  <span>Auditar no Painel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          8. SPECIAL OFFER / NIGHT PRICING COUNTDOWN (Sarab #special style)
          ============================================================ */}
      <section
        id="special"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1C1210] text-white relative overflow-hidden scroll-mt-16"
      >
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#DDA76A] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#1C1210]">
                <Zap className="h-3.5 w-3.5" />
                <span>Automação Exclusiva Pós-Meia-Noite</span>
              </span>

              <h2 className="text-3xl sm:text-5xl font-black leading-[1.1] tracking-tight">
                Virada Automática de{' '}
                <span className="text-[#DDA76A]">Tarifa Noturna</span> &amp; Giro de Fim de Semana
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                Configure o acréscimo padrão (+20% entre 00h e 06h) e deixe o MeuBotequim atualizar os preços de balcão e as respostas do assistente Blip IA automaticamente no horário de pico da madrugada.
              </p>

              {/* Countdown boxes (Sarab .cdwrap) */}
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#DDA76A] mb-2.5">
                  Contagem para abertura do Turno Noturno de Pico:
                </p>
                <div className="flex items-center gap-3.5">
                  {[
                    { value: String(countdown.hours).padStart(2, '0'), label: 'Horas' },
                    { value: String(countdown.minutes).padStart(2, '0'), label: 'Minutos' },
                    { value: String(countdown.seconds).padStart(2, '0'), label: 'Segundos' },
                  ].map((box) => (
                    <div
                      key={box.label}
                      className="min-w-[78px] rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-center"
                    >
                      <span className="block text-2xl sm:text-3xl font-black font-mono text-white leading-none">
                        {box.value}
                      </span>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-300 mt-1">
                        {box.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="inline-flex items-center gap-2 rounded-full bg-[#C87A5B] hover:bg-[#B2684B] px-8 py-4 text-xs sm:text-sm font-extrabold text-white shadow-soft-lg transition-all active:scale-95"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Configurar Preço Noturno no Painel</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="relative max-w-md w-full text-center">
                {/* Circular Price Badge (Sarab .sppbdg) */}
                <div className="absolute top-4 left-4 z-20 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[#C87A5B] text-white shadow-soft-lg border-4 border-[#1C1210]">
                  <span className="text-[11px] text-white/80">Dia: R$ 12</span>
                  <span className="text-lg font-black leading-tight">R$ 15,00</span>
                  <span className="text-[9px] font-bold uppercase">Pós-00h</span>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=85"
                  alt="Operação Noturna de Balcão e Drinks MeuBotequim"
                  className="w-full max-w-[420px] mx-auto rounded-3xl shadow-soft-lg border border-white/10 object-cover h-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          9. BENTO FOOD & OPERATION SHOWCASE GALLERY (Sarab #gallery style)
          ============================================================ */}
      <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] scroll-mt-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87A5B]">
              Bastidores do Bar
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C221E] mt-1">
              Galeria da <span className="text-[#C87A5B]">Operação</span>
            </h2>
            <div className="h-1 w-14 bg-[#C87A5B] rounded-full mx-auto my-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4 lg:h-[460px]">
            {GALLERY_ITEMS.map((gItem, idx) => (
              <div
                key={gItem.id}
                onClick={() => setActiveGalleryIndex(idx)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer border border-[#EFE8DE] shadow-soft ${
                  idx === 0 ? 'lg:row-span-2 h-72 lg:h-full' : 'h-56 lg:h-full'
                }`}
              >
                <img
                  src={gItem.image}
                  alt={gItem.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161210]/90 via-[#161210]/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDA76A]">
                    {gItem.subtitle}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {gItem.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Lightbox Modal (Sarab #galPop) */}
      {activeGalleryIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visualização da galeria"
          onClick={() => setActiveGalleryIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#161210]/85 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-3xl bg-white border border-[#EFE8DE] overflow-hidden shadow-soft-lg"
          >
            <button
              type="button"
              onClick={() => setActiveGalleryIndex(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#2C221E] hover:bg-[#C87A5B] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={GALLERY_ITEMS[activeGalleryIndex].image}
              alt={GALLERY_ITEMS[activeGalleryIndex].title}
              className="w-full h-72 object-cover"
            />
            <div className="p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C87A5B]">
                {GALLERY_ITEMS[activeGalleryIndex].subtitle}
              </span>
              <h4 className="text-lg font-black text-[#2C221E]">
                {GALLERY_ITEMS[activeGalleryIndex].title}
              </h4>
              <p className="text-xs sm:text-sm text-[#70625B] leading-relaxed">
                {GALLERY_ITEMS[activeGalleryIndex].description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#EFE8DE]">
                <button
                  type="button"
                  onClick={() =>
                    setActiveGalleryIndex(
                      (activeGalleryIndex - 1 + GALLERY_ITEMS.length) %
                        GALLERY_ITEMS.length,
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-4 py-2 text-xs font-bold text-[#2C221E] hover:bg-[#EFE8DE]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </button>
                <span className="text-xs font-semibold text-[#70625B]">
                  {activeGalleryIndex + 1} / {GALLERY_ITEMS.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveGalleryIndex(
                      (activeGalleryIndex + 1) % GALLERY_ITEMS.length,
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-4 py-2 text-xs font-bold text-[#2C221E] hover:bg-[#EFE8DE]"
                >
                  <span>Próximo</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          10. ALTERNATING VERTICAL TIMELINE (Sarab #history style)
          ============================================================ */}
      <section
        id="history"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#EFE8DE] scroll-mt-16"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87A5B]">
              Fluxo Operacional
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C221E] mt-1">
              Como Funciona a <span className="text-[#C87A5B]">Rotina do Bar</span>
            </h2>
            <div className="h-1 w-14 bg-[#C87A5B] rounded-full mx-auto my-3" />
            <p className="text-xs sm:text-sm text-[#70625B]">
              Da chegada do caminhão de bebidas até o fechamento do caixa e atendimento via Blip IA.
            </p>
          </div>

          <div className="relative">
            {/* Vertical center line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5 bg-[#EFE8DE]" />

            <div className="space-y-10">
              {TIMELINE_STEPS.map((item, idx) => {
                const isOdd = idx % 2 === 0;
                return (
                  <div
                    key={item.year}
                    className="grid grid-cols-1 md:grid-cols-11 items-start gap-4"
                  >
                    {/* Left Side */}
                    <div
                      className={`md:col-span-5 ${
                        isOdd ? 'md:text-right' : 'hidden md:block md:invisible'
                      }`}
                    >
                      <div className="rounded-2xl border border-[#EFE8DE] bg-[#FAF6F0] p-5 shadow-soft">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#C87A5B]">
                          {item.year}
                        </span>
                        <h3 className="text-base font-extrabold text-[#2C221E] mt-1 mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#70625B] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Center Dot */}
                    <div className="hidden md:flex md:col-span-1 justify-center pt-5">
                      <span className="h-4 w-4 rounded-full bg-[#C87A5B] ring-4 ring-[#FAF6F0] border-2 border-white shadow-sm" />
                    </div>

                    {/* Right Side */}
                    <div
                      className={`md:col-span-5 ${
                        !isOdd ? 'md:text-left' : 'md:invisible'
                      }`}
                    >
                      <div className="rounded-2xl border border-[#EFE8DE] bg-[#FAF6F0] p-5 shadow-soft">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#C87A5B]">
                          {item.year}
                        </span>
                        <h3 className="text-base font-extrabold text-[#2C221E] mt-1 mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#70625B] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          11. OPERATIONAL TEAM & PROFILES (Sarab #chefs style)
          ============================================================ */}
      <section id="chefs" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] border-t border-[#EFE8DE]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87A5B]">
              Multi-Perfil Isolado
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C221E] mt-1">
              Feito para Toda a <span className="text-[#C87A5B]">Equipe do Bar</span>
            </h2>
            <div className="h-1 w-14 bg-[#C87A5B] rounded-full mx-auto my-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_ROLES.map((member) => (
              <div
                key={member.name}
                className="group rounded-3xl bg-white border border-[#EFE8DE] overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="h-64 bg-[#F4EDE4] overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-base font-extrabold text-[#2C221E]">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#C87A5B] mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-[#70625B] mt-1.5">
                    {member.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          12. OPENING HOURS & TRANSPARENT PLANS (Sarab #hours emerald section)
          ============================================================ */}
      <section
        id="hours"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1F4E3B] text-white relative overflow-hidden scroll-mt-16"
      >
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A5D6BC]">
              Turnos &amp; Assinatura SaaS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Horários de Operação &amp; <span className="text-[#DDA76A]">Planos</span>
            </h2>
            <div className="h-1 w-14 bg-[#DDA76A] rounded-full mx-auto my-3" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left (5 cols): Shifts & Opening Hours (Sarab .hrscard) */}
            <div className="lg:col-span-5 rounded-3xl bg-white/10 border border-white/15 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-[#DDA76A]" />
                  <span>Turnos Monitorados no Balcão</span>
                </h3>
                <div className="divide-y divide-white/10 text-xs sm:text-sm">
                  <div className="py-3.5 flex items-center justify-between">
                    <span className="text-white/80">Segunda-feira (Balanço Geral)</span>
                    <span className="inline-flex items-center gap-2 font-bold text-[#FF8A8A]">
                      <span className="h-2 w-2 rounded-full bg-[#FF8A8A]" />
                      Interno
                    </span>
                  </div>
                  <div className="py-3.5 flex items-center justify-between">
                    <span className="text-white/80">Terça a Quinta-feira</span>
                    <span className="inline-flex items-center gap-2 font-bold text-white">
                      <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />
                      17:00 - 01:00
                    </span>
                  </div>
                  <div className="py-3.5 flex items-center justify-between">
                    <span className="text-white/80">Sexta e Sábado (Pico + Noturno)</span>
                    <span className="inline-flex items-center gap-2 font-bold text-[#DDA76A]">
                      <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />
                      16:00 - 04:00
                    </span>
                  </div>
                  <div className="py-3.5 flex items-center justify-between">
                    <span className="text-white/80">Domingos &amp; Feriados</span>
                    <span className="inline-flex items-center gap-2 font-bold text-white">
                      <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />
                      12:00 - 23:00
                    </span>
                  </div>
                  <div className="py-3.5 flex items-center justify-between">
                    <span className="text-white/80">Assistente Blip Chat + IA</span>
                    <span className="inline-flex items-center gap-2 font-bold text-[#A5D6BC]">
                      <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />
                      24h Online
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
                <span>Suporte WhatsApp Prioritário</span>
                <strong className="text-white">(11) 98765-4321</strong>
              </div>
            </div>

            {/* Center (3 cols): Highlight CTA Card (Sarab .hrscta) */}
            <div className="lg:col-span-3 rounded-3xl bg-[#C87A5B] p-7 text-center flex flex-col items-center justify-center shadow-soft-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white mb-4">
                <Store className="h-7 w-7" />
              </div>
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white mb-2">
                Mais Escolhido
              </span>
              <h3 className="text-xl font-black text-white">
                Plano Bar Pro
              </h3>
              <p className="text-xs text-white/85 mt-1 mb-4">
                SKUs ilimitados, Balanço Cego em 3 min, Preço Noturno e Bot Blip IA.
              </p>
              <div className="mb-5">
                <span className="text-3xl font-black text-white">
                  {isAnnualPlan ? 'R$ 119' : 'R$ 149'}
                </span>
                <span className="text-xs text-white/80">/mês</span>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAuth('register')}
                className="w-full rounded-full bg-white text-[#C87A5B] hover:bg-[#FAF6F0] py-3 text-xs font-extrabold shadow-soft transition-transform active:scale-95"
              >
                Testar 14 Dias Grátis
              </button>
            </div>

            {/* Right (4 cols): Plan Comparison & Switch */}
            <div className="lg:col-span-4 rounded-3xl bg-white/10 border border-white/15 p-6 sm:p-7 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white">
                    Todos os Planos
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAnnualPlan(!isAnnualPlan)}
                    className="rounded-full bg-white/15 hover:bg-white/25 px-3 py-1 text-[11px] font-bold text-[#DDA76A] transition-colors"
                  >
                    {isAnnualPlan ? 'Anual (-20% OFF)' : 'Ver Desconto Anual'}
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="rounded-2xl bg-white/10 p-3.5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-white">Botequim Starter</p>
                      <p className="text-[11px] text-white/75">Até 100 SKUs • 2 Usuários</p>
                    </div>
                    <span className="text-base font-black text-[#DDA76A]">
                      {isAnnualPlan ? 'R$ 71' : 'R$ 89'}/mês
                    </span>
                  </div>

                  <div className="rounded-2xl bg-white/15 p-3.5 border border-[#DDA76A] flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-white">Bar Pro (Completo)</p>
                      <p className="text-[11px] text-white/80">SKUs Ilimitados + Blip IA</p>
                    </div>
                    <span className="text-base font-black text-[#DDA76A]">
                      {isAnnualPlan ? 'R$ 119' : 'R$ 149'}/mês
                    </span>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-3.5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-white">Redes &amp; Multi-Bares</p>
                      <p className="text-[11px] text-white/75">Múltiplas Filiais &amp; DRE</p>
                    </div>
                    <span className="text-base font-black text-[#DDA76A]">
                      {isAnnualPlan ? 'R$ 239' : 'R$ 299'}/mês
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-white/75 mt-4 flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[#4ADE80] shrink-0" />
                <span>Sem fidelidade e sem necessidade de cartão no teste.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          13. CUSTOMER TESTIMONIALS (Sarab #testimonials style)
          ============================================================ */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#EFE8DE]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87A5B]">
              Quem Usa no Balcão
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C221E] mt-1">
              Avaliação dos <span className="text-[#C87A5B]">Donos de Bares</span>
            </h2>
            <div className="h-1 w-14 bg-[#C87A5B] rounded-full mx-auto my-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-3xl bg-[#FAF6F0] border border-[#EFE8DE] p-7 shadow-soft flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#D97706]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#2C221E] leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-[#EFE8DE]">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-11 w-11 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-[#2C221E]">
                      {t.name}
                    </div>
                    <div className="text-[11px] font-semibold text-[#70625B]">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          14. RESERVATION / DEMO BOOKING FORM (Sarab #reservation style)
          ============================================================ */}
      <section id="reservation" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] scroll-mt-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87A5B]">
              Implantação &amp; Reservas
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C221E] mt-1">
              Agende uma <span className="text-[#C87A5B]">Demonstração ou Mesa</span>
            </h2>
            <div className="h-1 w-14 bg-[#C87A5B] rounded-full mx-auto my-3" />
            <p className="text-xs sm:text-sm text-[#70625B]">
              Quer implantar o MeuBotequim no seu estabelecimento ou reservar uma experiência gastronômica? Preencha abaixo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Dark Contact Card (4 cols) */}
            <div className="lg:col-span-4 rounded-3xl bg-[#161210] text-white p-7 sm:p-8 space-y-6 shadow-soft-lg">
              <div>
                <h3 className="text-xl font-black text-white">
                  Central de Atendimento
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Respondemos em menos de 15 minutos ou instantaneamente pelo assistente J.A.R.V.I.S. no Blip Chat.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C87A5B]/20 text-[#C87A5B]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block text-[11px] uppercase tracking-wider text-stone-400">
                      Horário de Atendimento
                    </strong>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      Ter a Dom, 09:00 às 23:00 (24h via Blip IA)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C87A5B]/20 text-[#C87A5B]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block text-[11px] uppercase tracking-wider text-stone-400">
                      WhatsApp &amp; Comercial
                    </strong>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      (11) 98765-4321 • Ramal MacLaren&apos;s
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C87A5B]/20 text-[#C87A5B]">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block text-[11px] uppercase tracking-wider text-stone-400">
                      Grupos &amp; Franquias Parceiras
                    </strong>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      Taverna do Moe, MacLaren&apos;s Pub, The Garrison &amp; 7th Heaven
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C87A5B]/20 text-[#C87A5B]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block text-[11px] uppercase tracking-wider text-stone-400">
                      Localização
                    </strong>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      Av. MacLaren&apos;s, 742 (Ao lado do Central Perk) - Vila Madalena, SP
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openBlipChatWidget()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] py-3 text-xs font-extrabold text-white transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chamar Atendente no Blip Chat</span>
              </button>
            </div>

            {/* Right Form Card (8 cols) */}
            <div className="lg:col-span-8 rounded-3xl bg-white border border-[#EFE8DE] p-6 sm:p-8 shadow-soft">
              <form onSubmit={handleReservationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="res-name"
                      className="block text-xs font-bold text-[#2C221E] mb-1.5"
                    >
                      Nome Completo *
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      required
                      value={resForm.fullName}
                      onChange={(e) =>
                        setResForm({ ...resForm, fullName: e.target.value })
                      }
                      placeholder="Ex: Rafael Brandão"
                      className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="res-phone"
                      className="block text-xs font-bold text-[#2C221E] mb-1.5"
                    >
                      Telefone / WhatsApp *
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      required
                      value={resForm.phone}
                      onChange={(e) =>
                        setResForm({ ...resForm, phone: e.target.value })
                      }
                      placeholder="(11) 99999-9999"
                      className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="res-email"
                      className="block text-xs font-bold text-[#2C221E] mb-1.5"
                    >
                      E-mail Corporativo *
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      required
                      value={resForm.email}
                      onChange={(e) =>
                        setResForm({ ...resForm, email: e.target.value })
                      }
                      placeholder="voce@seubar.com.br"
                      className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="res-size"
                      className="block text-xs font-bold text-[#2C221E] mb-1.5"
                    >
                      Porte do Estabelecimento / Mesa *
                    </label>
                    <select
                      id="res-size"
                      value={resForm.barSize}
                      onChange={(e) =>
                        setResForm({ ...resForm, barSize: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs font-semibold text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
                    >
                      <option>Boteco / Quiosque (até 50 lugares)</option>
                      <option>Bar Médio (50 a 150 lugares)</option>
                      <option>Choperia / Casa Noturna (150+ lugares)</option>
                      <option>Rede / Grupo Gastronômico (2+ filiais)</option>
                      <option>Reserva de Mesa para Clientes</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="res-date"
                      className="block text-xs font-bold text-[#2C221E] mb-1.5"
                    >
                      Data Preferencial
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      value={resForm.date}
                      onChange={(e) =>
                        setResForm({ ...resForm, date: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="res-time"
                      className="block text-xs font-bold text-[#2C221E] mb-1.5"
                    >
                      Horário Preferencial
                    </label>
                    <select
                      id="res-time"
                      value={resForm.time}
                      onChange={(e) =>
                        setResForm({ ...resForm, time: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs font-semibold text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
                    >
                      <option>10:00</option>
                      <option>14:00</option>
                      <option>16:00</option>
                      <option>18:00</option>
                      <option>19:00</option>
                      <option>20:30</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="res-notes"
                    className="block text-xs font-bold text-[#2C221E] mb-1.5"
                  >
                    Observações ou Necessidades do Bar
                  </label>
                  <textarea
                    id="res-notes"
                    rows={3}
                    value={resForm.notes}
                    onChange={(e) =>
                      setResForm({ ...resForm, notes: e.target.value })
                    }
                    placeholder="Conte se você deseja priorizar balanço cego, controle de chopp ou integração com WhatsApp/Blip..."
                    className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87A5B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C87A5B] hover:bg-[#B2684B] py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-soft transition-all active:scale-95"
                >
                  <CalendarCheck className="h-4 w-4" />
                  <span>Confirmar Agendamento</span>
                </button>

                {resSubmitted && (
                  <div
                    role="status"
                    className="rounded-2xl bg-[#5B8A62]/15 border border-[#5B8A62]/30 p-3.5 text-xs font-bold text-[#5B8A62] flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 shrink-0" />
                    <span>
                      Solicitação registrada com sucesso! Nossa equipe entrará em contato pelo WhatsApp informado.
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          15. NEWSLETTER BANNER (Sarab #newsletter style)
          ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#2C221E] text-white">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#DDA76A]">
            Boletim de Gestão de Bares
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Receba Planilhas de Ficha Técnica &amp;{' '}
            <span className="text-[#DDA76A]">Dicas de Giro</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            Cadastre seu e-mail para receber alertas de tendências para bares, restaurantes e automação com IA.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newsletterEmail.trim()) {
                setNewsletterSubmitted(true);
                setNewsletterEmail('');
              }
            }}
            className="mx-auto max-w-lg flex flex-col sm:flex-row gap-2 pt-2"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Digite seu melhor e-mail..."
              className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-xs text-white placeholder:text-stone-400 focus:border-[#DDA76A] focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87A5B] hover:bg-[#B2684B] px-6 py-3 text-xs font-extrabold text-white transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Inscrever-se</span>
            </button>
          </form>

          {newsletterSubmitted ? (
            <p className="text-xs font-bold text-[#4ADE80]">
              Inscrição confirmada! Obrigado por acompanhar o MeuBotequim.
            </p>
          ) : (
            <p className="text-[11px] text-stone-400 inline-flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <span>Zero spam. Cancele quando quiser.</span>
            </p>
          )}
        </div>
      </section>

      {/* ============================================================
          16. 4-COLUMN FOOTER (Sarab footer style)
          ============================================================ */}
      <footer className="bg-[#14110F] text-stone-300 pt-16 pb-10 px-4 sm:px-6 lg:px-8 border-t border-white/10 text-xs">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Col 1: Brand */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C87A5B] overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="MeuBotequim"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-xl font-black text-white">
                  Meu<span className="text-[#C87A5B]">Botequim</span>
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
                Plataforma completa de gestão de estoque, balanço cego em 3 minutos, precificação noturna e atendimento inteligente integrado ao Blip Chat com Gemini IA.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Navegação
              </h4>
              <ul className="space-y-2 text-stone-400">
                <li>
                  <a href="#hero" className="hover:text-[#DDA76A] transition-colors">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#DDA76A] transition-colors">
                    Sobre o Sistema
                  </a>
                </li>
                <li>
                  <a href="#menu" className="hover:text-[#DDA76A] transition-colors">
                    Cardápio &amp; Estoque
                  </a>
                </li>
                <li>
                  <a href="#hours" className="hover:text-[#DDA76A] transition-colors">
                    Horários &amp; Planos
                  </a>
                </li>
                <li>
                  <a href="#reservation" className="hover:text-[#DDA76A] transition-colors">
                    Agendar Demo
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Categories */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Categorias
              </h4>
              <ul className="space-y-2 text-stone-400">
                {CATEGORIES.slice(1).map((cat) => (
                  <li key={cat.key}>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(cat.key, true)}
                      className="hover:text-[#DDA76A] transition-colors text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact Info */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Contato &amp; Acesso Rápido
              </h4>
              <div className="space-y-2.5 text-stone-400">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#C87A5B] shrink-0" />
                  <span>
                    Av. MacLaren&apos;s, 742 (Ao lado do Central Perk) - Vila Madalena, SP
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#C87A5B] shrink-0" />
                  <span>(11) 98765-4321 • Ramal MacLaren&apos;s</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#C87A5B] shrink-0" />
                  <span>contato@meubotequim.com.br</span>
                </p>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  Acessar Painel
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('login')}
                  className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  Login SaaS
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <p>
              © {new Date().getFullYear()} MeuBotequim. Todos os direitos reservados.
            </p>
            <p>
              Arquitetura Full-Stack NestJS + PostgreSQL (Prisma) + React 19 + Blip Chat IA
            </p>
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

      {/* Assistente Virtual Blip Chat */}
      <BlipChatWidget
        establishmentId={
          typeof window !== 'undefined'
            ? localStorage.getItem('tenantId') || undefined
            : undefined
        }
      />
    </div>
  );
};

export default LandingPage;
