import React, { useState } from 'react';
import {
  Store,
  ChevronDown,
  Bell,
  LogOut,
  Sparkles,
  PlusCircle,
  LogIn,
  CheckCircle2,
} from 'lucide-react';
import type { BarProfile, ReplenishmentProduct } from '../../types';
import { NotificationsPopover } from './NotificationsPopover';

interface HeaderProps {
  profile: BarProfile;
  products?: ReplenishmentProduct[];
  criticalAlertCount?: number;
  addedProductIds?: Set<string>;
  onAddToShoppingList?: (product: ReplenishmentProduct) => void;
  onEditPrice?: (product: ReplenishmentProduct) => void;
  onOpenNotifications?: () => void;
  onSelectBranch?: (branch: string) => void;
  availableBranches?: string[];
  isAuthenticated?: boolean;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onLogout?: () => void;
  onNavigateToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  products = [],
  criticalAlertCount = 0,
  addedProductIds = new Set(),
  onAddToShoppingList,
  onEditPrice,
  onOpenNotifications,
  onSelectBranch,
  availableBranches = [
    'Boteco Central - Salão & Balcão',
    'Unidade Praia - Quiosque 04',
    'Unidade Rooftop - Lounge',
  ],
  isAuthenticated = false,
  onOpenAuthModal,
  onLogout,
  onNavigateToLanding,
}) => {
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EFE8DE] bg-[#FFFFFF]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Lado Esquerdo: Logotipo MeuBotequim */}
        <div
          className={`flex items-center gap-3 ${onNavigateToLanding ? 'cursor-pointer' : ''}`}
          onClick={onNavigateToLanding}
          title={onNavigateToLanding ? 'Voltar para a Página Inicial' : undefined}
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[#EFE8DE] bg-[#F4EDE4] shadow-soft transition-transform hover:scale-105">
            <img
              src="/logo.png"
              alt="MeuBotequim Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[#2C221E]">
                Meu<span className="text-[#C87A5B]">Botequim</span>
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-[#FAF6F0] px-2 py-0.5 text-[10px] font-semibold text-[#70625B] border border-[#EFE8DE]">
                v2.4
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-[#70625B] sm:block">
              Gestão de Estoque & Balcão
            </p>
          </div>
        </div>

        {/* Lado Direito: Identificação do Bar Atual & Avatar do Usuário */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Seletor do Bar Atual */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setBranchDropdownOpen(!branchDropdownOpen);
                setProfileDropdownOpen(false);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] px-2.5 py-1.5 text-xs font-semibold text-[#2C221E] transition-colors hover:bg-[#EFE8DE]/60 focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 sm:px-3 sm:py-2"
            >
              <Store className="h-4 w-4 text-[#C87A5B]" />
              <div className="text-left">
                <span className="hidden text-[10px] font-normal uppercase tracking-wider text-[#70625B] md:block">
                  Bar Selecionado
                </span>
                <span className="max-w-[130px] truncate sm:max-w-[180px] md:max-w-[220px] block">
                  {profile.branch}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#70625B]" />
            </button>

            {/* Dropdown de Filiais */}
            {branchDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#EFE8DE] bg-[#FFFFFF] p-1.5 shadow-soft-lg z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#70625B]">
                  Alternar Estabelecimento
                </div>
                {availableBranches.map((branch) => (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => {
                      onSelectBranch?.(branch);
                      setBranchDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      branch === profile.branch
                        ? 'bg-[#FAF6F0] font-semibold text-[#C87A5B]'
                        : 'text-[#2C221E] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <span className="truncate">{branch}</span>
                    {branch === profile.branch && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#C87A5B] shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sino de Notificações / Alertas Críticos */}
          <div className="relative">
            <button
              id="notifications-button"
              type="button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setBranchDropdownOpen(false);
                setProfileDropdownOpen(false);
                onOpenNotifications?.();
              }}
              aria-expanded={notificationsOpen}
              aria-haspopup="dialog"
              aria-controls="notifications-popover"
              aria-label={
                criticalAlertCount > 0
                  ? `Notificações: ${criticalAlertCount} produtos em nível crítico`
                  : 'Notificações de estoque'
              }
              className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                notificationsOpen
                  ? 'border-[#C87A5B] bg-[#C87A5B]/15 text-[#C87A5B] ring-2 ring-[#C87A5B]/20 shadow-soft'
                  : 'border-[#EFE8DE] bg-[#FAF6F0] text-[#70625B] hover:bg-[#EFE8DE]/60 hover:text-[#2C221E]'
              }`}
            >
              <Bell className={`h-4 w-4 ${criticalAlertCount > 0 ? 'text-[#C24E48]' : ''}`} />
              {criticalAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C24E48] px-1 text-[10px] font-bold text-white shadow-soft animate-pulse">
                  {criticalAlertCount}
                </span>
              )}
            </button>

            <NotificationsPopover
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
              products={products}
              addedProductIds={addedProductIds}
              onAddToShoppingList={onAddToShoppingList}
              onEditPrice={onEditPrice}
              onViewAllInTable={() => {
                setNotificationsOpen(false);
                const tableElem = document.querySelector(
                  'section[aria-label="Reposição Imediata"]'
                );
                tableElem?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>

          {/* Divisória Vertical Sutil */}
          <div className="h-6 w-px bg-[#EFE8DE]" />

          {/* Botão Rápido de Login / Cadastro se não autenticado */}
          {!isAuthenticated && (
            <button
              type="button"
              onClick={() => onOpenAuthModal?.('login')}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#C87A5B]/30 bg-[#C87A5B]/10 px-3 py-1.5 text-xs font-bold text-[#C87A5B] hover:bg-[#C87A5B] hover:text-white transition-all shadow-soft"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Acessar / Criar Bar</span>
            </button>
          )}

          {/* Indicador de Perfil / Avatar */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setBranchDropdownOpen(false);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-xl p-1 transition-colors hover:bg-[#FAF6F0] focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#DDA76A]/30 text-xs font-bold text-[#2C221E] ring-2 ring-[#EFE8DE]">
                {profile.user.avatar ? (
                  <img
                    src={profile.user.avatar}
                    alt={profile.user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  profile.user.initials
                )}
                {/* Ponto de status online (Verde Sálvia) */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5B8A62]" />
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-xs font-bold leading-tight text-[#2C221E]">
                  {profile.user.name}
                </p>
                <p className="text-[11px] font-medium leading-tight text-[#70625B]">
                  {profile.user.role}
                </p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-[#70625B] sm:block" />
            </button>

            {/* Menu Dropdown do Perfil */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl border border-[#EFE8DE] bg-[#FFFFFF] p-2 shadow-soft-lg z-50 animate-in fade-in slide-in-from-top-1">
                <div className="border-b border-[#EFE8DE] px-3 py-2 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#2C221E]">{profile.user.name}</p>
                    <span className="rounded-full bg-[#C87A5B]/15 px-2 py-0.5 text-[9px] font-bold text-[#C87A5B]">
                      {profile.user.roleCode || profile.user.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#70625B]">{profile.branch}</p>
                  <p className="mt-1 text-[10px] text-[#5B8A62] font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5B8A62]" />
                    {isAuthenticated ? 'Sessão SaaS Conectada' : 'Modo Demonstração'}
                  </p>
                </div>
                <div className="py-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAuthModal?.('register');
                      setProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#2C221E] hover:bg-[#FAF6F0] text-left transition-colors"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-[#C87A5B]" />
                    <span>Cadastrar Novo Bar (SaaS)</span>
                  </button>

                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => {
                        onLogout?.();
                        setProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#C24E48] hover:bg-[#C24E48]/10 text-left font-semibold transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sair da Conta</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenAuthModal?.('login');
                        setProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#2C221E] hover:bg-[#FAF6F0] text-left font-semibold transition-colors"
                    >
                      <LogIn className="h-3.5 w-3.5 text-[#5B8A62]" />
                      <span>Acessar com E-mail</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
