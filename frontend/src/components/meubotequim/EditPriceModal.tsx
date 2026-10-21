import React, { useState, useEffect } from 'react';
import { X, DollarSign, Moon, Sun, Check } from 'lucide-react';
import type { ReplenishmentProduct } from '../../types';

interface EditPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ReplenishmentProduct | null;
  onSavePrice: (
    productId: string,
    prices: { costPrice: number; dayPrice: number; nightPrice: number }
  ) => Promise<void>;
  onSuccess: (message: string) => void;
}

export const EditPriceModal: React.FC<EditPriceModalProps> = ({
  isOpen,
  onClose,
  product,
  onSavePrice,
  onSuccess,
}) => {
  const [costPrice, setCostPrice] = useState<string>('0');
  const [dayPrice, setDayPrice] = useState<string>('0');
  const [nightPrice, setNightPrice] = useState<string>('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCostPrice(product.costPrice ? product.costPrice.toFixed(2) : '0.00');
      setDayPrice(product.dayPrice ? product.dayPrice.toFixed(2) : '0.00');
      const defNight =
        product.nightPrice && product.nightPrice > 0
          ? product.nightPrice
          : Number(((product.dayPrice || 0) * 1.2).toFixed(2));
      setNightPrice(defNight.toFixed(2));
      setErrorMsg('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const cost = parseFloat(costPrice) || 0;
  const day = parseFloat(dayPrice) || 0;
  const night = parseFloat(nightPrice) || 0;

  const dayMargin = day > 0 ? Math.round(((day - cost) / day) * 100) : 0;
  const nightMargin = night > 0 ? Math.round(((night - cost) / night) * 100) : 0;

  const applyMarkup = (percent: number) => {
    if (day > 0) {
      const calc = day * (1 + percent / 100);
      setNightPrice(calc.toFixed(2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (day <= 0) {
      setErrorMsg('O preço diurno de venda deve ser maior que zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onSavePrice(product.id, {
        costPrice: cost,
        dayPrice: day,
        nightPrice: night > 0 ? night : day,
      });
      onSuccess(
        `Preços de "${product.name}" atualizados com sucesso! Diurno: R$ ${day.toFixed(
          2
        )} | Noturno: R$ ${night.toFixed(2)}`
      );
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar novos preços.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C221E]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-6 shadow-soft-lg space-y-5">
        {/* Header do Modal */}
        <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C87A5B]/15 text-[#C87A5B]">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2C221E]">
                Ajustar Preços de Balcão
              </h3>
              <p className="text-xs text-[#70625B] truncate max-w-[240px]">
                {product.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[#70625B] hover:bg-[#FAF6F0] hover:text-[#2C221E] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-[#C24E48]/10 p-3 text-xs text-[#C24E48] border border-[#C24E48]/20">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Resumo do Produto */}
          <div className="flex items-center justify-between rounded-xl bg-[#FAF6F0] p-3 text-xs border border-[#EFE8DE]">
            <div>
              <p className="text-[#70625B]">Categoria</p>
              <p className="font-bold text-[#2C221E]">{product.category}</p>
            </div>
            <div>
              <p className="text-[#70625B]">Estoque Atual</p>
              <p className="font-bold text-[#2C221E]">
                {product.currentStock} {product.unit}
              </p>
            </div>
            <div>
              <p className="text-[#70625B]">Unidade</p>
              <p className="font-bold text-[#2C221E]">{product.unit}</p>
            </div>
          </div>

          {/* Campo: Preço de Custo */}
          <div>
            <label className="block text-xs font-bold text-[#2C221E] mb-1">
              Preço de Custo Pago ao Fornecedor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs font-bold text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
              placeholder="0.00"
            />
            <p className="text-[10px] text-[#70625B] mt-0.5">
              Valor unitário de compra para cálculo de reposição e perdas
            </p>
          </div>

          {/* Campo: Preço Diurno */}
          <div className="rounded-2xl border border-[#EFE8DE] bg-white p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#2C221E] flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-[#DF9B42]" />
                <span>Preço Diurno / Regular (R$) *</span>
              </label>
              <span className="text-[11px] font-bold text-[#5B8A62]">
                Margem: {dayMargin}%
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0.10"
              required
              value={dayPrice}
              onChange={(e) => setDayPrice(e.target.value)}
              className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2 text-sm font-extrabold text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
              placeholder="0.00"
            />
          </div>

          {/* Campo: Preço Noturno pós 00:00 */}
          <div className="rounded-2xl border border-[#2C221E]/20 bg-[#2C221E]/5 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#2C221E] flex items-center gap-1.5">
                <Moon className="h-4 w-4 text-[#C87A5B]" />
                <span>Preço Noturno (Pós-Meia-Noite) (R$)</span>
              </label>
              <span className="text-[11px] font-extrabold text-[#C87A5B]">
                Margem: {nightMargin}%
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0.10"
              value={nightPrice}
              onChange={(e) => setNightPrice(e.target.value)}
              className="w-full rounded-xl border border-[#EFE8DE] bg-white px-3.5 py-2 text-sm font-extrabold text-[#2C221E] focus:border-[#C87A5B] focus:outline-none transition-all"
              placeholder="0.00"
            />

            {/* Botões de Acréscimo Rápido */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-[#70625B] font-semibold mr-1">
                Acréscimo:
              </span>
              {[15, 20, 25, 30].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyMarkup(pct)}
                  className="rounded-lg border border-[#EFE8DE] bg-white px-2 py-0.5 text-[10px] font-bold text-[#70625B] hover:bg-[#C87A5B] hover:text-white hover:border-[#C87A5B] transition-colors"
                >
                  +{pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] text-xs font-semibold text-[#70625B] hover:text-[#2C221E] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] text-xs font-bold text-white shadow-soft transition-all active:scale-95 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{isSubmitting ? 'Salvando...' : 'Salvar Novos Preços'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
