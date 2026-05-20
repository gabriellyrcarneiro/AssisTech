import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { apiRequest } from '../api/client';
import type { Role, User } from '../types';

type LoginResponse = {
  token: string;
  user: User;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  can: (...roles: Role[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const savedUser = localStorage.getItem('assistech:user');
      const token = localStorage.getItem('assistech:token');

      if (!savedUser || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest<{ user: User }>('/auth/me');
        setUser(response.user);
        localStorage.setItem('assistech:user', JSON.stringify(response.user));
      } catch {
        localStorage.removeItem('assistech:token');
        localStorage.removeItem('assistech:user');
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  async function login(email: string, password: string) {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('assistech:token', response.token);
    localStorage.setItem('assistech:user', JSON.stringify(response.user));
    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem('assistech:token');
    localStorage.removeItem('assistech:user');
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      can: (...roles: Role[]) => Boolean(user && roles.includes(user.role)),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
