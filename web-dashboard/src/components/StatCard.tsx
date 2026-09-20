import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  color?: string;
  icon?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  progress,
  color = 'var(--color-brand-primary)',
  icon,
}) => {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>{title}</span>
        {icon && <span style={{ fontSize: '20px' }} aria-hidden="true">{icon}</span>}
      </div>

      <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
        {value}
      </div>

      {subtitle && (
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: progress !== undefined ? '14px' : '0' }}>
          {subtitle}
        </div>
      )}

      {progress !== undefined && (
        <div
          role="progressbar"
          aria-valuenow={Math.round(Math.min(Math.max(progress, 0), 100))}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title} progress`}
          style={{
            height: '6px',
            backgroundColor: 'var(--color-bg-surface-subtle)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginTop: '10px'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
              backgroundColor: color,
              borderRadius: 'var(--radius-full)',
              transition: 'width 200ms ease'
            }}
          />
        </div>
      )}
    </div>
  );
};
