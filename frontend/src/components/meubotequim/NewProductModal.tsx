import React, { useState } from 'react';
import { X, PlusCircle, DollarSign, Sun, Moon } from 'lucide-react';
import type { Category } from '../../types';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCreateProduct: (productData: {
    name: string;
    brand?: string;
    category?: string;
    unit: string;
    currentStock: number;
    minStock: number;
    costPrice: number;
    dayPrice: number;
    nightPrice: number;
  }) => Promise<void>;
  onSuccess: (message: string) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  categories,
  onCreateProduct,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Chopp & Cervejas');
  const [unit, setUnit] = useState('un');
  const [currentStock, setCurrentStock] = useState('10');
  const [minStock, setMinStock] = useState('5');
  const [costPrice, setCostPrice] = useState('');
  const [dayPrice, setDayPrice] = useState('');
  const [nightPrice, setNightPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const cost = parseFloat(costPrice) || 0;
  const day = parseFloat(dayPrice) || 0;
  const night = parseFloat(nightPrice) || (day > 0 ? Number((day * 1.2).toFixed(2)) : 0);

  const dayMargin = day > 0 ? Math.round(((day - cost) / day) * 100) : 0;
  const nightMargin = night > 0 ? Math.round(((night - cost) / night) * 100) : 0;

  const handleDayPriceChange = (val: string) => {
    setDayPrice(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setNightPrice((num * 1.2).toFixed(2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('O nome do produto é obrigatório.');
      return;
    }
    if (day <= 0) {
      setErrorMsg('O preço de venda diurno deve ser maior que zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const stockInit = parseInt(currentStock, 10) || 0;
      const stockMin = parseInt(minStock, 10) || 1;

      await onCreateProduct({
        name: name.trim(),
        brand: brand.trim() || undefined,
        category,
        unit,
        currentStock: stockInit,
        minStock: stockMin,
        costPrice: cost,
        dayPrice: day,
        nightPrice: night,
      });

      onSuccess(`Produto "${name}" cadastrado com sucesso com preço diurno e noturno!`);
      onClose();
      // Reset form
      setName('');
      setBrand('');
      setCostPrice('');
      setDayPrice('');
      setNightPrice('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao cadastrar produto.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C221E]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-6 shadow-soft-lg space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header do Modal */}
        <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C87A5B]/15 text-[#C87A5B]">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2C221E]">
                Cadastrar Novo Produto / Insumo
              </h3>
              <p className="text-xs text-[#70625B]">
                Configure estoque, preços de custo, diurno e noturno pós-meia-noite
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
          {/* Dados Principais do Produto */}
          <div>
            <label className="block text-xs font-bold text-[#2C221E] mb-1">
              Nome do Produto / Bebida *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Cerveja Corona Extra 330ml ou Chopp IPA 50L"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2C221E] mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3 py-2.5 text-xs text-[#2C221E] font-medium focus:border-[#C87A5B] focus:bg-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c._id || c.id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C221E] mb-1">
                Marca / Fabricante
              </label>
              <input
                type="text"
                placeholder="Ex: Ambev, Diageo..."
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none"
              >
              </input>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C221E] mb-1">
                Unidade
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3 py-2.5 text-xs text-[#2C221E] font-semibold focus:border-[#C87A5B] focus:bg-white focus:outline-none"
              >
                <option value="un">un (Unidade)</option>
                <option value="barril">barril (Barril 30L/50L)</option>
                <option value="gf">gf (Garrafa)</option>
                <option value="lata">lata (Lata)</option>
                <option value="dose">dose (Dose 50ml)</option>
                <option value="pct">pct (Pacote)</option>
                <option value="kg">kg (Quilo)</option>
              </select>
            </div>
          </div>

          {/* Saldo Inicial e Mínimo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2C221E] mb-1">
                Estoque Inicial ({unit})
              </label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2 text-xs font-bold text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2C221E] mb-1">
                Estoque Mínimo (Ponto de Pedido)
              </label>
              <input
                type="number"
                min="1"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2 text-xs font-bold text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Seção de Precificação: Custo, Diurno e Noturno */}
          <div className="rounded-2xl border border-[#EFE8DE] bg-[#FAF6F0]/60 p-4 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2C221E] flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-[#C87A5B]" />
              <span>Precificação de Balcão & Noturna</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#70625B] mb-1">
                  Preço de Custo (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 5.50"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-white px-3 py-2 text-xs font-bold text-[#2C221E] focus:border-[#C87A5B] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#2C221E] flex items-center gap-1">
                    <Sun className="h-3 w-3 text-[#DF9B42]" />
                    <span>Diurno (R$) *</span>
                  </label>
                  {dayMargin > 0 && (
                    <span className="text-[10px] font-bold text-[#5B8A62]">
                      {dayMargin}%
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.10"
                  required
                  placeholder="Ex: 14.00"
                  value={dayPrice}
                  onChange={(e) => handleDayPriceChange(e.target.value)}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-white px-3 py-2 text-xs font-extrabold text-[#2C221E] focus:border-[#C87A5B] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#2C221E] flex items-center gap-1">
                    <Moon className="h-3 w-3 text-[#C87A5B]" />
                    <span>Noturno (R$)</span>
                  </label>
                  {nightMargin > 0 && (
                    <span className="text-[10px] font-bold text-[#C87A5B]">
                      {nightMargin}%
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.10"
                  placeholder="Ex: 17.00"
                  value={nightPrice}
                  onChange={(e) => setNightPrice(e.target.value)}
                  className="w-full rounded-xl border border-[#C87A5B]/30 bg-white px-3 py-2 text-xs font-extrabold text-[#C87A5B] focus:border-[#C87A5B] focus:outline-none"
                />
              </div>
            </div>

            <p className="text-[10px] text-[#70625B]">
              O Preço Noturno é preenchido automaticamente com +20%, mas você pode ajustar qualquer valor livremente agora ou a qualquer momento durante a operação.
            </p>
          </div>

          {/* Botões de Envio */}
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
              className="px-5 py-2.5 rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] text-xs font-bold text-white shadow-soft transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
