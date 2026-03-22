import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { meRequest, type AuthUser } from '../services/auth/authApi';

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredToken(): string | null {
  return localStorage.getItem('authToken');
}

function getStoredUser(): AuthUser | null {
  const rawUser = localStorage.getItem('authUser');
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  const setSession = (nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem('authToken', nextToken);
    localStorage.setItem('authUser', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const refreshSession = async () => {
    const storedToken = getStoredToken();

    if (!storedToken) {
      logout();
      return;
    }

    try {
      const response = await meRequest(storedToken);
      const payload = response.data;

      const normalizedUser: AuthUser = {
        id: Number(payload.sub) || undefined,
        email: payload.email || user?.email || '',
        role: payload.role || user?.role || 'cliente',
      };

      setSession(storedToken, normalizedUser);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    (async () => {
      await refreshSession();
      setIsBootstrapping(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isBootstrapping,
    setSession,
    logout,
    refreshSession,
  }), [user, token, isBootstrapping]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
