import React from 'react';
import type { StockStatus } from '../../types/meubotequim';

interface StatusBadgeProps {
  status: StockStatus;
  label?: string;
  size?: 'sm' | 'md';
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  showPulse = true,
}) => {
  const configMap: Record<
    StockStatus,
    { text: string; bgClass: string; dotClass: string; pulseClass: string }
  > = {
    CRITICO: {
      text: label || 'Nível Crítico',
      bgClass: 'bg-[#C24E48]/10 text-[#C24E48] border-[#C24E48]/25',
      dotClass: 'bg-[#C24E48]',
      pulseClass: 'bg-[#C24E48]/40',
    },
    ALERTA: {
      text: label || 'Atenção / Repor',
      bgClass: 'bg-[#DF9B42]/12 text-[#DF9B42] border-[#DF9B42]/30',
      dotClass: 'bg-[#DF9B42]',
      pulseClass: 'bg-[#DF9B42]/40',
    },
    NORMAL: {
      text: label || 'Estoque Regular',
      bgClass: 'bg-[#5B8A62]/12 text-[#5B8A62] border-[#5B8A62]/30',
      dotClass: 'bg-[#5B8A62]',
      pulseClass: 'bg-[#5B8A62]/40',
    },
  };
  const config = configMap[status];

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors select-none ${sizeClasses} ${config.bgClass}`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {showPulse && status === 'CRITICO' && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.pulseClass}`}
          />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      </span>
      <span>{config.text}</span>
    </span>
  );
};
