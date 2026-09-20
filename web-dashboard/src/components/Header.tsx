import React from 'react';
import { Calendar, RefreshCw, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

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
      height: 'var(--header-height-desktop)',
      borderBottom: '1px solid var(--color-border-default)',
      padding: '0 var(--spacing-8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'var(--color-bg-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)' as any,
      transition: 'background-color 0.2s ease-out, border-color 0.2s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-body-regular)' }}>
        <Calendar size={18} color="var(--color-brand-primary)" />
        <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{todayFormatted}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        <ThemeToggle />

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="btn btn-outline"
            style={{ padding: '8px 14px', fontSize: '13px' }}
            disabled={loading}
            type="button"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Làm mới dữ liệu
          </button>
        )}

        <div style={{
          padding: '6px 12px',
          backgroundColor: 'var(--color-brand-tint)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-brand-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: 'var(--color-brand-primary)',
          fontWeight: '600'
        }}>
          <Sparkles size={14} color="var(--color-brand-primary)" />
          Gemini Vision Ready
        </div>
      </div>
    </header>
  );
};
