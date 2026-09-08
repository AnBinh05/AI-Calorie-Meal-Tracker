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
  color = 'var(--primary)',
  icon,
}) => {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>{title}</span>
        {icon && <span style={{ fontSize: '20px' }}>{icon}</span>}
      </div>

      <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
        {value}
      </div>

      {subtitle && (
        <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: progress !== undefined ? '14px' : '0' }}>
          {subtitle}
        </div>
      )}

      {progress !== undefined && (
        <div style={{
          height: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginTop: '10px'
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(Math.max(progress, 0), 100)}%`,
            backgroundColor: color,
            borderRadius: '3px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      )}
    </div>
  );
};
