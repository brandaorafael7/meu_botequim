import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: 'danger' | 'warning' | 'success' | 'primary' | 'secondary';
  };
  trend?: {
    text: string;
    direction: 'up' | 'down' | 'neutral';
    isPositive?: boolean;
  };
  footerNote?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badge,
  trend,
  footerNote,
}) => {
  const getBadgeStyle = (variant: 'danger' | 'warning' | 'success' | 'primary' | 'secondary') => {
    switch (variant) {
      case 'danger':
        return 'bg-[#C24E48]/12 text-[#C24E48] border-[#C24E48]/30';
      case 'warning':
        return 'bg-[#DF9B42]/12 text-[#DF9B42] border-[#DF9B42]/30';
      case 'success':
        return 'bg-[#5B8A62]/12 text-[#5B8A62] border-[#5B8A62]/30';
      case 'primary':
        return 'bg-[#C87A5B]/12 text-[#C87A5B] border-[#C87A5B]/30';
      case 'secondary':
        return 'bg-[#DDA76A]/15 text-[#2C221E] border-[#DDA76A]/40';
      default:
        return 'bg-[#FAF6F0] text-[#70625B] border-[#EFE8DE]';
    }
  };

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EFE8DE] bg-[#FFFFFF] p-5 shadow-soft transition-all duration-200 hover:border-[#DDA76A]/50 hover:shadow-soft-md">
      {/* Header do Card: Título, Ícone e Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#70625B]">
              {title}
            </span>
            {badge && (
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${getBadgeStyle(
                  badge.variant
                )}`}
              >
                {badge.text}
              </span>
            )}
          </div>
          {/* Valor Principal com Café Espresso */}
          <div className="mt-2 text-2xl font-bold tracking-tight text-[#2C221E] sm:text-3xl">
            {value}
          </div>
        </div>

        {/* Container do Ícone com tom terroso suave */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FAF6F0] text-[#C87A5B] border border-[#EFE8DE] transition-transform duration-200 group-hover:scale-105">
          {icon}
        </div>
      </div>

      {/* Rodapé do Card: Subtítulo ou Tendência */}
      {(subtitle || trend || footerNote) && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#EFE8DE]/70 pt-3 text-xs text-[#70625B]">
          {trend ? (
            <div className="flex items-center gap-1 font-medium">
              {trend.direction === 'up' && (
                <ArrowUpRight
                  className={`h-3.5 w-3.5 ${
                    trend.isPositive ? 'text-[#5B8A62]' : 'text-[#C24E48]'
                  }`}
                />
              )}
              {trend.direction === 'down' && (
                <ArrowDownRight
                  className={`h-3.5 w-3.5 ${
                    trend.isPositive ? 'text-[#5B8A62]' : 'text-[#C24E48]'
                  }`}
                />
              )}
              {trend.direction === 'neutral' && (
                <Minus className="h-3.5 w-3.5 text-[#70625B]" />
              )}
              <span
                className={
                  trend.isPositive === undefined
                    ? 'text-[#70625B]'
                    : trend.isPositive
                    ? 'text-[#5B8A62] font-semibold'
                    : 'text-[#C24E48] font-semibold'
                }
              >
                {trend.text}
              </span>
            </div>
          ) : (
            <span>{subtitle}</span>
          )}

          {footerNote && (
            <span className="text-[11px] text-[#70625B]/80 font-normal">
              {footerNote}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
