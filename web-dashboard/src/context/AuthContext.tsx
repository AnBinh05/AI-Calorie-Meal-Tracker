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
    const handleUnauthorized = () => {
      localStorage.removeItem('ai_calorie_token');
      setUser(null);
    };
    window.addEventListener('nutriai:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('nutriai:unauthorized', handleUnauthorized);
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('ai_calorie_token');
    if (token === 'mock_jwt_token_demo_nutriai') {
      loginDemo();
      setIsLoading(false);
      return;
    }
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
    try {
      const res = await api.login({ email, password: pass });
      if (res.success && res.data) {
        localStorage.setItem('ai_calorie_token', res.data.token);
        setUser(res.data.user);
        return;
      }
      throw new Error(res.message || 'Đăng nhập thất bại');
    } catch (err: any) {
      const isNetworkError = !err?.response;
      // Chỉ dùng chế độ Demo Offline nếu backend không phản hồi khi bấm nút Dùng thử Demo
      if (isNetworkError && email.trim().toLowerCase() === 'demo@nutriai.vn') {
        loginDemo();
        return;
      }
      const serverMsg = err?.response?.data?.message || err?.message;
      throw new Error(
        serverMsg || 'Không thể kết nối đến máy chủ. Bạn có thể chọn "Dùng thử tài khoản Demo" để trải nghiệm offline.'
      );
    }
  };

  const loginDemo = () => {
    const demoUser: User = {
      id: 1,
      email: 'demo@nutriai.vn',
      fullName: 'Nguyễn Văn Demo',
      role: 'ROLE_USER',
      hasHealthProfile: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('ai_calorie_token', 'mock_jwt_token_demo_nutriai');
    setUser(demoUser);
  };

  const register = async (fullName: string, email: string, pass: string) => {
    try {
      const res = await api.register({ fullName, email, password: pass });
      if (res.success && res.data) {
        localStorage.setItem('ai_calorie_token', res.data.token);
        setUser(res.data.user);
        return;
      }
      throw new Error(res.message || 'Đăng ký tài khoản thất bại');
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message || err?.message;
      throw new Error(serverMsg || 'Không thể đăng ký tài khoản. Vui lòng kiểm tra lại thông tin.');
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
