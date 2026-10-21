import React, { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  AlertOctagon,
  TrendingDown,
  CalendarCheck,
  ShoppingBag,
  CheckCircle2,
  RefreshCw,
  Wifi,
  WifiOff,
  LayoutDashboard,
  BarChart3,
  Tag,
  Wine,
  Store,
  History,
} from 'lucide-react';
import { Header } from '../components/meubotequim/Header';
import { KpiCard } from '../components/meubotequim/KpiCard';
import { ActionButtons } from '../components/meubotequim/ActionButtons';
import { AlertTable } from '../components/meubotequim/AlertTable';
import { ShoppingListDrawer } from '../components/meubotequim/ShoppingListDrawer';
import {
  NewEntryModal,
  RegisterLossModal,
  BlindAuditModal,
} from '../components/meubotequim/QuickActionModals';
import { AuthModal } from '../components/meubotequim/AuthModal';
import { CategoriesManager } from '../components/meubotequim/CategoriesManager';
import { StoreCustomizer } from '../components/meubotequim/StoreCustomizer';
import { DashboardAnalytics } from '../components/meubotequim/DashboardAnalytics';
import { DrinkRecipesManager } from '../components/meubotequim/DrinkRecipesManager';
import { AuditTrailTable } from '../components/meubotequim/AuditTrailTable';
import { EditPriceModal } from '../components/meubotequim/EditPriceModal';
import { NewProductModal } from '../components/meubotequim/NewProductModal';
import {
  authService,
  inventoryService,
  tenantService,
  categoryService,
  productManagementService,
} from '../services/api';
import {
  MovementType,
  type BarProfile,
  type ReplenishmentProduct,
  type ShoppingCartItem,
  type DashboardMetrics,
  type AuthSession,
  type Category,
  type Tenant,
  type StockMovement,
} from '../types';

type DashboardTab =
  | 'overview'
  | 'analytics'
  | 'categories'
  | 'recipes'
  | 'customization'
  | 'audit';

