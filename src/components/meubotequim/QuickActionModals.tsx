import React, { useState } from 'react';
import { X, PackagePlus, TrendingDown, ClipboardCheck } from 'lucide-react';
import type { ReplenishmentProduct } from '../../types';

interface NewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  products?: ReplenishmentProduct[];
  onConfirmEntry?: (productId: string, quantity: number, invoiceNumber?: string) => Promise<void>;
}

export const NewEntryModal: React.FC<NewEntryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  products = [],
  onConfirmEntry,
}) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const currentProductId = selectedProductId || products[0]?.id || '';
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) return;

    setIsSubmitting(true);
    try {
      if (onConfirmEntry && currentProductId) {
        await onConfirmEntry(currentProductId, qty, invoiceNumber);
      }
      const prod = products.find((p) => p.id === currentProductId);
      const name = prod ? prod.name : productName || 'mercadoria';
      onSuccess(`Entrada de ${qty} ${prod?.unit || 'un'} de ${name} registrada com sucesso!`);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao registrar entrada';
      onSuccess(`Erro: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C221E]/30 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-[#EFE8DE] bg-[#FFFFFF] p-6 shadow-soft-lg">
        <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C87A5B]/15 text-[#C87A5B]">
              <PackagePlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C221E]">Nova Entrada de Mercadoria</h3>
              <p className="text-xs text-[#70625B]">Adicione saldo recebido por nota ou remessa direta</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[#70625B] hover:text-[#2C221E]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#70625B] uppercase tracking-wider mb-1">
              Produto / Item do Estoque
            </label>
            {products.length > 0 ? (
              <select
                value={currentProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-sm text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.brand ? `(${p.brand})` : ''} — Estoque atual: {p.currentStock} {p.unit}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex.: Chopp Pilsen 50L ou Cerveja Long Neck"
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-sm text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#70625B] uppercase tracking-wider mb-1">
                Quantidade
              </label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ex.: 10"
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-sm text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#70625B] uppercase tracking-wider mb-1">
                Nº Nota / Lote
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Ex.: NF-9842"
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-sm text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-[#EFE8DE] px-4 py-2.5 text-xs font-semibold text-[#70625B] hover:bg-[#FAF6F0]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#C87A5B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#B2684B] shadow-soft disabled:opacity-50"
            >
              {isSubmitting ? 'Registrando...' : 'Confirmar Entrada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface RegisterLossModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  products?: ReplenishmentProduct[];
  onConfirmLoss?: (productId: string, quantity: number, reason: string) => Promise<void>;
}

export const RegisterLossModal: React.FC<RegisterLossModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  products = [],
  onConfirmLoss,
}) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const currentProductId = selectedProductId || products[0]?.id || '';
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('AVARIA');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) return;

    setIsSubmitting(true);
    try {
      if (onConfirmLoss && currentProductId) {
        await onConfirmLoss(currentProductId, qty, reason);
      }
      const prod = products.find((p) => p.id === currentProductId);
      const name = prod ? prod.name : productName || 'item';
      onSuccess(`Baixa de ${qty} ${prod?.unit || 'un'} de ${name} registrada sob motivo: ${reason}`);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao registrar perda';
      onSuccess(`Erro: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C221E]/30 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-[#EFE8DE] bg-[#FFFFFF] p-6 shadow-soft-lg">
        <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C24E48]/15 text-[#C24E48]">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C221E]">Registrar Baixa / Perda</h3>
              <p className="text-xs text-[#70625B]">Contabilize quebras, validade expirada ou desperdício de chopp</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[#70625B] hover:text-[#2C221E]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#70625B] uppercase tracking-wider mb-1">
              Item / Produto
            </label>
            {products.length > 0 ? (
              <select
                value={currentProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-sm text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Estoque atual: {p.currentStock} {p.unit}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex.: Garrafa Heineken 330ml (quebrada no salão)"
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-sm text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#70625B] uppercase tracking-wider mb-1">
                Quantidade
              </label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ex.: 2"
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-sm text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#70625B] uppercase tracking-wider mb-1">
                Motivo da Perda
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-sm text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 font-medium"
              >
                <option value="Avaria / Quebra Física">Avaria / Quebra Física</option>
                <option value="Validade Expirada">Validade Expirada</option>
                <option value="Espuma / Sangria de Linha">Espuma / Sangria de Linha</option>
                <option value="Degustação / Cortesia da Casa">Degustação / Cortesia</option>
                <option value="Divergência de Contagem">Divergência de Contagem</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-[#EFE8DE] px-4 py-2.5 text-xs font-semibold text-[#70625B] hover:bg-[#FAF6F0]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#C24E48] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#A93E39] shadow-soft disabled:opacity-50"
            >
              {isSubmitting ? 'Registrando...' : 'Confirmar Baixa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface BlindAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  products?: ReplenishmentProduct[];
  onConfirmAudit?: (productId: string, countedStock: number) => Promise<void>;
}

export const BlindAuditModal: React.FC<BlindAuditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  products = [],
  onConfirmAudit,
}) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const currentProductId = selectedProductId || products[0]?.id || '';
  const [countedQuantity, setCountedQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(countedQuantity, 10);
    if (isNaN(qty) || qty < 0) return;

    setIsSubmitting(true);
    try {
      if (onConfirmAudit && currentProductId) {
        await onConfirmAudit(currentProductId, qty);
      }
      const prod = products.find((p) => p.id === currentProductId);
      onSuccess(`Contagem de balanço para ${prod?.name || 'produto'} salva! Novo saldo: ${qty} ${prod?.unit || 'un'}`);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao registrar auditoria';
      onSuccess(`Erro: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C221E]/30 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-[#EFE8DE] bg-[#FFFFFF] p-6 shadow-soft-lg">
        <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DDA76A]/20 text-[#2C221E]">
              <ClipboardCheck className="h-5 w-5 text-[#C87A5B]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C221E]">Balanço Cego & Auditoria</h3>
              <p className="text-xs text-[#70625B]">Contagem física sem interferência para ajuste exato de estoque</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[#70625B] hover:text-[#2C221E]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#70625B] uppercase tracking-wider mb-1">
              Item a Auditar
            </label>
            {products.length > 0 ? (
              <select
                value={currentProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-sm text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.unit})
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#70625B] uppercase tracking-wider mb-1">
              Quantidade Real Contada no Balcão
            </label>
            <input
              type="number"
              required
              min="0"
              value={countedQuantity}
              onChange={(e) => setCountedQuantity(e.target.value)}
              placeholder="Digite o saldo físico verificado"
              className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-sm text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 font-mono"
            />
            <p className="mt-1 text-[11px] text-[#70625B]">
              * Esta contagem ajustará diretamente o saldo oficial no banco de dados.
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-[#EFE8DE] px-4 py-2.5 text-xs font-semibold text-[#70625B] hover:bg-[#FAF6F0]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#C87A5B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#B2684B] shadow-soft disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Confirmar Ajuste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
