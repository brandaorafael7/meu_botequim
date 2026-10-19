import React, { useState } from 'react';
import {
  X,
  Store,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { authService, getErrorMessage } from '../../services/api';
import type { AuthSession } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: AuthSession) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Campos de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Campos de Cadastro SaaS
  const [establishmentName, setEstablishmentName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const session = await authService.login(loginEmail, loginPassword);
      onSuccess(session);
      onClose();
    } catch (err) {
      setErrorMessage(getErrorMessage(err, 'Falha ao autenticar. Verifique e-mail e senha.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (registerPassword.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const session = await authService.registerEstablishment({
        establishmentName,
        name: ownerName,
        email: registerEmail,
        password: registerPassword,
        phone: registerPhone || undefined,
      });
      onSuccess(session);
      onClose();
    } catch (err) {
      setErrorMessage(getErrorMessage(err, 'Falha ao cadastrar bar. Verifique os dados.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C221E]/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-[#EFE8DE] bg-[#FFFFFF] p-6 shadow-2xl sm:p-8">
        {/* Botão de Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-2 text-[#70625B] hover:bg-[#FAF6F0] hover:text-[#2C221E] transition-colors"
          aria-label="Fechar modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Topo / Logotipo e Título */}
        <div className="flex items-center gap-3 border-b border-[#EFE8DE] pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C87A5B]/10 text-[#C87A5B]">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#2C221E] tracking-tight sm:text-2xl">
              Meu<span className="text-[#C87A5B]">Botequim</span>{' '}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#5B8A62]/15 text-[#5B8A62] border border-[#5B8A62]/30 align-middle">
                SaaS
              </span>
            </h2>
            <p className="text-xs text-[#70625B]">
              {mode === 'login'
                ? 'Acesse a gestão do seu estabelecimento'
                : 'Cadastre seu bar e comece a operar hoje'}
            </p>
          </div>
        </div>

        {/* Abas Alternadoras (Login vs Cadastro) */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-[#FAF6F0] p-1 border border-[#EFE8DE]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-[#FFFFFF] text-[#2C221E] shadow-soft'
                : 'text-[#70625B] hover:text-[#2C221E]'
            }`}
          >
            Acessar Conta
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-[#C87A5B] text-white shadow-soft'
                : 'text-[#70625B] hover:text-[#2C221E]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Cadastrar Meu Bar</span>
          </button>
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className="mt-4 rounded-xl border border-[#C24E48]/30 bg-[#C24E48]/10 p-3 text-xs font-medium text-[#C24E48] animate-in fade-in">
            {errorMessage}
          </div>
        )}

        {/* Formulário: Login */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2C221E] mb-1">
                E-mail de Acesso
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#70625B]" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="gerente@meubotequim.com.br"
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] pl-10 pr-4 py-2.5 text-xs text-[#2C221E] placeholder-[#70625B]/60 focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C221E] mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#70625B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] pl-10 pr-10 py-2.5 text-xs text-[#2C221E] placeholder-[#70625B]/60 focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-[#70625B] hover:text-[#2C221E]"
                  aria-label="Ver senha"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C221E] py-3 text-xs font-bold text-white shadow-soft hover:bg-[#3D302A] focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/40 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar no MeuBotequim</span>
              )}
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-[#70625B]">Ainda não tem conta no seu bar? </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[11px] font-bold text-[#C87A5B] hover:underline"
              >
                Cadastre agora
              </button>
            </div>
          </form>
        )}

        {/* Formulário: Cadastro SaaS */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#2C221E] mb-1">
                Nome do Bar / Restaurante
              </label>
              <div className="relative">
                <Store className="absolute left-3.5 top-3 h-4 w-4 text-[#70625B]" />
                <input
                  type="text"
                  required
                  value={establishmentName}
                  onChange={(e) => setEstablishmentName(e.target.value)}
                  placeholder="Ex: Boteco da Esquina, Cervejaria Central"
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] pl-10 pr-4 py-2.5 text-xs text-[#2C221E] placeholder-[#70625B]/60 focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  Seu Nome
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-[#70625B]" />
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Carlos Drummond"
                    className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] pl-10 pr-4 py-2.5 text-xs text-[#2C221E] placeholder-[#70625B]/60 focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C221E] mb-1">
                  WhatsApp / Celular
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-[#70625B]" />
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] pl-10 pr-4 py-2.5 text-xs text-[#2C221E] placeholder-[#70625B]/60 focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C221E] mb-1">
                E-mail Comercial
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#70625B]" />
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="contato@botecodaesquina.com.br"
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] pl-10 pr-4 py-2.5 text-xs text-[#2C221E] placeholder-[#70625B]/60 focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C221E] mb-1">
                Crie uma Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#70625B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full rounded-xl border border-[#EFE8DE] bg-[#FAF6F0] pl-10 pr-10 py-2.5 text-xs text-[#2C221E] placeholder-[#70625B]/60 focus:border-[#C87A5B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-[#70625B] hover:text-[#2C221E]"
                  aria-label="Ver senha"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Benefícios inclusos */}
            <div className="rounded-xl bg-[#5B8A62]/10 border border-[#5B8A62]/20 p-2.5 text-[11px] text-[#5B8A62] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Plano Trial 14 dias sem compromisso</span>
              </div>
              <p className="text-[10px] text-[#70625B]">
                Inclui gestão de estoque de balcão, alertas de reposição, registro de perdas e relatórios em tempo real.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C87A5B] py-3 text-xs font-bold text-white shadow-soft hover:bg-[#B3684B] focus:outline-none focus:ring-2 focus:ring-[#C87A5B]/40 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Cadastrando bar e gerando acesso...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Criar Meu Bar & Começar</span>
                </>
              )}
            </button>

            <div className="pt-1 text-center">
              <span className="text-[11px] text-[#70625B]">Já possui cadastro? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[11px] font-bold text-[#2C221E] hover:underline"
              >
                Faça login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
