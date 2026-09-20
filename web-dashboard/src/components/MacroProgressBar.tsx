import React from 'react';

interface MacroProgressBarProps {
  type: 'carbs' | 'protein' | 'fat';
  current: number;
  target: number;
  label: string;
  className?: string;
}

export const MacroProgressBar: React.FC<MacroProgressBarProps> = ({
  type,
  current,
  target,
  label,
  className = '',
}) => {
  const percentage = Math.min(Math.round((current / (target || 1)) * 100), 100);

  return (
    <div className={`macro-progress-container ${className}`} style={{ marginBottom: '12px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '13px',
        marginBottom: '6px',
        fontWeight: '500'
      }}>
        <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
        <span className="tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
          <strong>{current}g</strong> / {target}g
        </span>
      </div>
      <div className="macro-progress-bar">
        <div
          className={`macro-progress-fill ${type}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
