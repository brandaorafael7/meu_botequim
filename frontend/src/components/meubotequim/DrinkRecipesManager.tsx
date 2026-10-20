import React, { useState } from 'react';
import {
  Wine,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import type { DrinkRecipe } from '../../types';

const INITIAL_RECIPES: DrinkRecipe[] = [
  {
    id: 'drink-1',
    name: 'Caipirinha Tradicional de Limão',
    category: 'Coquetéis Clássicos',
    description: 'Cachaça artesanal branca, limão tahiti macerado e açúcar refinado servido em copo baixo com gelo britado.',
    glass: 'Copo Baixo (Old Fashioned)',
    prepTimeMinutes: 3,
    ingredients: [
      { name: 'Cachaça Artesanal Prata (60ml)', quantity: '60ml', unitCost: 2.40 },
      { name: 'Limão Tahiti (1 unidade)', quantity: '1 un', unitCost: 0.60 },
      { name: 'Açúcar Refinado / Xarope Simples', quantity: '20g', unitCost: 0.15 },
      { name: 'Gelo Britado / Cubos', quantity: '150g', unitCost: 0.25 },
    ],
    doseCost: 3.40,
    suggestedSalePrice: 22.00,
    marginPercent: 84.5,
  },
  {
    id: 'drink-2',
    name: 'Gin Tônica Clássica com Especiarias',
    category: 'Gin & Tônicas',
    description: 'Gin London Dry com água tônica premium, zimbro tostado e rodela de limão siciliano.',
    glass: 'Taça Balloon 600ml',
    prepTimeMinutes: 2,
    ingredients: [
      { name: 'Gin London Dry (50ml)', quantity: '50ml', unitCost: 6.30 },
      { name: 'Água Tônica em Lata (200ml)', quantity: '1 lata', unitCost: 3.80 },
      { name: 'Zimbro e Especiarias', quantity: '5g', unitCost: 0.40 },
      { name: 'Limão Siciliano / Gelo', quantity: '1 fatia', unitCost: 0.50 },
    ],
    doseCost: 11.00,
    suggestedSalePrice: 38.00,
    marginPercent: 71.0,
  },
  {
    id: 'drink-3',
    name: 'Aperol Spritz Veneziano',
    category: 'Spritz & Aperitivos',
    description: 'Aperol, espumante prosecco brut e água com gás com meia lua de laranja bahia.',
    glass: 'Taça de Vinho 450ml',
    prepTimeMinutes: 2,
    ingredients: [
      { name: 'Aperol (60ml)', quantity: '60ml', unitCost: 5.80 },
      { name: 'Espumante Prosecco Brut (90ml)', quantity: '90ml', unitCost: 4.50 },
      { name: 'Água com Gás (30ml)', quantity: '30ml', unitCost: 0.30 },
      { name: 'Laranja Bahia & Gelo', quantity: '1 fatia', unitCost: 0.60 },
    ],
    doseCost: 11.20,
    suggestedSalePrice: 36.00,
    marginPercent: 68.8,
  },
  {
    id: 'drink-4',
    name: 'Moscow Mule da Casa (Espuma de Gengibre)',
    category: 'Vodka & Mules',
    description: 'Vodka premium, suco de limão fresco e espuma cremosa artesanal de gengibre na caneca de cobre.',
    glass: 'Caneca de Cobre 350ml',
    prepTimeMinutes: 3,
    ingredients: [
      { name: 'Vodka Premium (50ml)', quantity: '50ml', unitCost: 4.80 },
      { name: 'Suco de Limão Tahiti (20ml)', quantity: '20ml', unitCost: 0.40 },
      { name: 'Xarope Simples de Açúcar', quantity: '15ml', unitCost: 0.20 },
      { name: 'Espuma Artesanal de Gengibre', quantity: '40ml', unitCost: 1.50 },
    ],
    doseCost: 6.90,
    suggestedSalePrice: 34.00,
    marginPercent: 79.7,
  },
];

export const DrinkRecipesManager: React.FC = () => {
  const [recipes, setRecipes] = useState<DrinkRecipe[]>(INITIAL_RECIPES);
  const [expandedId, setExpandedId] = useState<string | null>('drink-1');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulário de nova ficha
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Coquetéis Clássicos');
  const [glass, setGlass] = useState('Taça Balloon');
  const [description, setDescription] = useState('');
  const [salePrice, setSalePrice] = useState('30.00');
  const [doseCost, setDoseCost] = useState('7.50');

  const handleAddRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(doseCost) || 0;
    const price = parseFloat(salePrice) || 0;
    const margin = price > 0 ? Number((((price - cost) / price) * 100).toFixed(1)) : 0;

    const newRecipe: DrinkRecipe = {
      id: `drink-${Date.now()}`,
      name: name.trim(),
      category,
      glass,
      description: description.trim() || 'Ficha técnica cadastrada no MeuBotequim.',
      prepTimeMinutes: 3,
      ingredients: [
        { name: 'Insumo Base / Destilado', quantity: '50ml', unitCost: cost * 0.7 },
        { name: 'Mixer / Guarnição e Gelo', quantity: '1 porção', unitCost: cost * 0.3 },
      ],
      doseCost: cost,
      suggestedSalePrice: price,
      marginPercent: margin,
    };

    setRecipes([newRecipe, ...recipes]);
    setExpandedId(newRecipe.id);
    setIsModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Topo Informativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DE] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#2C221E] flex items-center gap-2">
            <Wine className="h-5 w-5 text-[#C87A5B]" />
            <span>Fichas Técnicas & Engenharia de Cardápio</span>
          </h2>
          <p className="text-xs text-[#70625B] mt-1">
            Controle de doses, custo unitário por drink (CMV) e cálculo automático da margem de lucro de balcão.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] px-4 py-2.5 text-xs font-bold text-white shadow-soft transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Ficha Técnica</span>
        </button>
      </div>

      {/* Lista de Fichas Técnicas */}
      <div className="space-y-4">
        {recipes.map((recipe) => {
          const isExpanded = expandedId === recipe.id;

          return (
            <div
              key={recipe.id}
              className="rounded-2xl border border-[#EFE8DE] bg-white shadow-soft overflow-hidden transition-all"
            >
              {/* Header do Card */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF6F0]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF6F0] text-[#C87A5B] border border-[#EFE8DE] shrink-0">
                    <Wine className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-[#2C221E]">{recipe.name}</h3>
                      <span className="rounded-full bg-[#FAF6F0] px-2 py-0.5 text-[10px] font-bold text-[#70625B] border border-[#EFE8DE]">
                        {recipe.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#70625B] mt-0.5">{recipe.glass}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-8 justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-[#70625B] uppercase">Custo Unitário (CMV)</p>
                    <p className="text-sm font-black text-[#C24E48]">
                      R$ {recipe.doseCost.toFixed(2)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-[#70625B] uppercase">Preço de Venda</p>
                    <p className="text-sm font-black text-[#2C221E]">
                      R$ {recipe.suggestedSalePrice.toFixed(2)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-[#70625B] uppercase">Margem Bruta</p>
                    <span className="inline-flex items-center gap-0.5 rounded-lg bg-[#5B8A62]/15 px-2 py-0.5 text-xs font-black text-[#5B8A62] border border-[#5B8A62]/30">
                      {recipe.marginPercent}%
                    </span>
                  </div>

                  <div className="text-[#70625B]">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
              </div>

              {/* Detalhes Expandidos (Insumos e Modo de Preparo) */}
              {isExpanded && (
                <div className="border-t border-[#EFE8DE] bg-[#FAF6F0]/50 p-5 space-y-4 animate-in fade-in duration-200">
                  <p className="text-xs text-[#70625B]">{recipe.description}</p>

                  <div>
                    <h4 className="text-xs font-bold text-[#2C221E] uppercase tracking-wider mb-2">
                      Insumos & Doses Vinculadas ao Estoque
                    </h4>
                    <div className="rounded-xl border border-[#EFE8DE] bg-white overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF6F0] border-b border-[#EFE8DE] text-[#70625B]">
                          <tr>
                            <th className="py-2.5 px-4 font-bold">Insumo / Ingrediente</th>
                            <th className="py-2.5 px-4 font-bold">Dose / Qtd</th>
                            <th className="py-2.5 px-4 font-bold text-right">Custo Estimado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EFE8DE]">
                          {recipe.ingredients.map((ing, i) => (
                            <tr key={i} className="hover:bg-[#FAF6F0]/40">
                              <td className="py-2 px-4 font-semibold text-[#2C221E]">{ing.name}</td>
                              <td className="py-2 px-4 text-[#70625B]">{ing.quantity}</td>
                              <td className="py-2 px-4 text-right font-bold text-[#2C221E]">
                                R$ {ing.unitCost.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Nova Ficha Técnica */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-[#EFE8DE] bg-[#FFFFFF] p-6 shadow-soft-lg space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-3">
              <h3 className="text-base font-bold text-[#2C221E] flex items-center gap-2">
                <Wine className="h-4 w-4 text-[#C87A5B]" />
                <span>Cadastrar Nova Ficha Técnica</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-[#70625B] hover:bg-[#FAF6F0] hover:text-[#2C221E]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecipe} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Nome do Drink / Coquetel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gin Tropical com Energético"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C221E] mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
                  >
                    <option>Coquetéis Clássicos</option>
                    <option>Gin & Tônicas</option>
                    <option>Spritz & Aperitivos</option>
                    <option>Vodka & Mules</option>
                    <option>Chopps Especiais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C221E] mb-1">
                    Tipo de Taça / Copo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Taça Balloon 600ml"
                    value={glass}
                    onChange={(e) => setGlass(e.target.value)}
                    className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C221E] mb-1">
                    Custo por Dose (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={doseCost}
                    onChange={(e) => setDoseCost(e.target.value)}
                    className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C221E] mb-1">
                    Preço de Venda no Cardápio (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Modo de Preparo / Observações
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Montar direto no copo com gelo, adicionar 50ml de gin, completar com energético..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] text-xs font-semibold text-[#70625B] hover:text-[#2C221E]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] text-xs font-bold text-white shadow-soft transition-all active:scale-95"
                >
                  Salvar Ficha Técnica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
