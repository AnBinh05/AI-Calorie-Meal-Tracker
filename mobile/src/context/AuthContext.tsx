import React, { createContext, useContext, useState, useEffect } from 'react';
import { authStorage } from '../services/authStorage';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (fullName: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    try {
      const token = await authStorage.getToken();
      if (token) {
        const res = await api.getMe();
        if (res.success && res.data) {
          setUser(res.data);
          await authStorage.setUser(res.data);
        }
      }
    } catch (e) {
      console.warn('Phiên đăng nhập hết hạn hoặc chưa đăng nhập');
      await authStorage.clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    if (res.success && res.data) {
      await authStorage.setToken(res.data.token);
      await authStorage.setUser(res.data.user);
      setUser(res.data.user);
    } else {
      throw new Error(res.message || 'Đăng nhập thất bại');
    }
  };

  const register = async (fullName: string, email: string, pass: string) => {
    const res = await api.register({ fullName, email, password: pass });
    if (res.success && res.data) {
      await authStorage.setToken(res.data.token);
      await authStorage.setUser(res.data.user);
      setUser(res.data.user);
    } else {
      throw new Error(res.message || 'Đăng ký thất bại');
    }
  };

  const logout = async () => {
    await authStorage.clearAuth();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        await authStorage.setUser(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
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
