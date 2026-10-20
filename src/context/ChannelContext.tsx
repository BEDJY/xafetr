import React, { createContext, useContext, useEffect, useState } from 'react';
import { VendureClient } from '../services/vendureClient';

export interface ChannelAppearance {
  displayName?: string;
  tagline?: string;
  brandColor?: string;
  themeMode?: string;
  accentGradient?: string;
}

export interface ChannelItem {
  id: string;
  code: string;
  token: string;
  defaultCurrencyCode?: string;
  customFields?: ChannelAppearance;
}

interface ChannelContextType {
  channels: ChannelItem[];
  activeChannel: ChannelItem | null;
  setActiveChannel: (channel: ChannelItem) => void;
  clearActiveChannel: () => void;
  refreshChannels: (tokenOverride?: string) => Promise<ChannelItem[]>;
  updateChannelAppearance: (appearance: ChannelAppearance) => Promise<void>;
  isLoading: boolean;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

const CHANNELS_QUERY = `
  query GetChannels {
    channels {
      items {
        id
        code
        token
        defaultCurrencyCode
        customFields {
          displayName
          tagline
          brandColor
          themeMode
          accentGradient
        }
      }
    }
  }
`;

const UPDATE_CHANNEL_MUTATION = `
  mutation UpdateChannelAppearance($input: UpdateChannelInput!) {
    updateChannel(input: $input) {
      id
      code
      token
      customFields {
        displayName
        tagline
        brandColor
        themeMode
        accentGradient
      }
    }
  }
`;

export const ChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useState<ChannelItem[]>([]);
  const [activeChannel, setActiveChannelState] = useState<ChannelItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshChannels = async (tokenOverride?: string): Promise<ChannelItem[]> => {
    if (!VendureClient.getAuthToken()) {
      setIsLoading(false);
      return [];
    }
    setIsLoading(true);
    try {
      const activeToken = tokenOverride || VendureClient.getActiveChannelToken();
      const customHeaders: Record<string, string> = activeToken ? { 'vendure-token': activeToken } : {};
      const data = await VendureClient.request<{ channels?: { items: ChannelItem[] } }>(
        CHANNELS_QUERY,
        {},
        customHeaders
      );
      const list = data?.channels?.items || [];
      setChannels(list);

      // Restaurar canal activo previo si y solo si fue guardado en localStorage
      const savedToken = VendureClient.getActiveChannelToken();
      if (savedToken) {
        const current = list.find((c) => c.token === savedToken);
        if (current) {
          setActiveChannelState(current);
        }
      }
      return list;
    } catch (err) {
      console.warn('No se pudieron cargar los canales de Vendure:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const clearActiveChannel = () => {
    setActiveChannelState(null);
    VendureClient.removeActiveChannelToken();
  };

  const setActiveChannel = (channel: ChannelItem) => {
    setActiveChannelState(channel);
    VendureClient.setActiveChannelToken(channel.token);
    // Disparar evento para recargar datos del canal
    window.dispatchEvent(new CustomEvent('channel-changed', { detail: channel }));
  };

  const updateChannelAppearance = async (appearance: ChannelAppearance) => {
    if (!activeChannel) return;
    try {
      const res = await VendureClient.request<{ updateChannel: ChannelItem }>(
        UPDATE_CHANNEL_MUTATION,
        {
          input: {
            id: activeChannel.id,
            customFields: appearance,
          },
        }
      );
      if (res?.updateChannel) {
        setActiveChannelState(res.updateChannel);
        setChannels(prev =>
          prev.map(c => (c.id === res.updateChannel.id ? res.updateChannel : c))
        );
      }
    } catch (err) {
      console.error('Error al actualizar apariencia del canal:', err);
      throw err;
    }
  };

  useEffect(() => {
    refreshChannels();
    const handleAuth = () => {
      refreshChannels();
    };
    window.addEventListener('auth-changed', handleAuth);
    return () => {
      window.removeEventListener('auth-changed', handleAuth);
    };
  }, []);

  return (
    <ChannelContext.Provider
      value={{
        channels,
        activeChannel,
        setActiveChannel,
        clearActiveChannel,
        refreshChannels,
        updateChannelAppearance,
        isLoading,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannel = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error('useChannel debe usarse dentro de un ChannelProvider');
  }
  return context;
};
