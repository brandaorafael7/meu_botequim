import React from 'react';
import { X, ShoppingBag, Trash2, MessageCircle } from 'lucide-react';
import type { ShoppingCartItem } from '../../types';

interface ShoppingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingCartItem[];
  onRemoveItem: (id: string) => void;
  onClearList: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export const ShoppingListDrawer: React.FC<ShoppingListDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearList,
  onUpdateQuantity,
}) => {
  if (!isOpen) return null;

  const totalEstimatedCost = items.reduce(
    (sum, item) => sum + item.costPrice * item.quantityToAdd,
    0
  );

  const handleSendWhatsApp = () => {
    const rawTenant = localStorage.getItem('tenant');
    let supplierPhone = '';
    if (rawTenant) {
      try {
        const parsed = JSON.parse(rawTenant);
        supplierPhone = parsed.settings?.whatsappSupplier || parsed.phone || '';
      } catch {
        // ignore
      }
    }

    const textLines = [
      `🍺 *Pedido de Reposição — MeuBotequim*`,
      `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}`,
      ``,
      `*Itens Solicitados:*`,
      ...items.map(
        (i, idx) =>
          `${idx + 1}. *${i.quantityToAdd} ${i.unit}* — ${i.name} ${
            i.brand ? `(${i.brand})` : ''
          } [Estoque atual: ${i.currentStock}]`
      ),
      ``,
      `💰 *Valor Estimado:* ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(totalEstimatedCost)}`,
      ``,
      `_Enviado pelo sistema MeuBotequim (meubotequim.com.br)_`,
    ];

    const cleanPhone = supplierPhone.replace(/\D/g, '');
    const encoded = encodeURIComponent(textLines.join('\n'));
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#2C221E]/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FFFFFF] h-full shadow-soft-lg flex flex-col border-l border-[#EFE8DE] animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header do Drawer */}
        <div className="flex items-center justify-between border-b border-[#EFE8DE] p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C87A5B]/10 text-[#C87A5B]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2C221E]">
                Lista de Reposição de Balcão
              </h2>
              <p className="text-xs text-[#70625B]">
                {items.length} {items.length === 1 ? 'item selecionado' : 'itens selecionados'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#70625B] hover:bg-[#FAF6F0] hover:text-[#2C221E]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-[#70625B]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF6F0] mb-3">
                <ShoppingBag className="h-6 w-6 text-[#70625B]" />
              </div>
              <p className="text-sm font-semibold text-[#2C221E]">Sua lista está vazia</p>
              <p className="text-xs mt-1 max-w-xs">
                Clique em "Repor" na tabela de alertas para incluir itens críticos para o fim de semana.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#EFE8DE] bg-[#FAF6F0] hover:bg-[#FFFFFF] transition-colors"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#2C221E] truncate">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#70625B]">
                    {item.brand ? `${item.brand} • ` : ''}Estoque: {item.currentStock} {item.unit}
                  </p>
                  <p className="text-xs font-extrabold text-[#C87A5B] mt-0.5">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(item.costPrice * item.quantityToAdd)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl border border-[#EFE8DE] bg-[#FFFFFF] shadow-soft">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="px-2.5 py-1 text-xs font-extrabold text-[#70625B] hover:text-[#2C221E]"
                    >
                      -
                    </button>
                    <span className="px-2 py-1 text-xs font-bold text-[#2C221E] min-w-[24px] text-center">
                      {item.quantityToAdd}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="px-2.5 py-1 text-xs font-extrabold text-[#70625B] hover:text-[#2C221E]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-xl text-[#70625B] hover:bg-[#C24E48]/10 hover:text-[#C24E48] transition-colors"
                    title="Remover item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé com Resumo e Ação */}
        {items.length > 0 && (
          <div className="border-t border-[#EFE8DE] p-5 bg-[#FFFFFF] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#70625B]">
              <span>Custo Total Estimado:</span>
              <span className="text-base font-extrabold text-[#2C221E]">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(totalEstimatedCost)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#5B8A62] hover:bg-[#4d7553] px-4 py-3 text-xs font-bold text-white shadow-soft transition-all active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enviar Pedido via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={onClearList}
                className="w-full rounded-xl border border-[#EFE8DE] py-2 text-xs font-semibold text-[#70625B] hover:bg-[#FAF6F0] hover:text-[#2C221E] transition-colors"
              >
                Limpar Lista
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
