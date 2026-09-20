import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(fullName, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg-app)',
      padding: 'var(--spacing-6)'
    }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: 'var(--spacing-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            marginBottom: 'var(--spacing-3)'
          }}>
            🥗
          </div>
          <h1 style={{ fontSize: 'var(--text-heading-1)', fontWeight: 'var(--font-weight-heading-1)', color: 'var(--color-text-primary)' }}>
            NutriAI Tracker
          </h1>
          <p style={{ fontSize: 'var(--text-body-regular)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {isLogin ? 'Đăng nhập vào Web Dashboard quản lý dinh dưỡng' : 'Đăng ký tài khoản theo dõi bữa ăn mới'}
          </p>
        </div>

        {error && (
          <div
            id="auth-form-error"
            role="alert"
            aria-live="polite"
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--color-status-danger)',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: 'var(--spacing-4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate={false}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="register-fullname" className="form-label">
                Họ và tên
              </label>
              <input
                id="register-fullname"
                type="text"
                className="form-input"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email" className="form-label">
              Email đăng nhập
            </label>
            <input
              id="auth-email"
              type="email"
              className="form-input"
              placeholder="nhap.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-describedby={error ? 'auth-form-error' : undefined}
              aria-invalid={!!error}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password" className="form-label">
              Mật khẩu
            </label>
            <input
              id="auth-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              aria-describedby={error ? 'auth-form-error' : undefined}
              aria-invalid={!!error}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '46px', marginTop: '10px' }}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>

        {/* Instant Demo Login Button */}
        <div style={{ marginTop: 'var(--spacing-4)' }}>
          <button
            type="button"
            onClick={async () => {
              await login('demo@nutriai.vn', 'demo123');
            }}
            className="btn btn-outline"
            style={{
              width: '100%',
              height: '42px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: 'var(--color-brand-tint)',
              color: 'var(--color-brand-primary)',
              borderColor: 'var(--color-brand-primary)',
            }}
            aria-label="Đăng nhập nhanh với tài khoản Demo trải nghiệm tính năng"
          >
            <Sparkles size={16} aria-hidden="true" />
            <span>⚡ Dùng thử ngay (Tài khoản Demo)</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-6)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--color-brand-primary)', fontWeight: '700', cursor: 'pointer' }}
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};
