import React from 'react';

export interface DailyCalorieDonutProps {
  consumed: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  title?: string;
  showRemaining?: boolean;
  className?: string;
}

export const DailyCalorieDonut: React.FC<DailyCalorieDonutProps> = ({
  consumed,
  target,
  size = 190,
  strokeWidth = 14,
  title,
  showRemaining = true,
  className = '',
}) => {
  const validTarget = Math.max(target, 1);
  const percentage = Math.round((consumed / validTarget) * 100);
  const isOverLimit = consumed > target;
  const remaining = Math.max(target - consumed, 0);
  const overAmount = Math.max(consumed - target, 0);

  // SVG Geometry calculations
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(consumed / validTarget, 1);
  const strokeDashoffset = circumference - clampedProgress * circumference;

  const strokeColor = isOverLimit
    ? 'var(--color-status-danger)'
    : 'var(--color-brand-primary)';

  const trackColor = 'var(--color-bg-surface-subtle)';

  return (
    <div
      className={`daily-calorie-donut-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {title && (
        <h3
          style={{
            fontSize: 'var(--text-heading-3)',
            fontWeight: 'var(--font-weight-heading-3)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-4)',
            textAlign: 'center',
          }}
          className="text-balance"
        >
          {title}
        </h3>
      )}

      {/* SVG Donut Ring */}
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`Tiến trình Calo: ${Math.round(consumed)} trên ${target} kcal (${percentage}%)`}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        >
          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />

          {/* Animated Foreground Progress Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.3s ease-out',
            }}
          />
        </svg>

        {/* Center Text Metrics */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'var(--spacing-2)',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: isOverLimit ? 'var(--color-status-danger)' : 'var(--color-text-secondary)',
              marginBottom: '2px',
            }}
          >
            {isOverLimit ? 'Vượt chỉ tiêu' : 'Đã nạp'}
          </span>

          <span
            className="tabular-nums"
            style={{
              fontSize: size >= 180 ? 'var(--text-display-1)' : '24px',
              lineHeight: 1.1,
              fontWeight: 'var(--font-weight-display-1)',
              color: isOverLimit ? 'var(--color-status-danger)' : 'var(--color-text-primary)',
            }}
          >
            {Math.round(consumed).toLocaleString('vi-VN')}
          </span>

          <span
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
              marginTop: '2px',
            }}
          >
            / {target.toLocaleString('vi-VN')} kcal
          </span>

          {/* Percentage Badge */}
          <span
            className="tabular-nums"
            style={{
              marginTop: '6px',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isOverLimit
                ? 'rgba(239, 68, 68, 0.15)'
                : 'var(--color-brand-tint)',
              color: isOverLimit
                ? 'var(--color-status-danger)'
                : 'var(--color-brand-primary)',
            }}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {/* Footer Info: Remaining Budget Pill */}
      {showRemaining && (
        <div
          style={{
            marginTop: 'var(--spacing-4)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isOverLimit
              ? 'rgba(239, 68, 68, 0.12)'
              : 'var(--color-bg-surface-subtle)',
            border: `1px solid ${
              isOverLimit ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-border-default)'
            }`,
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: isOverLimit ? 'var(--color-status-danger)' : 'var(--color-text-primary)',
          }}
        >
          <span>{isOverLimit ? '⚠️ Vượt ngân sách:' : '⚡ Còn lại hôm nay:'}</span>
          <strong className="tabular-nums">
            {isOverLimit
              ? `+${Math.round(overAmount).toLocaleString('vi-VN')} kcal`
              : `${Math.round(remaining).toLocaleString('vi-VN')} kcal`}
          </strong>
        </div>
      )}
    </div>
  );
};