// Mock de dados representativos para Bar & Botequim (fallback inicial)
const INITIAL_PRODUCTS: ReplenishmentProduct[] = [
  {
    id: 'prod-1',
    name: 'Chopp Pilsen 50L (Barril)',
    brand: 'Ambev / Brahma',
    category: 'Chopp & Cervejas',
    currentStock: 1,
    minStock: 4,
    unit: 'barril',
    costPrice: 420.0,
    dayPrice: 650.0,
    nightPrice: 720.0,
    status: 'CRITICO',
    suggestedOrder: 7,
  },
  {
    id: 'prod-2',
    name: 'Gin Tanqueray London Dry 750ml',
    brand: 'Diageo',
    category: 'Destilados Premium',
    currentStock: 2,
    minStock: 6,
    unit: 'gf',
    costPrice: 94.5,
    dayPrice: 149.9,
    nightPrice: 175.0,
    status: 'CRITICO',
    suggestedOrder: 10,
  },
  {
    id: 'prod-3',
    name: 'Cerveja Heineken Long Neck 330ml',
    brand: 'Heineken',
    category: 'Chopp & Cervejas',
    currentStock: 14,
    minStock: 48,
    unit: 'un',
    costPrice: 4.85,
    dayPrice: 12.0,
    nightPrice: 15.0,
    status: 'CRITICO',
    suggestedOrder: 82,
  },
  {
    id: 'prod-4',
    name: 'Gelo em Cubos Filtrado (Pacote 5kg)',
    brand: 'Gelo Puro',
    category: 'Insumos de Balcão',
    currentStock: 3,
    minStock: 15,
    unit: 'pct',
    costPrice: 12.0,
    dayPrice: 20.0,
    nightPrice: 22.0,
    status: 'CRITICO',
    suggestedOrder: 27,
  },
  {
    id: 'prod-5',
    name: 'Limão Taiti Selecionado (kg)',
    brand: 'Ceasa Distribuidora',
    category: 'Hortifrúti / Bar',
    currentStock: 3,
    minStock: 12,
    unit: 'kg',
    costPrice: 6.9,
    dayPrice: 12.0,
    nightPrice: 14.0,
    status: 'CRITICO',
    suggestedOrder: 21,
  },
  {
    id: 'prod-6',
    name: 'Vodka Smirnoff Red 998ml',
    brand: 'Diageo',
    category: 'Destilados',
    currentStock: 4,
    minStock: 8,
    unit: 'gf',
    costPrice: 38.0,
    dayPrice: 65.0,
    nightPrice: 78.0,
    status: 'ALERTA',
    suggestedOrder: 12,
  },
  {
    id: 'prod-7',
    name: 'Água Tônica Antarctica Lata 350ml',
    brand: 'Ambev',
    category: 'Não Alcoólicos',
    currentStock: 16,
    minStock: 30,
    unit: 'un',
    costPrice: 2.45,
    dayPrice: 7.0,
    nightPrice: 9.0,
    status: 'ALERTA',
    suggestedOrder: 44,
  },
  {
    id: 'prod-8',
    name: 'Cachaça Salinas Tradicional 700ml',
    brand: 'Salinas',
    category: 'Cachaças & Artesanais',
    currentStock: 2,
    minStock: 4,
    unit: 'gf',
    costPrice: 44.0,
    dayPrice: 85.0,
    nightPrice: 98.0,
    status: 'ALERTA',
    suggestedOrder: 6,
  },
  {
    id: 'prod-9',
    name: 'Cerveja Original 600ml (Caixa c/ 24)',
    brand: 'Ambev',
    category: 'Chopp & Cervejas',
    currentStock: 32,
    minStock: 24,
    unit: 'cx',
    costPrice: 168.0,
    dayPrice: 288.0,
    nightPrice: 320.0,
    status: 'NORMAL',
    suggestedOrder: 16,
  },
];

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Chopp & Cervejas',
    description: 'Barris de 30L/50L, long necks e garrafas 600ml para giro de balcão',
  },
  {
    id: 'cat-2',
    name: 'Destilados Premium',
    description: 'Gins, vodkas importadas, whiskies e cachaças envelhecidas',
  },
  {
    id: 'cat-3',
    name: 'Vinhos & Espumantes',
    description: 'Rótulos de mesa, frisantes e espumantes brut para taças e garrafas',
  },
  {
    id: 'cat-4',
    name: 'Não Alcoólicos & Mixers',
    description: 'Águas tônicas, refrigerantes, sucos cítricos e energéticos',
  },
  {
    id: 'cat-5',
    name: 'Insumos de Balcão & Hortifrúti',
    description: 'Gelo filtrado, limões selecionados, xaropes e especiarias',
  },
  {
    id: 'cat-6',
    name: 'Petiscos & Cozinha',
    description: 'Porções tradicionais de boteco, frios e pasteis',
  },
];

const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    _id: 'mov-1',
    productId: { _id: 'prod-1', name: 'Chopp Pilsen 50L (Barril)', currentStock: 1 },
    type: 'SAIDA',
    quantity: 3,
    previousStock: 4,
    newStock: 1,
    reason: 'Vendas acumuladas turno da noite',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: 'mov-2',
    productId: { _id: 'prod-3', name: 'Cerveja Heineken Long Neck 330ml', currentStock: 14 },
    type: 'PERDA',
    quantity: 2,
    previousStock: 16,
    newStock: 14,
    reason: 'Garrafa quebrada durante manuseio no balcão',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    _id: 'mov-3',
    productId: { _id: 'prod-4', name: 'Gelo em Cubos Filtrado (Pacote 5kg)', currentStock: 3 },
    type: 'AJUSTE',
    quantity: 3,
    previousStock: 6,
    newStock: 3,
    reason: 'Balanço Cego de Balcão - Fechamento de Turno',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    _id: 'mov-4',
    productId: { _id: 'prod-2', name: 'Gin Tanqueray London Dry 750ml', currentStock: 2 },
    type: 'ENTRADA',
    quantity: 6,
    previousStock: 0,
    newStock: 6,
    reason: 'Recebimento de pedido da distribuidora Diageo (NF 4892)',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const INITIAL_PROFILE: BarProfile = {
  name: 'BeerGod',
  branch: 'Balcão Central & Chopperia',
  user: {
    name: 'João Felipe',
    role: 'Proprietário',
    initials: 'JF',
  },
};

