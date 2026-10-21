import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  AlertTriangle,
  ShoppingCart,
  Check,
  Pencil,
  X,
  PackageCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { ReplenishmentProduct } from '../../types';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  products?: ReplenishmentProduct[];
  addedProductIds?: Set<string>;
  onAddToShoppingList?: (product: ReplenishmentProduct) => void;
  onEditPrice?: (product: ReplenishmentProduct) => void;
  onViewAllInTable?: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  products = [],
  addedProductIds = new Set(),
  onAddToShoppingList,
  onEditPrice,
  onViewAllInTable,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICO' | 'ALERTA'>('ALL');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Filtra produtos em nível crítico ou alerta
  const lowStockProducts = useMemo(() => {
    return products
      .filter(
        (p) =>
          p.status === 'CRITICO' ||
          p.status === 'ALERTA' ||
          p.currentStock <= p.minStock
      )
      .sort((a, b) => {
        // Crítico vem primeiro; depois, menor razão de estoque
        if (a.status === 'CRITICO' && b.status !== 'CRITICO') return -1;
        if (b.status === 'CRITICO' && a.status !== 'CRITICO') return 1;
        const ratioA = a.currentStock / Math.max(1, a.minStock);
        const ratioB = b.currentStock / Math.max(1, b.minStock);
        return ratioA - ratioB;
      });
  }, [products]);

  const criticalCount = useMemo(
    () => lowStockProducts.filter((p) => p.status === 'CRITICO').length,
    [lowStockProducts]
  );

  const alertCount = useMemo(
    () => lowStockProducts.filter((p) => p.status === 'ALERTA').length,
    [lowStockProducts]
  );

  // Lista filtrada pela aba selecionada
  const displayedProducts = useMemo(() => {
    if (filter === 'CRITICO') {
      return lowStockProducts.filter((p) => p.status === 'CRITICO');
    }
    if (filter === 'ALERTA') {
      return lowStockProducts.filter((p) => p.status === 'ALERTA');
    }
    return lowStockProducts;
  }, [lowStockProducts, filter]);

  // Itens críticos que ainda não foram para a lista
  const unaddedCriticalItems = useMemo(() => {
    return lowStockProducts.filter(
      (p) => p.status === 'CRITICO' && !addedProductIds.has(p.id)
    );
  }, [lowStockProducts, addedProductIds]);

  // Fechar com tecla ESC e clique fora (Acessibilidade)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        // Se o clique não foi no próprio botão que abre, fecha
        const button = document.getElementById('notifications-button');
        if (!button || !button.contains(event.target as Node)) {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddAllCritical = () => {
    if (!onAddToShoppingList) return;
    unaddedCriticalItems.forEach((prod) => {
      onAddToShoppingList(prod);
    });
  };

  return (
    <div
      ref={popoverRef}
      id="notifications-popover"
      role="dialog"
      aria-modal="false"
      aria-label="Alertas e produtos com estoque baixo"
      className="fixed inset-x-3 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full mt-2 w-auto sm:w-[440px] max-w-lg rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] shadow-soft-lg z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2"
    >
      {/* Header do Popover */}
      <div className="border-b border-[#EFE8DE] bg-[#FAF6F0]/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C24E48]/15 text-[#C24E48]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#2C221E]">
                  Estoque Baixo & Alertas
                </h3>
                <span className="rounded-full bg-[#C24E48] px-2 py-0.5 text-[10px] font-extrabold text-white">
                  {lowStockProducts.length}
                </span>
              </div>
              <p className="text-xs text-[#70625B]">
                Itens prioritários para reposição no balcão
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel de notificações"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[#70625B] hover:bg-[#EFE8DE] hover:text-[#2C221E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Abas de Filtro Interno */}
        <div className="mt-3 flex items-center gap-1.5" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'ALL'}
            onClick={() => setFilter('ALL')}
            className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-[#2C221E] text-white shadow-soft'
                : 'bg-white border border-[#EFE8DE] text-[#70625B] hover:text-[#2C221E]'
            }`}
          >
            Todos ({lowStockProducts.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'CRITICO'}
            onClick={() => setFilter('CRITICO')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
              filter === 'CRITICO'
                ? 'bg-[#C24E48] text-white shadow-soft'
                : 'bg-white border border-[#EFE8DE] text-[#C24E48] hover:bg-[#C24E48]/10'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            Críticos ({criticalCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'ALERTA'}
            onClick={() => setFilter('ALERTA')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
              filter === 'ALERTA'
                ? 'bg-[#DF9B42] text-white shadow-soft'
                : 'bg-white border border-[#EFE8DE] text-[#DF9B42] hover:bg-[#DF9B42]/10'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            Alertas ({alertCount})
          </button>
        </div>
      </div>

      {/* Lista de Produtos Baixos */}
      <div
        className="max-h-[380px] overflow-y-auto divide-y divide-[#EFE8DE] p-2 space-y-1 focus:outline-none"
        tabIndex={0}
        role="region"
        aria-label="Lista de produtos com saldo baixo"
      >
        {displayedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5B8A62]/15 text-[#5B8A62]">
              <PackageCheck className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-[#2C221E]">
              {filter === 'ALL'
                ? 'Estoque 100% abastecido!'
                : `Nenhum item em ${filter === 'CRITICO' ? 'nível crítico' : 'alerta'}`}
            </p>
            <p className="mt-1 text-xs text-[#70625B]">
              Todos os itens monitorados estão acima do saldo mínimo de segurança.
            </p>
          </div>
        ) : (
          displayedProducts.map((product) => {
            const isAdded = addedProductIds.has(product.id);
            const isCritical = product.status === 'CRITICO';
            const ratio = Math.min(
              100,
              Math.round((product.currentStock / Math.max(1, product.minStock)) * 100)
            );
            const effectiveNightPrice =
              product.nightPrice ||
              Number(((product.dayPrice || 0) * 1.2).toFixed(2));

            return (
              <div
                key={product.id}
                className="rounded-2xl p-3 hover:bg-[#FAF6F0]/80 transition-colors border border-transparent hover:border-[#EFE8DE] space-y-2.5"
              >
                {/* Linha Superior: Nome, Categoria e Badge de Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          isCritical ? 'bg-[#C24E48]' : 'bg-[#DF9B42]'
                        }`}
                      />
                      <h4 className="text-xs font-bold text-[#2C221E] truncate">
                        {product.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#70625B] truncate mt-0.5 ml-3.5">
                      {product.category}{' '}
                      {product.brand ? `• ${product.brand}` : ''}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-extrabold border ${
                      isCritical
                        ? 'bg-[#C24E48]/10 text-[#C24E48] border-[#C24E48]/30'
                        : 'bg-[#DF9B42]/10 text-[#DF9B42] border-[#DF9B42]/30'
                    }`}
                  >
                    {isCritical ? 'CRÍTICO' : 'ALERTA'}
                  </span>
                </div>

                {/* Saldo Atual vs Mínimo e Barra de Proporção */}
                <div className="rounded-xl bg-[#FAF6F0] p-2.5 border border-[#EFE8DE]/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#70625B]">
                      Saldo Atual:{' '}
                      <strong
                        className={
                          isCritical
                            ? 'text-[#C24E48] font-extrabold'
                            : 'text-[#2C221E] font-bold'
                        }
                      >
                        {product.currentStock} {product.unit}
                      </strong>
                    </span>
                    <span className="text-[#70625B]">
                      Mínimo:{' '}
                      <strong className="text-[#2C221E] font-semibold">
                        {product.minStock} {product.unit}
                      </strong>
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EFE8DE]">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical
                          ? 'bg-[#C24E48]'
                          : ratio < 75
                          ? 'bg-[#DF9B42]'
                          : 'bg-[#5B8A62]'
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>

                {/* Preços e Ações Rápidas */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <div className="text-[11px] text-[#70625B]">
                    <span>Diurno: R$ {(product.dayPrice || 0).toFixed(2)}</span>
                    <span className="ml-2 font-bold text-[#C87A5B]">
                      🌙 R$ {effectiveNightPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onEditPrice && (
                      <button
                        type="button"
                        onClick={() => {
                          onEditPrice(product);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 rounded-xl border border-[#EFE8DE] bg-white px-2 py-1 text-[11px] font-semibold text-[#70625B] hover:text-[#C87A5B] hover:border-[#C87A5B]/30 transition-all shadow-soft active:scale-95"
                        title={`Ajustar preços de ${product.name}`}
                        aria-label={`Ajustar preços de ${product.name}`}
                      >
                        <Pencil className="h-3 w-3 text-[#C87A5B]" />
                        <span className="hidden sm:inline">Preços</span>
                      </button>
                    )}

                    {onAddToShoppingList && (
                      <button
                        type="button"
                        onClick={() => onAddToShoppingList(product)}
                        className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all shadow-soft active:scale-95 ${
                          isAdded
                            ? 'bg-[#5B8A62]/15 text-[#5B8A62] border border-[#5B8A62]/30'
                            : 'bg-[#C87A5B] text-white hover:bg-[#B2684B]'
                        }`}
                        aria-label={
                          isAdded
                            ? `${product.name} já está na lista`
                            : `Adicionar ${product.name} à lista de compras`
                        }
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Na Lista</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-3 w-3" />
                            <span>+ Repor</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rodapé: Ações em Massa & Ver Tudo */}
      <div className="border-t border-[#EFE8DE] bg-[#FAF6F0]/80 p-3 flex flex-col gap-2">
        {unaddedCriticalItems.length > 0 && onAddToShoppingList && (
          <button
            type="button"
            onClick={handleAddAllCritical}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C87A5B] px-3 py-2 text-xs font-bold text-white shadow-soft hover:bg-[#B2684B] transition-all active:scale-[0.98]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              Repor Todos os Críticos ({unaddedCriticalItems.length} itens)
            </span>
          </button>
        )}

        <div className="flex items-center justify-between text-xs text-[#70625B]">
          <span>
            {lowStockProducts.length === 0
              ? 'Nenhum alerta ativo'
              : `${criticalCount} críticos • ${alertCount} alertas`}
          </span>

          {onViewAllInTable && (
            <button
              type="button"
              onClick={onViewAllInTable}
              className="inline-flex items-center gap-1 font-bold text-[#C87A5B] hover:text-[#B2684B] transition-colors"
            >
              <span>Ver na tabela completa</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
