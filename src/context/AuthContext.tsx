import React, { createContext, useContext, useEffect, useState } from 'react';
import { VendureClient } from '../services/vendureClient';

export interface AdminUser {
  id: string;
  identifier: string;
  channels: Array<{
    id: string;
    code: string;
    token: string;
    permissions: string[];
  }>;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, channelToken?: string) => Promise<AdminUser>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOGIN_MUTATION = `
  mutation AdminLogin($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      __typename
      ... on CurrentUser {
        id
        identifier
        channels {
          id
          code
          token
          permissions
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

const ME_QUERY = `
  query GetCurrentUser {
    me {
      id
      identifier
      channels {
        id
        code
        token
        permissions
      }
    }
  }
`;

const LOGOUT_MUTATION = `
  mutation AdminLogout {
    logout {
      success
    }
  }
`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = VendureClient.getAuthToken();
      if (token) {
        const data = await VendureClient.request<{ me: AdminUser | null }>(ME_QUERY);
        if (data?.me) {
          setUser(data.me);
          setIsLoading(false);
          return;
        }
      }
      setUser(null);
    } catch {
      // Token anterior expirado o inválido
      VendureClient.removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string, channelToken?: string): Promise<AdminUser> => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = channelToken ? { 'vendure-token': channelToken } : {};
      const res = await VendureClient.request<{ login: any }>(
        LOGIN_MUTATION,
        { username, password },
        headers
      );

      if (res.login.__typename === 'CurrentUser') {
        const currentUser = res.login as AdminUser;
        VendureClient.removeActiveChannelToken(); // Limpiar selección previa para forzar la selección de proyecto
        setUser(currentUser);
        window.dispatchEvent(new CustomEvent('auth-changed'));
        return currentUser;
      } else {
        throw new Error(res.login.message || 'Credenciales inválidas o acceso no autorizado');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await VendureClient.request(LOGOUT_MUTATION);
    } catch (err) {
      console.warn('Error durante logout:', err);
    } finally {
      VendureClient.removeAuthToken();
      VendureClient.removeActiveChannelToken();
      setUser(null);
      window.dispatchEvent(new CustomEvent('auth-changed'));
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
