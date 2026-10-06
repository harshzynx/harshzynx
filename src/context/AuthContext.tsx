import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getAdminToken } from '../lib/api.ts';

interface AdminInfo {
  id: string;
  email: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  admin: AdminInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  changePassword: (cur: string, next: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }
    try {
      const user = await api.checkAuth();
      setAdmin(user);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setAdmin(res.admin);
  };

  const logout = () => {
    api.logout();
    setAdmin(null);
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    await api.changePassword(currentPass, newPass);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
        changePassword,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
