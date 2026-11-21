import React, { useEffect } from 'react';

const BLIP_CHAT_SCRIPT_ID = 'blip-chat-widget-script';
const BLIP_CHAT_SCRIPT_SRC =
  'https://unpkg.com/blip-chat-widget@1.11.4/dist/blip-chat.js';
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
  build: () => void;
  destroy?: () => void;
}

declare global {
  interface Window {
    BlipChat?: new () => BlipChatBuilder;
  }
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
  establishmentId,
  buttonColor = '#D97706',
}) => {
  useEffect(() => {
    const appKey =
      (import.meta.env.VITE_BLIP_APP_KEY as string | undefined) ||
      DEFAULT_BLIP_APP_KEY;
    const customCommonUrl =
      (import.meta.env.VITE_BLIP_CUSTOM_COMMON_URL as string | undefined) ||
      DEFAULT_BLIP_CUSTOM_COMMON_URL;

    if (!appKey) {
      return;
    }

    let blipClient: BlipChatBuilder | null = null;

    const initBlipChat = () => {
      if (typeof window === 'undefined' || !window.BlipChat) {
        return;
      }

      // Evita duplicação do container caso já exista antes de re-instanciar
      const existingContainer = document.getElementById('blip-chat-container');
      if (existingContainer) {
        existingContainer.remove();
      }

      blipClient = new window.BlipChat()
        .withAppKey(appKey)
        .withButton({ color: buttonColor, icon: '' })
        .withCustomCommonUrl(customCommonUrl)
        .withAccount({
          extras: {
            establishmentId: establishmentId || 'demo',
          },
        });

      blipClient.build();
    };

    const existingScript = document.getElementById(
      BLIP_CHAT_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.BlipChat) {
        initBlipChat();
      } else {
        existingScript.addEventListener('load', initBlipChat);
      }
    } else {
      const script = document.createElement('script');
      script.id = BLIP_CHAT_SCRIPT_ID;
      script.src = BLIP_CHAT_SCRIPT_SRC;
      script.async = true;
      script.onload = initBlipChat;
      document.body.appendChild(script);
    }

    return () => {
      const scriptEl = document.getElementById(BLIP_CHAT_SCRIPT_ID);
      if (scriptEl) {
        scriptEl.removeEventListener('load', initBlipChat);
      }

      if (blipClient && typeof blipClient.destroy === 'function') {
        try {
          blipClient.destroy();
        } catch {
          // Ignora erros internos do widget ao destruir
        }
      }

      const container = document.getElementById('blip-chat-container');
      if (container) {
        container.remove();
      }
    };
  }, [establishmentId, buttonColor]);

  return null;
};

export default BlipChatWidget;
