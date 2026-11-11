import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'var(--color-border-default)' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: 'Yếu', color: 'var(--color-status-danger)' };
  if (score === 2) return { score: 2, label: 'Trung bình', color: 'var(--color-status-warning)' };
  if (score === 3) return { score: 3, label: 'Khỏe', color: 'var(--color-macro-protein)' };
  return { score: 4, label: 'Rất mạnh', color: 'var(--color-status-success)' };
}

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

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

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login('demo@nutriai.vn', '123456');
    } catch (err: any) {
      setError(err.message || 'Không thể đăng nhập tài khoản Demo');
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
            <div style={{ position: 'relative' }}>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingRight: '42px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                aria-describedby={error ? 'auth-form-error' : !isLogin ? 'password-strength-hint' : undefined}
                aria-invalid={!!error}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              </button>
            </div>

            {!isLogin && (
              <div id="password-strength-hint" style={{ marginTop: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      style={{
                        height: '4px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: passwordStrength.score >= level ? passwordStrength.color : 'var(--color-border-default)',
                        transition: 'background-color 150ms ease-out',
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  <span>Tối thiểu 6 ký tự</span>
                  {password && (
                    <span style={{ fontWeight: 700, color: passwordStrength.color }}>
                      Độ mạnh: {passwordStrength.label}
                    </span>
                  )}
                </div>
              </div>
            )}
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
            disabled={loading}
            onClick={handleDemoLogin}
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
