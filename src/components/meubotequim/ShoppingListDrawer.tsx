import React from 'react';
import { X, ShoppingBag, Trash2, Send } from 'lucide-react';
import type { ShoppingCartItem } from '../../types/meubotequim';

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
                Lista de Reposição
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
                Clique em "Adicionar à Lista de Compras" na tabela para incluir os itens críticos.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] p-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#2C221E] truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#70625B]">
                    Custo unitário: R$ {item.costPrice.toFixed(2)} / {item.unit}
                  </p>
                  <p className="text-[11px] text-[#C24E48] font-medium">
                    Saldo atual: {item.currentStock} (Mín: {item.minStock})
                  </p>
                </div>

                {/* Controle de Quantidade */}
                <div className="flex items-center gap-1.5 bg-white rounded-lg border border-[#EFE8DE] px-2 py-1">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="text-[#70625B] hover:text-[#2C221E] px-1 font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-[#2C221E] w-6 text-center">
                    {item.quantityToAdd}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="text-[#70625B] hover:text-[#2C221E] px-1 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Remover Item */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-[#70625B] hover:text-[#C24E48] p-1.5 transition-colors"
                  title="Remover da lista"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClearList}
                className="flex-1 rounded-xl border border-[#EFE8DE] py-2.5 text-xs font-semibold text-[#70625B] hover:bg-[#FAF6F0] hover:text-[#2C221E]"
              >
                Limpar Lista
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Lista de compras enviada para os distribuidores parceiros!');
                  onClose();
                }}
                className="flex-2 flex items-center justify-center gap-1.5 rounded-xl bg-[#C87A5B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#B2684B] shadow-soft"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Gerar Pedido de Compra</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
