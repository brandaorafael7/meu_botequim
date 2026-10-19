import React from 'react';
import {
  PackagePlus,
  TrendingDown,
  ClipboardCheck,
  Sparkles,
} from 'lucide-react';

interface ActionButtonsProps {
  onNewEntry: () => void;
  onRegisterLoss: () => void;
  onStartBlindAudit: () => void;
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onNewEntry,
  onRegisterLoss,
  onStartBlindAudit,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-[#EFE8DE] bg-[#FFFFFF] p-3 sm:p-4 shadow-soft ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Título / Contexto no Desktop */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#70625B]">
          <Sparkles className="h-4 w-4 text-[#DDA76A]" />
          <span>Ações Rápidas de Estoque</span>
        </div>

        {/* Grupo de Botões (Grid ou Flex Mobile-First) */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:flex lg:items-center">
          {/* Botão Primário Destacado: Nova Entrada de Mercadoria */}
          <button
            type="button"
            onClick={onNewEntry}
            className="group flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#C87A5B] px-4 py-2.5 text-xs font-bold text-white shadow-soft transition-all duration-150 hover:bg-[#B2684B] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/30 sm:text-sm"
          >
            <PackagePlus className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>+ Nova Entrada de Mercadoria</span>
          </button>

          {/* Botão Secundário de Contorno: Registrar Baixa / Perda */}
          <button
            type="button"
            onClick={onRegisterLoss}
            className="group flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[#EFE8DE] bg-[#FFFFFF] px-4 py-2.5 text-xs font-bold text-[#2C221E] transition-all duration-150 hover:bg-[#FAF6F0] hover:border-[#DDA76A]/40 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#70625B]/20 sm:text-sm"
          >
            <TrendingDown className="h-4 w-4 text-[#C24E48] transition-transform group-hover:scale-110" />
            <span>Registrar Baixa / Perda</span>
          </button>

          {/* Botão de Apoio: Iniciar Balanço Cego */}
          <button
            type="button"
            onClick={onStartBlindAudit}
            className="group flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-transparent bg-[#FAF6F0] px-4 py-2.5 text-xs font-bold text-[#2C221E] transition-all duration-150 hover:bg-[#EFE8DE] hover:text-[#2C221E] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#DDA76A]/30 sm:text-sm"
          >
            <ClipboardCheck className="h-4 w-4 text-[#DDA76A] transition-transform group-hover:scale-110" />
            <span>Iniciar Balanço Cego</span>
          </button>
        </div>
      </div>
    </div>
  );
};
