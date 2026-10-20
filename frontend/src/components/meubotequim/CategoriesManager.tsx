import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Package,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import type { Category, ReplenishmentProduct } from '../../types';

interface CategoriesManagerProps {
  categories: Category[];
  products: ReplenishmentProduct[];
  onCreateCategory: (name: string, description?: string) => Promise<void>;
  onUpdateCategory: (id: string, name: string, description?: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories,
  products,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('O nome da categoria é obrigatório.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      if (editingCategory && (editingCategory._id || editingCategory.id)) {
        const id = (editingCategory._id || editingCategory.id) as string;
        await onUpdateCategory(id, name.trim(), description.trim());
      } else {
        await onCreateCategory(name.trim(), description.trim());
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar categoria.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductCount = (categoryName: string) => {
    return products.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Topo: Título & Botão de Criação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DE] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#2C221E] flex items-center gap-2">
            <Tag className="h-5 w-5 text-[#C87A5B]" />
            <span>Gestão de Categorias do Balcão</span>
          </h2>
          <p className="text-xs text-[#70625B] mt-1">
            Organize bebidas, chopps, destilados e insumos para facilitar a contagem cega e o controle de perdas.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] px-4 py-2.5 text-xs font-bold text-white shadow-soft transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Grid de Cards de Categorias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const catId = (cat._id || cat.id || cat.name) as string;
          const count = getProductCount(cat.name);

          return (
            <div
              key={catId}
              className="rounded-2xl border border-[#EFE8DE] bg-[#FFFFFF] p-5 shadow-soft hover:shadow-soft-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF6F0] text-[#C87A5B] border border-[#EFE8DE]">
                      <Tag className="h-4 w-4" />
                    </span>
                    <h3 className="font-bold text-sm text-[#2C221E] group-hover:text-[#C87A5B] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg text-[#70625B] hover:text-[#2C221E] hover:bg-[#FAF6F0] transition-colors"
                      title="Editar Categoria"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Deseja desativar a categoria "${cat.name}"?`)) {
                          onDeleteCategory(catId);
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#70625B] hover:text-[#C24E48] hover:bg-[#C24E48]/10 transition-colors"
                      title="Excluir Categoria"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#70625B] line-clamp-2">
                  {cat.description || 'Sem descrição cadastrada.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EFE8DE] flex items-center justify-between text-xs text-[#70625B]">
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-[#C87A5B]" />
                  <strong className="text-[#2C221E]">{count}</strong> {count === 1 ? 'item' : 'itens'} vinculados
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5B8A62]">
                  <CheckCircle2 className="h-3 w-3" />
                  Ativa
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-6 shadow-soft-lg space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-3">
              <h3 className="text-base font-bold text-[#2C221E] flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#C87A5B]" />
                <span>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-[#70625B] hover:bg-[#FAF6F0] hover:text-[#2C221E]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-[#C24E48]/10 p-3 text-xs text-[#C24E48] border border-[#C24E48]/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chopps & Cervejas Artesanais"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] placeholder:text-[#70625B]/50 focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Descrição (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Barris de 30L e 50L, latas especiais e garrafas long neck"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] placeholder:text-[#70625B]/50 focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] text-xs font-semibold text-[#70625B] hover:text-[#2C221E] hover:bg-[#EFE8DE]/50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] text-xs font-bold text-white shadow-soft transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
