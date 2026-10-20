import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Search,
  ShoppingCart,
  Check,
  Package,
  Moon,
  Sun,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { ReplenishmentProduct, StockStatus } from '../../types';

interface AlertTableProps {
  products: ReplenishmentProduct[];
  onAddToShoppingList: (product: ReplenishmentProduct) => void;
  addedProductIds?: Set<string>;
  isLoading?: boolean;
}

export const AlertTable: React.FC<AlertTableProps> = ({
  products,
  onAddToShoppingList,
  addedProductIds = new Set(),
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | StockStatus>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isNightShiftActive, setIsNightShiftActive] = useState<boolean>(() => {
    const hour = new Date().getHours();
    return hour >= 0 && hour < 6; // Automático entre meia-noite e 6h
  });

  // Categorias disponíveis para filtro
  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return ['ALL', ...list];
  }, [products]);

  // Produtos filtrados
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' ? true : p.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'ALL' ? true : p.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchTerm, statusFilter, categoryFilter]);

  // Contadores rápidos para resumo
  const criticalCount = products.filter((p) => p.status === 'CRITICO').length;
  const alertCount = products.filter((p) => p.status === 'ALERTA').length;

  return (
    <section className="rounded-2xl border border-[#EFE8DE] bg-[#FFFFFF] shadow-soft overflow-hidden">
      {/* Header da Seção */}
      <div className="border-b border-[#EFE8DE] p-4 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C24E48]/10 text-[#C24E48]">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-[#2C221E] sm:text-xl">
                Atenção para o Fim de Semana & Balcão
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#70625B] sm:text-sm">
              Itens com saldo próximo da ruptura e tabela de preços diurna vs. noturna pós 00:00.
            </p>
          </div>

          {/* Badges de contagem rápida e Alternador de Turno Noturno */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNightShiftActive(!isNightShiftActive)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition-all ${
                isNightShiftActive
                  ? 'bg-[#2C221E] text-white border-[#2C221E] shadow-soft'
                  : 'bg-[#FAF6F0] text-[#70625B] border-[#EFE8DE] hover:text-[#2C221E]'
              }`}
              title="Clique para alternar e simular a tabela de Preço Noturno pós 00:00"
            >
              {isNightShiftActive ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-[#DDA76A]" />
                  <span>Preço Noturno Ativo (Pós 00h)</span>
                  <span className="h-2 w-2 rounded-full bg-[#5B8A62] animate-pulse" />
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-[#DF9B42]" />
                  <span>Preço Diurno (Padrão)</span>
                </>
              )}
            </button>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C24E48]/25 bg-[#C24E48]/10 px-3 py-1 text-xs font-semibold text-[#C24E48]">
              <span className="h-2 w-2 rounded-full bg-[#C24E48]" />
              {criticalCount} Críticos
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DF9B42]/30 bg-[#DF9B42]/12 px-3 py-1 text-xs font-semibold text-[#DF9B42]">
              <span className="h-2 w-2 rounded-full bg-[#DF9B42]" />
              {alertCount} em Alerta
            </span>
          </div>
        </div>

        {/* Barra de Controles: Busca e Filtros */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#70625B]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por produto, marca..."
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] pl-10 pr-4 py-2 text-xs sm:text-sm text-[#2C221E] placeholder-[#70625B]/70 focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 transition-colors"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3 py-2 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'Todas as Categorias' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filtros de Status */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#70625B] mr-1 hidden sm:inline">
              Filtrar:
            </span>
            {(['ALL', 'CRITICO', 'ALERTA', 'NORMAL'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-[#2C221E] text-white shadow-soft'
                    : 'bg-[#FAF6F0] text-[#70625B] hover:bg-[#EFE8DE]/60 hover:text-[#2C221E]'
                }`}
              >
                {st === 'ALL'
                  ? 'Todos'
                  : st === 'CRITICO'
                  ? 'Críticos'
                  : st === 'ALERTA'
                  ? 'Alertas'
                  : 'Normal'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo: Tabela e Cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-[#70625B]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C87A5B] border-t-transparent" />
          <p className="mt-3 text-xs">Carregando lista de reposição...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF6F0] text-[#70625B]">
            <Package className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-bold text-[#2C221E]">
            Nenhum produto encontrado
          </p>
          <p className="mt-1 text-xs text-[#70625B]">
            Tente ajustar os filtros ou o termo de busca pesquisado.
          </p>
        </div>
      ) : (
        <>
          {/* Tabela para Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EFE8DE] bg-[#FAF6F0]/60 text-[11px] font-bold uppercase tracking-wider text-[#70625B]">
                  <th className="py-3.5 pl-6 pr-4">Nome do Produto</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4 text-center">Preço Balcão (Diurno / Noturno)</th>
                  <th className="py-3.5 px-4 text-center">Saldo Atual</th>
                  <th className="py-3.5 px-4 text-center">Saldo Mínimo</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Ação Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8DE]">
                {filteredProducts.map((product) => {
                  const isAdded = addedProductIds.has(product.id);
                  const isCritical = product.status === 'CRITICO';
                  const ratio = Math.min(
                    100,
                    Math.round((product.currentStock / product.minStock) * 100)
                  );
                  const effectiveNightPrice =
                    product.nightPrice || Number(((product.dayPrice || 0) * 1.2).toFixed(2));

                  return (
                    <tr
                      key={product.id}
                      className="group transition-colors hover:bg-[#FAF6F0]/40"
                    >
                      {/* Nome do Produto */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#2C221E] group-hover:text-[#C87A5B] transition-colors">
                            {product.name}
                          </span>
                          <span className="text-xs text-[#70625B]">
                            {product.brand ? `${product.brand} • ` : ''}
                            Unidade: {product.unit}
                          </span>
                        </div>
                      </td>

                      {/* Categoria */}
                      <td className="py-4 px-4">
                        <span className="inline-flex rounded-md bg-[#FAF6F0] px-2.5 py-1 text-xs font-medium text-[#70625B] border border-[#EFE8DE]">
                          {product.category}
                        </span>
                      </td>

                      {/* Preço de Balcão (Diurno vs. Noturno Pós 00h) */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-bold ${
                                isNightShiftActive
                                  ? 'text-[#70625B] line-through opacity-70'
                                  : 'text-[#2C221E]'
                              }`}
                            >
                              R$ {(product.dayPrice || 0).toFixed(2)}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold border ${
                                isNightShiftActive
                                  ? 'bg-[#2C221E] text-white border-[#2C221E] shadow-soft'
                                  : 'bg-[#FAF6F0] text-[#C87A5B] border-[#EFE8DE]'
                              }`}
                              title="Preço Noturno para vendas pós-meia-noite (00h às 06h)"
                            >
                              🌙 R$ {effectiveNightPrice.toFixed(2)}
                            </span>
                          </div>
                          <span className="text-[9px] text-[#70625B] mt-0.5">
                            {isNightShiftActive ? 'Cobrança Noturna' : 'Diurno / Pós 00h'}
                          </span>
                        </div>
                      </td>

                      {/* Saldo Atual */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`text-sm font-extrabold ${
                              isCritical ? 'text-[#C24E48]' : 'text-[#2C221E]'
                            }`}
                          >
                            {product.currentStock}{' '}
                            <span className="text-xs font-normal text-[#70625B]">
                              {product.unit}
                            </span>
                          </span>
                          <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-[#EFE8DE]">
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
                      </td>

                      {/* Saldo Mínimo */}
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-semibold text-[#70625B]">
                          {product.minStock} {product.unit}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <StatusBadge status={product.status} />
                      </td>

                      {/* Ação */}
                      <td className="py-4 pl-4 pr-6 text-right">
                        <button
                          type="button"
                          onClick={() => onAddToShoppingList(product)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 focus:outline-none focus:ring-2 ${
                            isAdded
                              ? 'bg-[#5B8A62]/15 text-[#5B8A62] border border-[#5B8A62]/30 hover:bg-[#5B8A62]/25'
                              : 'bg-[#FAF6F0] text-[#2C221E] border border-[#EFE8DE] hover:bg-[#C87A5B] hover:text-white hover:border-[#C87A5B] shadow-soft'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Na Lista</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-3.5 w-3.5" />
                              <span>Repor</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards para Mobile */}
          <div className="divide-y divide-[#EFE8DE] md:hidden">
            {filteredProducts.map((product) => {
              const isAdded = addedProductIds.has(product.id);
              const isCritical = product.status === 'CRITICO';
              const ratio = Math.min(
                100,
                Math.round((product.currentStock / product.minStock) * 100)
              );
              const effectiveNightPrice =
                product.nightPrice || Number(((product.dayPrice || 0) * 1.2).toFixed(2));

              return (
                <div key={product.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#2C221E]">
                        {product.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#70625B]">
                        {product.category} {product.brand ? `• ${product.brand}` : ''}
                      </p>
                    </div>
                    <StatusBadge status={product.status} size="sm" />
                  </div>

                  {/* Preços Diurno e Noturno */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-[#70625B]">
                      Diurno:{' '}
                      <strong className={isNightShiftActive ? 'text-[#70625B] line-through' : 'text-[#2C221E]'}>
                        R$ {(product.dayPrice || 0).toFixed(2)}
                      </strong>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold border ${
                        isNightShiftActive
                          ? 'bg-[#2C221E] text-white border-[#2C221E]'
                          : 'bg-[#FAF6F0] text-[#C87A5B] border-[#EFE8DE]'
                      }`}
                    >
                      🌙 Pós 00h: R$ {effectiveNightPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Detalhes de Saldo */}
                  <div className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] p-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#70625B]">Saldo Atual: </span>
                        <strong
                          className={
                            isCritical ? 'text-[#C24E48] font-extrabold' : 'text-[#2C221E]'
                          }
                        >
                          {product.currentStock} {product.unit}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#70625B]">Mínimo: </span>
                        <strong className="text-[#2C221E]">
                          {product.minStock} {product.unit}
                        </strong>
                      </div>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EFE8DE]">
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

                  {/* Botão de Ação Mobile */}
                  <div>
                    <button
                      type="button"
                      onClick={() => onAddToShoppingList(product)}
                      className={`flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${
                        isAdded
                          ? 'bg-[#5B8A62]/15 text-[#5B8A62] border border-[#5B8A62]/30'
                          : 'bg-[#C87A5B] text-white hover:bg-[#B2684B] shadow-soft'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Adicionado à Lista de Compras</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          <span>Adicionar à Lista de Compras</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Rodapé da Seção com Resumo */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#EFE8DE] bg-[#FAF6F0]/40 px-4 py-3 sm:px-6 text-xs text-[#70625B] gap-2">
        <span>
          Exibindo <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> itens monitorados
        </span>
        <span className="text-[11px] text-[#70625B]/90">
          Modo Preço Noturno pós 00:00 {isNightShiftActive ? 'ATIVADO' : 'em espera'}
        </span>
      </div>
    </section>
  );
};
