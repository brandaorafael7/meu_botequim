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
import { inventoryService, tenantService } from '../services/api';
import {
  MovementType,
  type BarProfile,
  type ReplenishmentProduct,
  type ShoppingCartItem,
  type DashboardMetrics,
} from '../types';

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
    status: 'NORMAL',
    suggestedOrder: 16,
  },
];

const INITIAL_PROFILE: BarProfile = {
  name: 'MeuBotequim',
  branch: 'Boteco da Esquina - Salão Central',
  user: {
    name: 'Carlos Drummond',
    role: 'Gerente Operacional',
    initials: 'CD',
  },
};

export const MeuBotequimDashboard: React.FC = () => {
  const [profile, setProfile] = useState<BarProfile>(INITIAL_PROFILE);
  const [products, setProducts] = useState<ReplenishmentProduct[]>(INITIAL_PRODUCTS);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Modais de ações rápidas
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

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
      const [prods, mets, tenant] = await Promise.all([
        inventoryService.getReplenishmentProducts(),
        inventoryService.getDashboardMetrics(),
        tenantService.getCurrentTenant().catch(() => null),
      ]);

      if (prods && prods.length > 0) {
        setProducts(prods);
      }
      if (mets) {
        setMetrics(mets);
      }
      if (tenant) {
        setProfile((prev) => ({
          ...prev,
          name: tenant.name,
          branch: tenant.settings?.branchName || `${tenant.name} - Matriz`,
          tenantId: tenant.id,
        }));
      }
      setIsApiConnected(true);
      return true;
    } catch (err: unknown) {
      console.warn('API MeuBotequim offline ou não alcançada, usando dados locais.', err);
      setIsApiConnected(false);
      return false;
    }
  }, []);

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

  // Ações de Estoque integradas à API
  const handleConfirmEntry = async (productId: string, quantity: number, invoiceNumber?: string) => {
    await inventoryService.createStockMovement({
      productId,
      quantity,
      type: MovementType.ENTRADA,
      reason: invoiceNumber ? `NF: ${invoiceNumber}` : 'Entrada manual rápida',
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
                Visão Geral do Estoque
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
              Indicadores em tempo real, reposição de balcão e auditoria de insumos.
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

        {/* 2. Cards de KPIs Principais (Grid de 4 cards sincronizados com a API) */}
        <section aria-label="KPIs Principais">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Valor em Estoque (preço de custo consolidado) */}
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

            {/* Card 2: Itens em Nível Crítico (com badge na cor #C24E48) */}
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

            {/* Card 3: Perdas & Desperdício do Mês (valor total de quebras/avarias) */}
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

            {/* Card 4: Giro Projetado para o Fim de Semana */}
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

        {/* 3. Ações Rápidas (Barra de Acesso Imediato) */}
        <section aria-label="Ações Rápidas">
          <ActionButtons
            onNewEntry={() => setIsEntryModalOpen(true)}
            onRegisterLoss={() => setIsLossModalOpen(true)}
            onStartBlindAudit={() => setIsAuditModalOpen(true)}
          />
        </section>

        {/* 4. Tabela / Lista de Reposição Imediata ("Atenção para o Fim de Semana") */}
        <section aria-label="Reposição Imediata">
          <AlertTable
            products={products}
            onAddToShoppingList={handleAddToShoppingList}
            addedProductIds={addedProductIds}
          />
        </section>
      </main>

      {/* Botão Flutuante da Lista de Compras (Mobile / Desktop) */}
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

      {/* Drawer da Lista de Compras */}
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

      {/* Toast de Notificação Suave */}
      {toastMessage && (
        <aside
          aria-live="polite"
          className="fixed top-20 right-4 z-50 flex items-center gap-2.5 rounded-xl border border-[#5B8A62]/30 bg-[#FFFFFF] px-4 py-3 text-xs font-semibold text-[#2C221E] shadow-soft-lg animate-in fade-in slide-in-from-top-2"
        >
          <CheckCircle2 className="h-4 w-4 text-[#5B8A62]" />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Rodapé institucional com cores terrosas */}
      <footer className="mt-auto border-t border-[#EFE8DE] bg-[#FFFFFF] py-4 text-center text-xs text-[#70625B]">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="MeuBotequim" className="h-6 w-6 rounded-md object-cover border border-[#EFE8DE] bg-[#F4EDE4]" />
            <span>
              <strong>MeuBotequim</strong> © {new Date().getFullYear()} — Sistema Especializado para Bares, Botecos & Restaurantes.
            </span>
          </div>
          <span className="text-[11px] text-[#70625B]/70">
            Design System Tons Terrosos Pastel
          </span>
        </div>
      </footer>
    </div>
  );
};

export default MeuBotequimDashboard;
