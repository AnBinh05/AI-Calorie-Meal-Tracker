import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-main)',
      padding: '24px'
    }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            marginBottom: '12px'
          }}>
            🥗
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '900' }}>AI Calorie Tracker</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isLogin ? 'Đăng nhập vào Web Dashboard quản lý' : 'Đăng ký tài khoản theo dõi dinh dưỡng mới'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: 'var(--accent-pink)',
            fontSize: '13px',
            marginBottom: '18px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="nhap.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>

        {/* Instant Demo Login Button */}
        <div style={{ marginTop: '16px' }}>
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
          >
            ⚡ Dùng thử ngay (Tài khoản Demo)
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
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
