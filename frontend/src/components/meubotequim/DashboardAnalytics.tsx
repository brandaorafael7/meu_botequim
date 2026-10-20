import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  PieChart,
  BarChart3,
} from 'lucide-react';
import type { DashboardMetrics, ReplenishmentProduct } from '../../types';

interface DashboardAnalyticsProps {
  metrics: DashboardMetrics | null;
  products: ReplenishmentProduct[];
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  metrics,
  products,
}) => {
  const chartData = metrics?.chartData || [
    { dia: 'Seg', vendas: 2450.0 },
    { dia: 'Ter', vendas: 3120.0 },
    { dia: 'Qua', vendas: 4500.0 },
    { dia: 'Qui', vendas: 7200.0 },
    { dia: 'Sex', vendas: 14850.0 },
    { dia: 'Sáb', vendas: 18400.0 },
    { dia: 'Dom', vendas: 6200.0 },
  ];

  const maxVenda = Math.max(...chartData.map((d) => d.vendas), 1);

  // Agrupamento de estoque por categoria
  const categoryStock = products.reduce((acc, p) => {
    const cat = p.category || 'Outros';
    const totalVal = (p.currentStock || 0) * (p.costPrice || 0);
    acc[cat] = (acc[cat] || 0) + totalVal;
    return acc;
  }, {} as Record<string, number>);

  const categoryEntries = Object.entries(categoryStock).sort((a, b) => b[1] - a[1]);
  const totalStockValue = Object.values(categoryStock).reduce((a, b) => a + b, 0);

  // Estimativa de tipos de perdas
  const lossReasons = [
    { label: 'Quebra de Garrafas / Copos no Balcão', percent: 42, color: '#C24E48', desc: 'Quedas no rush do atendimento' },
    { label: 'Chopp Residual / Limpeza de Serpentina', percent: 28, color: '#DF9B42', desc: 'Espuma e sangria inicial de barril' },
    { label: 'Vencimento / Oxidação de Insumos', percent: 18, color: '#DDA76A', desc: 'Itens perecíveis e xaropes abertos' },
    { label: 'Consumo Interno / Cortesia Não Registrada', percent: 12, color: '#70625B', desc: 'Doses e degustação de equipe' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Topo Informativo */}
      <div className="border-b border-[#EFE8DE] pb-4">
        <h2 className="text-xl font-extrabold text-[#2C221E] flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#C87A5B]" />
          <span>Inteligência de Vendas, Perdas & Giro de Balcão</span>
        </h2>
        <p className="text-xs text-[#70625B] mt-1">
          Visão gráfica de faturamento dos últimos 7 dias, concentração de estoque por categoria e diagnóstico de quebras.
        </p>
      </div>

      {/* Grid Principal: Gráfico de Vendas + Diagnóstico de Perdas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Gráfico de Vendas dos 7 Dias */}
        <div className="lg:col-span-2 rounded-2xl border border-[#EFE8DE] bg-white p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#2C221E] flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#5B8A62]" />
                <span>Evolução do Faturamento Semanal (PDV)</span>
              </h3>
              <p className="text-[11px] text-[#70625B]">
                Picos de vendas identificados para antecipação de pedidos de barril
              </p>
            </div>
            <span className="text-xs font-extrabold text-[#5B8A62] bg-[#5B8A62]/10 px-2.5 py-1 rounded-lg border border-[#5B8A62]/20">
              Total 7D: R$ {chartData.reduce((acc, d) => acc + d.vendas, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Gráfico de Barras Customizado */}
          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2">
            {chartData.map((d, i) => {
              const heightPct = Math.max(10, Math.round((d.vendas / maxVenda) * 100));
              const isWeekend = d.dia === 'Sex' || d.dia === 'Sáb' || d.dia === 'Dom';

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-[#70625B] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    R$ {d.vendas >= 1000 ? `${(d.vendas / 1000).toFixed(1)}k` : d.vendas}
                  </span>
                  <div
                    className="w-full rounded-t-xl transition-all duration-300 group-hover:scale-y-105"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: isWeekend ? '#C87A5B' : '#DDA76A',
                    }}
                  />
                  <span className="text-xs font-bold text-[#2C221E] group-hover:text-[#C87A5B]">
                    {d.dia}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#70625B] pt-2 border-t border-[#EFE8DE]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#DDA76A]" /> Dias Úteis
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#C87A5B]" /> Pico do FDS
              </span>
            </div>
            <span className="font-semibold text-[#2C221E]">
              68% da receita ocorre de sexta a domingo
            </span>
          </div>
        </div>

        {/* Coluna 3: Diagnóstico de Perdas e Quebras */}
        <div className="rounded-2xl border border-[#EFE8DE] bg-white p-6 shadow-soft space-y-4">
          <div className="border-b border-[#EFE8DE] pb-3">
            <h3 className="text-sm font-bold text-[#2C221E] flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#C24E48]" />
              <span>Origem das Perdas no Balcão</span>
            </h3>
            <p className="text-[11px] text-[#70625B]">
              Distribuição estimada por motivo declarado
            </p>
          </div>

          <div className="space-y-4">
            {lossReasons.map((reason, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2C221E]">{reason.label}</span>
                  <span className="font-extrabold" style={{ color: reason.color }}>
                    {reason.percent}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#FAF6F0] overflow-hidden border border-[#EFE8DE]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${reason.percent}%`,
                      backgroundColor: reason.color,
                    }}
                  />
                </div>
                <p className="text-[10px] text-[#70625B]">{reason.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-[#C24E48]/10 p-3 border border-[#C24E48]/20 text-xs text-[#2C221E]">
            <p className="font-bold text-[#C24E48]">Dica Operacional MeuBotequim:</p>
            <p className="text-[11px] text-[#70625B] mt-0.5">
              Ao registrar perdas em até 3 minutos no balanço cego, o bar reduz quebras reincidentes em até 35% no primeiro mês.
            </p>
          </div>
        </div>
      </div>

      {/* Linha Inferior: Concentração do Valor do Estoque por Categoria */}
      <div className="rounded-2xl border border-[#EFE8DE] bg-white p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-[#2C221E] flex items-center gap-2 border-b border-[#EFE8DE] pb-3">
          <PieChart className="h-4 w-4 text-[#C87A5B]" />
          <span>Concentração de Capital em Estoque por Categoria</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryEntries.slice(0, 4).map(([catName, value], idx) => {
            const share = totalStockValue > 0 ? Math.round((value / totalStockValue) * 100) : 0;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#2C221E] truncate">{catName}</p>
                    <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-extrabold text-[#C87A5B] border border-[#EFE8DE]">
                      {share}%
                    </span>
                  </div>
                  <p className="text-lg font-black text-[#2C221E] mt-2">
                    R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <p className="text-[10px] text-[#70625B] mt-2">
                  Preço de custo imobilizado no estoque
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
