import React, { useState } from 'react';
import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  RotateCcw,
  Search,
} from 'lucide-react';
import type { StockMovement } from '../../types';

interface AuditTrailTableProps {
  movements: StockMovement[];
  onRefresh?: () => void;
}

export const AuditTrailTable: React.FC<AuditTrailTableProps> = ({
  movements,
}) => {
  const [filterType, setFilterType] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMovements = movements.filter((mov) => {
    if (filterType !== 'TODAS' && mov.type !== filterType) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const prodName = typeof mov.productId === 'object' ? mov.productId.name : '';
      const reason = mov.reason || '';
      return prodName.toLowerCase().includes(term) || reason.toLowerCase().includes(term);
    }
    return true;
  });

  const getMovementBadge = (type: string) => {
    switch (type) {
      case 'ENTRADA':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#5B8A62]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#5B8A62] border border-[#5B8A62]/30">
            <ArrowUpRight className="h-3 w-3" />
            Entrada de Carga
          </span>
        );
      case 'SAIDA':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#70625B]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#70625B] border border-[#70625B]/30">
            <ArrowDownLeft className="h-3 w-3" />
            Saída PDV
          </span>
        );
      case 'PERDA':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#C24E48]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#C24E48] border border-[#C24E48]/30">
            <AlertTriangle className="h-3 w-3" />
            Perda / Avaria
          </span>
        );
      case 'AJUSTE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#DF9B42]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#DF9B42] border border-[#DF9B42]/30">
            <RotateCcw className="h-3 w-3" />
            Balanço Cego
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Topo Informativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DE] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#2C221E] flex items-center gap-2">
            <History className="h-5 w-5 text-[#C87A5B]" />
            <span>Trilha de Auditoria & Movimentações</span>
          </h2>
          <p className="text-xs text-[#70625B] mt-1">
            Registro imutável de todas as conferências cegas, perdas de balcão e entradas de distribuidora.
          </p>
        </div>

        {/* Filtros por Tipo de Movimentação */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {['TODAS', 'PERDA', 'AJUSTE', 'ENTRADA', 'SAIDA'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-[#C87A5B] text-white shadow-soft'
                  : 'bg-white border border-[#EFE8DE] text-[#70625B] hover:text-[#2C221E] hover:bg-[#FAF6F0]'
              }`}
            >
              {type === 'TODAS'
                ? 'Todas'
                : type === 'PERDA'
                ? 'Perdas'
                : type === 'AJUSTE'
                ? 'Balanço Cego'
                : type === 'ENTRADA'
                ? 'Entradas'
                : 'Saídas'}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#70625B]" />
          <input
            type="text"
            placeholder="Buscar por nome do produto ou motivo do registro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#EFE8DE] bg-white pl-10 pr-4 py-2.5 text-xs text-[#2C221E] placeholder:text-[#70625B]/50 focus:border-[#C87A5B] focus:outline-none transition-all shadow-soft"
          />
        </div>
      </div>

      {/* Tabela de Movimentações */}
      <div className="rounded-2xl border border-[#EFE8DE] bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#EFE8DE] text-[#70625B]">
              <tr>
                <th className="py-3 px-4 font-bold">Tipo de Registro</th>
                <th className="py-3 px-4 font-bold">Produto</th>
                <th className="py-3 px-4 font-bold text-center">Qtd</th>
                <th className="py-3 px-4 font-bold text-center">Antes / Depois</th>
                <th className="py-3 px-4 font-bold">Motivo Declarado</th>
                <th className="py-3 px-4 font-bold text-right">Data & Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DE]">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#70625B]">
                    Nenhuma movimentação encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((mov) => {
                  const prodName =
                    typeof mov.productId === 'object'
                      ? mov.productId.name
                      : 'Produto Geral';
                  const dateStr = new Date(mov.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={mov._id} className="hover:bg-[#FAF6F0]/50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getMovementBadge(mov.type)}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C221E]">
                        {prodName}
                      </td>
                      <td className="py-3 px-4 text-center font-extrabold text-[#2C221E]">
                        {mov.type === 'PERDA' ? `-${mov.quantity}` : `+${mov.quantity}`}
                      </td>
                      <td className="py-3 px-4 text-center text-[#70625B] font-mono text-[11px]">
                        {mov.previousStock} → <strong className="text-[#2C221E]">{mov.newStock}</strong>
                      </td>
                      <td className="py-3 px-4 text-[#70625B]">
                        {mov.reason || 'Movimentação operacional padrão'}
                      </td>
                      <td className="py-3 px-4 text-right text-[#70625B] whitespace-nowrap">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