const getInitialProfile = (): BarProfile => {
  const storedUser = localStorage.getItem('user');
  const storedTenant = localStorage.getItem('tenant');
  let userObj = INITIAL_PROFILE.user;
  let barName = INITIAL_PROFILE.name;
  let branchName = INITIAL_PROFILE.branch;

  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      userObj = {
        name: parsed.name || INITIAL_PROFILE.user.name,
        role:
          parsed.role === 'OWNER'
            ? 'Proprietário'
            : parsed.role === 'MANAGER'
            ? 'Gerente Operacional'
            : 'Bartender / Operação',
        initials: (parsed.name || 'JF')
          .split(' ')
          .map((n: string) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
        roleCode: parsed.role,
      };
    } catch {
      // ignore
    }
  }

  if (storedTenant) {
    try {
      const parsedTenant = JSON.parse(storedTenant);
      barName = parsedTenant.name || barName;
      branchName = parsedTenant.settings?.branchName || `${barName} - Matriz`;
    } catch {
      // ignore
    }
  }

  return {
    name: barName,
    branch: branchName,
    user: userObj,
  };
};

interface MeuBotequimDashboardProps {
  onNavigateToLanding?: () => void;
}

export const MeuBotequimDashboard: React.FC<MeuBotequimDashboardProps> = ({
  onNavigateToLanding,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [profile, setProfile] = useState<BarProfile>(getInitialProfile);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<ReplenishmentProduct[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Autenticação SaaS & Modal
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Modais de ações rápidas
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Modais de criação de produto e edição de preços (Diurno & Noturno)
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [productToEditPrice, setProductToEditPrice] = useState<ReplenishmentProduct | null>(null);

  // Mostrar Toast temporário
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Carrega dados da API MeuBotequim
  const loadData = useCallback(async () => {
    try {
      const [prods, mets, tenant, cats, movs] = await Promise.all([
        inventoryService.getReplenishmentProducts().catch(() => null),
        inventoryService.getDashboardMetrics().catch(() => null),
        tenantService.getCurrentTenant().catch(() => null),
        categoryService.listCategories().catch(() => null),
        inventoryService.listStockMovements().catch(() => null),
      ]);

      if (Array.isArray(prods) && prods.length > 0) {
        setProducts(prods);
      }
      if (mets) {
        setMetrics(mets);
      }
      if (tenant) {
        setCurrentTenant(tenant);
        setProfile((prev) => ({
          ...prev,
          name: tenant.name,
          branch: tenant.settings?.branchName || `${tenant.name} - Matriz`,
          tenantId: tenant.id,
        }));
      }
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
      if (Array.isArray(movs) && movs.length > 0) {
        setMovements(movs);
      }

      setIsApiConnected(true);
      return true;
    } catch (err: unknown) {
      console.warn('API MeuBotequim offline ou não alcançada, usando dados locais.', err);
      setIsApiConnected(false);
      return false;
    }
  }, []);

  const handleAuthSuccess = (session: AuthSession) => {
    setIsAuthenticated(true);
    const roleLabel =
      session.user.role === 'OWNER'
        ? 'Proprietário'
        : session.user.role === 'MANAGER'
        ? 'Gerente Operacional'
        : 'Bartender / Operação';

    const establishmentName = session.tenant?.name || 'BeerGod';
    const branchName =
      session.tenant?.settings?.branchName || `${establishmentName} - Matriz`;

    setProfile({
      name: establishmentName,
      branch: branchName,
      tenantId: session.tenant?.id,
      user: {
        name: session.user.name,
        role: roleLabel,
        initials: session.user.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
        roleCode: session.user.role,
      },
    });

    showToast(`Bem-vindo, ${session.user.name}! Estabelecimento: ${establishmentName}`);
    void loadData();
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setProfile(INITIAL_PROFILE);
    showToast('Sessão encerrada com sucesso.');
    void loadData();
  };

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const success = await loadData();
      if (success) {
        showToast('Dados sincronizados com o servidor MeuBotequim!');
      } else {
        showToast('Servidor offline. Usando dados locais em cache.');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, [loadData]);

  // Gestão de Categorias
  const handleCreateCategory = async (name: string, description?: string) => {
    const newCat = await categoryService.createCategory({ name, description });
    setCategories((prev) => [...prev, newCat]);
    showToast(`Categoria "${name}" criada com sucesso!`);
    await loadData();
  };

  const handleUpdateCategory = async (id: string, name: string, description?: string) => {
    const updated = await categoryService.updateCategory(id, { name, description });
    setCategories((prev) =>
      prev.map((c) => ((c._id || c.id) === id ? updated : c))
    );
    showToast(`Categoria "${name}" atualizada com sucesso!`);
    await loadData();
  };

  const handleDeleteCategory = async (id: string) => {
    await categoryService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
    showToast('Categoria desativada com sucesso.');
    await loadData();
  };

  // Personalização da Loja (Tenant)
  const handleSaveTenant = async (updatedData: Partial<Tenant>) => {
    const updated = await tenantService.updateTenant(updatedData);
    setCurrentTenant(updated);
    setProfile((prev) => ({
      ...prev,
      name: updated.name,
      branch: updated.settings?.branchName || prev.branch,
    }));
    localStorage.setItem('tenant', JSON.stringify(updated));
    showToast('Personalização do bar aplicada com sucesso!');
  };

  // Ações de Estoque integradas à API
  const handleConfirmEntry = async (productId: string, quantity: number, invoiceNumber?: string) => {
    await inventoryService.createStockMovement({
      productId,
      quantity,
      type: MovementType.ENTRADA,
      reason: invoiceNumber
        ? `Recebimento NF ${invoiceNumber}`
        : 'Entrada de mercadoria da distribuidora',
    });
    await loadData();
  };

  const handleConfirmLoss = async (productId: string, quantity: number, reason: string) => {
    await inventoryService.createStockMovement({
      productId,
      quantity,
      type: MovementType.PERDA,
      reason,
    });
    await loadData();
  };

  const handleConfirmAudit = async (productId: string, countedQuantity: number) => {
    await inventoryService.createStockMovement({
      productId,
      quantity: countedQuantity,
      type: MovementType.AJUSTE,
      reason: 'Balanço Cego de Balcão',
    });
    await loadData();
  };

  // Gestão de Preços e Criação de Produtos
  const handleOpenEditPrice = (product: ReplenishmentProduct) => {
    setProductToEditPrice(product);
    setIsEditPriceModalOpen(true);
  };

  const handleSavePrice = async (
    productId: string,
    prices: { costPrice: number; dayPrice: number; nightPrice: number }
  ) => {
    try {
      const updated = await productManagementService.updateProduct(productId, {
        costPrice: prices.costPrice,
        dayPrice: prices.dayPrice,
        nightPrice: prices.nightPrice,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                costPrice: updated.costPrice !== undefined ? updated.costPrice : prices.costPrice,
                dayPrice: updated.dayPrice !== undefined ? updated.dayPrice : prices.dayPrice,
                nightPrice: updated.nightPrice !== undefined ? updated.nightPrice : prices.nightPrice,
              }
            : p
        )
      );
    } catch {
      // Atualização otimista caso esteja usando dados locais/offline
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                costPrice: prices.costPrice,
                dayPrice: prices.dayPrice,
                nightPrice: prices.nightPrice,
              }
            : p
        )
      );
    }
  };

  const handleCreateProduct = async (productData: {
    name: string;
    brand?: string;
    category?: string;
    unit: string;
    currentStock: number;
    minStock: number;
    costPrice: number;
    dayPrice: number;
    nightPrice: number;
  }) => {
    try {
      const created = await productManagementService.createProduct(productData);
      setProducts((prev) => [created, ...prev]);
      await loadData();
    } catch {
      // Fallback offline / local
      const fallbackId = `prod-${Date.now()}`;
      const newLocalProd: ReplenishmentProduct = {
        id: fallbackId,
        name: productData.name,
        brand: productData.brand,
        category: productData.category || 'Chopp & Cervejas',
        unit: productData.unit,
        currentStock: productData.currentStock,
        minStock: productData.minStock,
        costPrice: productData.costPrice,
        dayPrice: productData.dayPrice,
        nightPrice: productData.nightPrice,
        status: productData.currentStock <= productData.minStock ? 'CRITICO' : 'NORMAL',
        suggestedOrder: Math.max(1, productData.minStock * 2 - productData.currentStock),
      };
      setProducts((prev) => [newLocalProd, ...prev]);
    }
  };

  // Adicionar produto à lista de compras
  const handleAddToShoppingList = (product: ReplenishmentProduct) => {
    setShoppingCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        showToast(`Item "${product.name}" já está na lista.`);
        return prev;
      }
      const quantityToAdd = product.suggestedOrder || Math.max(1, product.minStock - product.currentStock);
      showToast(`"${product.name}" adicionado à lista de reposição!`);
      return [
        ...prev,
        {
          ...product,
          quantityToAdd,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const handleRemoveFromShoppingList = (id: string) => {
    setShoppingCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setShoppingCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(1, item.quantityToAdd + delta);
          return { ...item, quantityToAdd: nextQty };
        }
        return item;
      })
    );
  };

  const handleClearShoppingList = () => {
    setShoppingCart([]);
    showToast('Lista de compras esvaziada.');
  };

  const addedProductIds = new Set(shoppingCart.map((i) => i.id));
  const criticalItemsCount = metrics
    ? metrics.criticalStockCount
    : products.filter((p) => p.status === 'CRITICO').length;

  const totalStockValue = metrics
    ? metrics.stockValue
    : products.reduce((acc, p) => acc + p.currentStock * p.costPrice, 0);

  const monthlyLossTotal = metrics ? metrics.monthlyLossValue : 845.0;

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C221E] antialiased flex flex-col font-sans selection:bg-[#C87A5B]/20 selection:text-[#2C221E]">
      {/* 1. Header Superior com paleta MeuBotequim */}
      <Header
        profile={profile}
        criticalAlertCount={criticalItemsCount}
        isAuthenticated={isAuthenticated}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
        onNavigateToLanding={onNavigateToLanding}
        onSelectBranch={(branch) => setProfile((p) => ({ ...p, branch }))}
        onOpenNotifications={() => {
          showToast(`Você possui ${criticalItemsCount} itens em nível crítico requerendo atenção.`);
        }}
      />

      {/* Conteúdo Principal do Dashboard */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-6">
        {/* Banner de Boas-vindas / Contexto do Turno */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#EFE8DE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#2C221E] sm:text-3xl">
                {profile.name} — Gestão de Balcão
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#5B8A62]/15 px-2.5 py-0.5 text-xs font-bold text-[#5B8A62] border border-[#5B8A62]/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5B8A62] animate-pulse" />
                Operação Ativa
              </span>
              <span
                className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                  isApiConnected
                    ? 'bg-[#5B8A62]/10 text-[#5B8A62] border-[#5B8A62]/30'
                    : 'bg-[#DF9B42]/10 text-[#DF9B42] border-[#DF9B42]/30'
                }`}
                title={isApiConnected ? 'Conectado à API MeuBotequim' : 'Modo local offline'}
              >
                {isApiConnected ? (
                  <>
                    <Wifi className="h-3 w-3" />
                    <span>API Conectada</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    <span>Modo Local</span>
                  </>
                )}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#70625B] sm:text-sm">
              Filial: <strong className="text-[#2C221E]">{profile.branch}</strong> • Indicadores em tempo real, reposição de balcão e auditoria de insumos.
            </p>
          </div>

          {/* Botão de atualização rápida de dados */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              disabled={isSyncing}
              onClick={handleManualSync}
              className="flex items-center gap-1.5 rounded-xl border border-[#EFE8DE] bg-[#FFFFFF] px-3.5 py-2 text-xs font-semibold text-[#70625B] shadow-soft hover:bg-[#FAF6F0] hover:text-[#2C221E] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-[#C87A5B]' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar PDV'}</span>
            </button>
          </div>
        </div>

        {/* 2. Barra de Navegação de Abas (Tabs) */}
        <nav
          aria-label="Abas de Gestão"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#EFE8DE]"
        >
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#C87A5B] text-white shadow-soft'
                : 'bg-white border border-[#EFE8DE] text-[#70625B] hover:text-[#2C221E] hover:bg-[#FAF6F0]'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Visão Geral & Balcão</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-[#C87A5B] text-white shadow-soft'
                : 'bg-white border border-[#EFE8DE] text-[#70625B] hover:text-[#2C221E] hover:bg-[#FAF6F0]'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Métricas & Gráficos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-[#C87A5B] text-white shadow-soft'
                : 'bg-white border border-[#EFE8DE] text-[#70625B] hover:text-[#2C221E] hover:bg-[#FAF6F0]'
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Categorias</span>
            <span className="rounded-full bg-[#FAF6F0] text-[#70625B] px-1.5 py-0.2 text-[10px] font-bold">
              {categories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recipes')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'recipes'
                ? 'bg-[#C87A5B] text-white shadow-soft'
                : 'bg-white border border-[#EFE8DE] text-[#70625B] hover:text-[#2C221E] hover:bg-[#FAF6F0]'
            }`}
          >
            <Wine className="h-4 w-4" />
            <span>Fichas Técnicas & Drinks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customization')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'customization'
                ? 'bg-[#C87A5B] text-white shadow-soft'
                : 'bg-white border border-[#EFE8DE] text-[#70625B] hover:text-[#2C221E] hover:bg-[#FAF6F0]'
            }`}
          >
            <Store className="h-4 w-4" />
            <span>Personalização do Bar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-[#C87A5B] text-white shadow-soft'
                : 'bg-white border border-[#EFE8DE] text-[#70625B] hover:text-[#2C221E] hover:bg-[#FAF6F0]'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Auditoria & Perdas</span>
          </button>
        </nav>

        {/* 3. Renderização Condicional da Aba Ativa */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Cards de KPIs Principais */}
            <section aria-label="KPIs Principais">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                  title="Valor em Estoque"
                  value={`R$ ${totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  subtitle="Preço de custo consolidado"
                  icon={<DollarSign className="h-5 w-5" />}
                  trend={{
                    text: '+3,2% no mês',
                    direction: 'up',
                    isPositive: true,
                  }}
                  footerNote={`${products.length} SKUs ativos`}
                />

                <KpiCard
                  title="Itens em Nível Crítico"
                  value={`${criticalItemsCount} itens`}
                  icon={<AlertOctagon className="h-5 w-5 text-[#C24E48]" />}
                  badge={{
                    text: criticalItemsCount > 0 ? 'Ruptura Iminente' : 'Estoque Seguro',
                    variant: criticalItemsCount > 0 ? 'danger' : 'success',
                  }}
                  trend={{
                    text: criticalItemsCount > 0 ? 'Reposição prioritária' : 'Estável',
                    direction: criticalItemsCount > 0 ? 'up' : 'neutral',
                    isPositive: criticalItemsCount === 0,
                  }}
                  footerNote="Monitoramento de estoque mínimo"
                />

                <KpiCard
                  title="Perdas & Desperdício"
                  value={`R$ ${monthlyLossTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  subtitle="Quebras, validade e sangrias"
                  icon={<TrendingDown className="h-5 w-5 text-[#C24E48]" />}
                  trend={{
                    text: metrics ? `${metrics.monthlyLossCount} registros no mês` : '-14,5% vs. mês ant.',
                    direction: 'down',
                    isPositive: true,
                  }}
                  footerNote={metrics ? `Taxa de perda: ${metrics.lossRate}` : 'Controle de perdas'}
                />

                <KpiCard
                  title="Giro Projetado (FDS)"
                  value="R$ 19.350,00"
                  subtitle="Estimativa Sex, Sáb e Dom"
                  icon={<CalendarCheck className="h-5 w-5 text-[#DDA76A]" />}
                  badge={{
                    text: 'Pico Esperado',
                    variant: 'secondary',
                  }}
                  trend={{
                    text: '+18% vs. fds normal',
                    direction: 'up',
                    isPositive: true,
                  }}
                  footerNote="Baseado no histórico de balcão"
                />
              </div>
            </section>

            {/* Ações Rápidas */}
            <section aria-label="Ações Rápidas">
              <ActionButtons
                onNewProduct={() => setIsNewProductModalOpen(true)}
                onNewEntry={() => setIsEntryModalOpen(true)}
                onRegisterLoss={() => setIsLossModalOpen(true)}
                onStartBlindAudit={() => setIsAuditModalOpen(true)}
              />
            </section>

            {/* Tabela de Alertas de Reposição */}
            <section aria-label="Reposição Imediata">
              <AlertTable
                products={products}
                onAddToShoppingList={handleAddToShoppingList}
                onEditPrice={handleOpenEditPrice}
                onOpenNewProduct={() => setIsNewProductModalOpen(true)}
                addedProductIds={addedProductIds}
              />
            </section>
          </div>
        )}

        {activeTab === 'analytics' && (
          <DashboardAnalytics metrics={metrics} products={products} />
        )}

        {activeTab === 'categories' && (
          <CategoriesManager
            categories={categories}
            products={products}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeTab === 'recipes' && <DrinkRecipesManager />}

        {activeTab === 'customization' && (
          <StoreCustomizer
            currentTenant={currentTenant}
            onSaveTenant={handleSaveTenant}
            showToast={showToast}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTrailTable movements={movements} onRefresh={loadData} />
        )}
      </main>

      {/* Botão Flutuante da Lista de Compras */}
      {shoppingCart.length > 0 && (
        <aside
          aria-label="Carrinho de Reposição"
          className="fixed bottom-5 right-5 z-40 animate-in fade-in slide-in-from-bottom-3"
        >
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-3 rounded-2xl bg-[#C87A5B] px-4 py-3.5 text-xs font-bold text-white shadow-soft-lg hover:bg-[#B2684B] transition-all duration-200 active:scale-95"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-[#C87A5B]">
                {shoppingCart.length}
              </span>
            </div>
            <div className="text-left">
              <p className="leading-tight">Lista de Compras</p>
              <p className="text-[10px] font-medium text-white/80">
                {shoppingCart.length} {shoppingCart.length === 1 ? 'item' : 'itens'} adicionados
              </p>
            </div>
          </button>
        </aside>
      )}

      {/* Drawer da Lista de Compras com WhatsApp */}
      <ShoppingListDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={shoppingCart}
        onRemoveItem={handleRemoveFromShoppingList}
        onClearList={handleClearShoppingList}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Modais de Ações Rápidas conectadas à API */}
      <NewEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSuccess={showToast}
        products={products}
        onConfirmEntry={handleConfirmEntry}
      />

      <RegisterLossModal
        isOpen={isLossModalOpen}
        onClose={() => setIsLossModalOpen(false)}
        onSuccess={showToast}
        products={products}
        onConfirmLoss={handleConfirmLoss}
      />

      <BlindAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onSuccess={showToast}
        products={products}
        onConfirmAudit={handleConfirmAudit}
      />

      {/* Modal de Autenticação SaaS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Modal de Cadastro de Novo Produto (com custo, diurno e noturno) */}
      <NewProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        categories={categories}
        onCreateProduct={handleCreateProduct}
        onSuccess={showToast}
      />

      {/* Modal de Ajuste de Preço Rápido durante o uso */}
      <EditPriceModal
        isOpen={isEditPriceModalOpen}
        onClose={() => {
          setIsEditPriceModalOpen(false);
          setProductToEditPrice(null);
        }}
        product={productToEditPrice}
        onSavePrice={handleSavePrice}
        onSuccess={showToast}
      />

      {/* Toast Notification Flutuante */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-[#2C221E] px-4 py-2.5 text-xs font-semibold text-white shadow-soft-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-[#EFE8DE]/20"
        >
          <CheckCircle2 className="h-4 w-4 text-[#5B8A62] shrink-0" />
          <span>{toastMessage}</span>
        </aside>
      )}
    </div>
  );
};

export default MeuBotequimDashboard;
