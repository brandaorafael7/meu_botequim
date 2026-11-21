import React, { useEffect } from 'react';

const DEFAULT_BLIP_APP_KEY =
  'bWV1Ym90ZXF1aW1ib3Q6NTRjOWEwMmQtMTI3NS00ZDU1LTkzNDQtY2I5ODUyMzAxYWI5';
const DEFAULT_BLIP_CUSTOM_COMMON_URL =
  'https://rafael-brandao-lkdf1.chat.blip.ai/';

export interface BlipChatAccountConfig {
  userIdentity?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  extras?: Record<string, string | undefined>;
}

export interface BlipChatBuilder {
  withAppKey: (appKey: string) => BlipChatBuilder;
  withButton: (config: { color: string; icon?: string }) => BlipChatBuilder;
  withCustomCommonUrl: (url: string) => BlipChatBuilder;
  withAccount: (account: BlipChatAccountConfig) => BlipChatBuilder;
  withCustomMessageMetadata?: (
    metadata: Record<string, string | undefined>,
  ) => BlipChatBuilder;
  build: () => void;
  toogleChat?: () => void;
  destroy?: () => void;
}

declare global {
  interface Window {
    BlipChat?: new () => BlipChatBuilder;
    __blipChatClient?: BlipChatBuilder | null;
  }
}

/**
 * Abre ou alterna a janela do widget flutuante oficial do Blip Chat
 */
export function openBlipChatWidget(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  if (
    window.__blipChatClient &&
    typeof window.__blipChatClient.toogleChat === 'function'
  ) {
    window.__blipChatClient.toogleChat();
    return true;
  }

  const openBtn = document.getElementById('blip-chat-open-iframe');
  if (openBtn) {
    openBtn.click();
    return true;
  }

  return false;
}

export interface BlipChatWidgetProps {
  /**
   * Identificador do estabelecimento (tenantId) ativo para contextualizar o atendimento no Blip
   */
  establishmentId?: string;
  /**
   * Cor do botão flutuante do Blip Chat (padrão compatível com o tema MeuBotequim / Âmbar #D97706)
   */
  buttonColor?: string;
}

export const BlipChatWidget: React.FC<BlipChatWidgetProps> = ({
  buttonColor = '#0096fa',
}) => {
  useEffect(() => {
    const appKey =
      (import.meta.env.VITE_BLIP_APP_KEY as string | undefined) ||
      DEFAULT_BLIP_APP_KEY;
    const customCommonUrl =
      (import.meta.env.VITE_BLIP_CUSTOM_COMMON_URL as string | undefined) ||
      DEFAULT_BLIP_CUSTOM_COMMON_URL;

    if (!appKey || typeof window === 'undefined') {
      return;
    }

    const ensureBlipChat = () => {
      if (!window.BlipChat) {
        return;
      }

      // Se o script oficial do index.html já instanciou o widget (#blip-chat-container), mantém a instância ativa
      if (
        window.__blipChatClient ||
        document.getElementById('blip-chat-container')
      ) {
        return;
      }

      const blipClient = new window.BlipChat()
        .withAppKey(appKey)
        .withButton({ color: buttonColor, icon: '' })
        .withCustomCommonUrl(customCommonUrl);

      blipClient.build();
      window.__blipChatClient = blipClient;
    };

    if (document.readyState === 'complete') {
      ensureBlipChat();
    } else {
      window.addEventListener('load', ensureBlipChat);
      return () => window.removeEventListener('load', ensureBlipChat);
    }
  }, [buttonColor]);

  return null;
};

export default BlipChatWidget;
