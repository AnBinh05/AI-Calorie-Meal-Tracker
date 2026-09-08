import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  loading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, loading = false }) => {
  const todayFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(11, 17, 32, 0.6)',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
        <Calendar size={16} color="var(--primary)" />
        <span style={{ textTransform: 'capitalize' }}>{todayFormatted}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="btn btn-outline"
            style={{ padding: '8px 14px', fontSize: '13px' }}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Làm mới dữ liệu
          </button>
        )}

        <div style={{
          padding: '6px 12px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: 'var(--primary)',
          fontWeight: '600'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
          Gemini Vision Ready
        </div>
      </div>
    </header>
  );
};
