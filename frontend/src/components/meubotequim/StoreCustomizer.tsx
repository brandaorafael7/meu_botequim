import React, { useState, useEffect } from 'react';
import {
  Store,
  Palette,
  Phone,
  ShieldCheck,
  Save,
  CheckCircle2,
  Building,
  MapPin,
  MessageSquare,
  Moon,
} from 'lucide-react';
import type { Tenant, TenantSettings } from '../../types';

interface StoreCustomizerProps {
  currentTenant: Tenant | null;
  onSaveTenant: (updatedData: Partial<Tenant>) => Promise<void>;
  showToast: (msg: string) => void;
}

const COLOR_PRESETS = [
  { name: 'Terracota Botequim', value: '#C87A5B', desc: 'Identidade original MeuBotequim' },
  { name: 'Âmbar Chopp', value: '#DDA76A', desc: 'Ideal para choperias artesanais' },
  { name: 'Verde Sálvia', value: '#5B8A62', desc: 'Botecos botânicos e gastrobares' },
  { name: 'Vinho Bordô', value: '#8E3B46', desc: 'Wine bars e bistrôs de balcão' },
  { name: 'Café Espresso', value: '#2C221E', desc: 'Pubs noturnos e bares intimistas' },
];

export const StoreCustomizer: React.FC<StoreCustomizerProps> = ({
  currentTenant,
  onSaveTenant,
  showToast,
}) => {
  const [name, setName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [phone, setPhone] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#C87A5B');
  const [safetyMarginDays, setSafetyMarginDays] = useState(3);

  // Configurações de Preço Noturno pós 00:00
  const [nightPricingEnabled, setNightPricingEnabled] = useState(true);
  const [nightPricingStartHour, setNightPricingStartHour] = useState(0);
  const [nightPricingEndHour, setNightPricingEndHour] = useState(6);
  const [nightPricingAutoMarkupPercent, setNightPricingAutoMarkupPercent] = useState(20);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentTenant) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(currentTenant.name || '');
      setBranchName(currentTenant.settings?.branchName || 'Balcão & Salão Principal');
      setPhone(currentTenant.phone || '');
      setSupplierPhone(currentTenant.settings?.whatsappSupplier || '');
      setAddress(currentTenant.address || '');
      setCnpj(currentTenant.cnpj || '');
      setPrimaryColor(currentTenant.settings?.primaryColor || '#C87A5B');
      setSafetyMarginDays(currentTenant.settings?.safetyMarginDays || 3);

      if (currentTenant.settings?.nightPricingEnabled !== undefined) {
        setNightPricingEnabled(currentTenant.settings.nightPricingEnabled);
      }
      if (currentTenant.settings?.nightPricingStartHour !== undefined) {
        setNightPricingStartHour(currentTenant.settings.nightPricingStartHour);
      }
      if (currentTenant.settings?.nightPricingEndHour !== undefined) {
        setNightPricingEndHour(currentTenant.settings.nightPricingEndHour);
      }
      if (currentTenant.settings?.nightPricingAutoMarkupPercent !== undefined) {
        setNightPricingAutoMarkupPercent(currentTenant.settings.nightPricingAutoMarkupPercent);
      }
    }
  }, [currentTenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('O nome do estabelecimento é obrigatório.');
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedSettings: TenantSettings = {
        ...(currentTenant?.settings || {}),
        branchName: branchName.trim(),
        primaryColor,
        whatsappSupplier: supplierPhone.trim(),
        safetyMarginDays: Number(safetyMarginDays),
        phone: phone.trim(),
        address: address.trim(),
        nightPricingEnabled,
        nightPricingStartHour: Number(nightPricingStartHour),
        nightPricingEndHour: Number(nightPricingEndHour),
        nightPricingAutoMarkupPercent: Number(nightPricingAutoMarkupPercent),
      };

      await onSaveTenant({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        cnpj: cnpj.trim(),
        settings: updatedSettings,
      });

      showToast('Configurações e Preço Noturno salvos com sucesso!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar personalização.';
      showToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      {/* Topo informativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DE] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#2C221E] flex items-center gap-2">
            <Store className="h-5 w-5 text-[#C87A5B]" />
            <span>Personalização do Bar & Tabela de Preços</span>
          </h2>
          <p className="text-xs text-[#70625B] mt-1">
            Configure dados operacionais, a identidade visual do estabelecimento e as regras de cobrança noturna pós-meia-noite.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C87A5B] hover:bg-[#B2684B] px-5 py-2.5 text-xs font-bold text-white shadow-soft transition-all active:scale-95 disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          <span>{isSubmitting ? 'Salvando...' : 'Salvar Configurações'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Identificação do Estabelecimento & Preço Noturno */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[#EFE8DE] bg-white p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-[#2C221E] flex items-center gap-2 border-b border-[#EFE8DE] pb-2">
              <Building className="h-4 w-4 text-[#C87A5B]" />
              <span>Dados Operacionais do Bar</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Nome do Bar / Botequim *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: BeerGod ou Botequim do Zé"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Unidade / Filial Ativa
                </label>
                <input
                  type="text"
                  placeholder="Ex: Balcão Central ou Quiosque 04"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-[#70625B]" />
                  <span>Telefone Comercial do Bar</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: (11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3 text-[#5B8A62]" />
                  <span>WhatsApp da Distribuidora / Reposição</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: (11) 99999-8888 (Para onde a lista de compras é enviada)"
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2C221E] mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#70625B]" />
                  <span>Endereço Completo do Bar</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Rua dos Boêmios, 142 - Vila Madalena, São Paulo - SP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Configuração da Função Preço Noturno pós 00:00 */}
          <div className="rounded-2xl border border-[#EFE8DE] bg-white p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-2">
              <h3 className="text-sm font-bold text-[#2C221E] flex items-center gap-2">
                <Moon className="h-4 w-4 text-[#C87A5B]" />
                <span>Função Preço Noturno (Pós-Meia-Noite)</span>
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nightPricingEnabled}
                  onChange={(e) => setNightPricingEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-[#EFE8DE] text-[#C87A5B] focus:ring-[#C87A5B]"
                />
                <span className="text-xs font-bold text-[#2C221E]">
                  {nightPricingEnabled ? 'Ativado' : 'Desativado'}
                </span>
              </label>
            </div>

            <p className="text-xs text-[#70625B]">
              Ajuste dinâmico de preços para turnos da madrugada. O MeuBotequim destaca os valores noturnos automaticamente para os garçons e caixas após a meia-noite.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Início da Tarifa Noturna
                </label>
                <select
                  value={nightPricingStartHour}
                  onChange={(e) => setNightPricingStartHour(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3 py-2 text-xs text-[#2C221E] font-semibold focus:border-[#C87A5B] focus:bg-white focus:outline-none"
                >
                  <option value={23}>23:00</option>
                  <option value={0}>00:00 (Meia-noite)</option>
                  <option value={1}>01:00</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Término da Tarifa
                </label>
                <select
                  value={nightPricingEndHour}
                  onChange={(e) => setNightPricingEndHour(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3 py-2 text-xs text-[#2C221E] font-semibold focus:border-[#C87A5B] focus:bg-white focus:outline-none"
                >
                  <option value={5}>05:00</option>
                  <option value={6}>06:00 (Abertura matutina)</option>
                  <option value={7}>07:00</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Acréscimo Padrão Sugerido
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={nightPricingAutoMarkupPercent}
                    onChange={(e) => setNightPricingAutoMarkupPercent(Number(e.target.value))}
                    className="w-20 rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3 py-2 text-xs font-bold text-[#2C221E] text-center focus:border-[#C87A5B] focus:bg-white focus:outline-none"
                  />
                  <span className="text-xs font-bold text-[#70625B]">%</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[#FAF6F0] p-3 border border-[#EFE8DE] text-xs text-[#70625B]">
              <span className="font-bold text-[#2C221E]">💡 Impacto no Balcão:</span> Itens como Chopp 50L, Long Necks e Doses de Destilados receberão o preço noturno configurado, aumentando o ticket médio e a rentabilidade do bar no horário de maior demanda da noite.
            </div>
          </div>

          {/* Margens de Segurança de Estoque */}
          <div className="rounded-2xl border border-[#EFE8DE] bg-white p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-[#2C221E] flex items-center gap-2 border-b border-[#EFE8DE] pb-2">
              <ShieldCheck className="h-4 w-4 text-[#5B8A62]" />
              <span>Regras de Ponto de Pedido & Fim de Semana</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Margem de Segurança de Estoque (Dias)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={safetyMarginDays}
                    onChange={(e) => setSafetyMarginDays(Number(e.target.value))}
                    className="w-24 rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-3.5 py-2.5 text-xs font-bold text-[#2C221E] focus:border-[#C87A5B] focus:bg-white focus:outline-none transition-all text-center"
                  />
                  <span className="text-xs text-[#70625B]">
                    dias de estoque mínimo antes de alertar ruptura
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Turnos de Balanço Cego
                </label>
                <div className="flex items-center gap-2 text-xs text-[#70625B] mt-2">
                  <span className="rounded-lg bg-[#FAF6F0] border border-[#EFE8DE] px-2.5 py-1 font-semibold text-[#2C221E]">
                    Almoço (11h - 16h)
                  </span>
                  <span className="rounded-lg bg-[#FAF6F0] border border-[#EFE8DE] px-2.5 py-1 font-semibold text-[#2C221E]">
                    Noite / Pico (18h - 02h)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 3: Cores da Marca e Pré-visualização */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#EFE8DE] bg-white p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-[#2C221E] flex items-center gap-2 border-b border-[#EFE8DE] pb-2">
              <Palette className="h-4 w-4 text-[#C87A5B]" />
              <span>Cores da Marca</span>
            </h3>

            <p className="text-xs text-[#70625B]">
              Selecione o tom de destaque da identidade visual do seu estabelecimento:
            </p>

            <div className="space-y-2.5">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = primaryColor.toLowerCase() === preset.value.toLowerCase();
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setPrimaryColor(preset.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#2C221E] bg-[#FAF6F0] shadow-soft'
                        : 'border-[#EFE8DE] bg-white hover:bg-[#FAF6F0]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-6 w-6 rounded-lg shadow-sm border border-black/10 shrink-0"
                        style={{ backgroundColor: preset.value }}
                      />
                      <div>
                        <p className="text-xs font-bold text-[#2C221E] leading-tight">
                          {preset.name}
                        </p>
                        <p className="text-[10px] text-[#70625B]">{preset.desc}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-[#2C221E] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card de Visualização do Bar */}
          <div className="rounded-2xl border border-[#EFE8DE] bg-[#FAF6F0] p-5 shadow-soft space-y-3">
            <p className="text-[11px] font-bold text-[#70625B] uppercase tracking-wider">
              Pré-visualização do Cabeçalho
            </p>
            <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-[#EFE8DE]">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-black text-sm shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {name ? name.slice(0, 2).toUpperCase() : 'MB'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-[#2C221E] truncate">
                  {name || 'Nome do Seu Bar'}
                </p>
                <p className="text-[11px] font-medium text-[#70625B] truncate">
                  {branchName || 'Balcão Principal'}
                </p>
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                Ativo
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
