import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (fullName: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('ai_calorie_token');
    if (token) {
      try {
        const res = await api.getMe();
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (e) {
        localStorage.removeItem('ai_calorie_token');
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    if (res.success && res.data) {
      localStorage.setItem('ai_calorie_token', res.data.token);
      setUser(res.data.user);
    } else {
      throw new Error(res.message || 'Đăng nhập thất bại');
    }
  };

  const register = async (fullName: string, email: string, pass: string) => {
    const res = await api.register({ fullName, email, password: pass });
    if (res.success && res.data) {
      localStorage.setItem('ai_calorie_token', res.data.token);
      setUser(res.data.user);
    } else {
      throw new Error(res.message || 'Đăng ký thất bại');
    }
  };

  const logout = () => {
    localStorage.removeItem('ai_calorie_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data);
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
