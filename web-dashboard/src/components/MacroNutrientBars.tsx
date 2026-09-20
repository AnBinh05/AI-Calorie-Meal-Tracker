import React from 'react';

export interface MacroData {
  consumed: number;
  target: number;
}

export interface MacroNutrientBarsProps {
  carbs: MacroData;
  protein: MacroData;
  fat: MacroData;
  className?: string;
  showCaloriesContribution?: boolean;
}

interface MacroItemConfig {
  id: 'carbs' | 'protein' | 'fat';
  name: string;
  shortName: string;
  icon: string;
  colorVar: string;
  tintVar: string;
  multiplier: number; // kcal per gram (Carbs: 4, Protein: 4, Fat: 9)
  current: number;
  target: number;
}

export const MacroNutrientBars: React.FC<MacroNutrientBarsProps> = ({
  carbs,
  protein,
  fat,
  className = '',
  showCaloriesContribution = true,
}) => {
  const macros: MacroItemConfig[] = [
    {
      id: 'carbs',
      name: 'Carbohydrates (Đường bột)',
      shortName: 'Carbs',
      icon: '🍚',
      colorVar: 'var(--color-macro-carbs)',
      tintVar: 'rgba(245, 158, 11, 0.15)',
      multiplier: 4,
      current: carbs.consumed || 0,
      target: carbs.target || 225,
    },
    {
      id: 'protein',
      name: 'Protein (Chất đạm)',
      shortName: 'Protein',
      icon: '🥩',
      colorVar: 'var(--color-macro-protein)',
      tintVar: 'rgba(59, 130, 246, 0.15)',
      multiplier: 4,
      current: protein.consumed || 0,
      target: protein.target || 150,
    },
    {
      id: 'fat',
      name: 'Fat (Chất béo)',
      shortName: 'Fat',
      icon: '🥑',
      colorVar: 'var(--color-macro-fat)',
      tintVar: 'rgba(236, 72, 153, 0.15)',
      multiplier: 9,
      current: fat.consumed || 0,
      target: fat.target || 55,
    },
  ];

  return (
    <div
      className={`macro-nutrient-bars-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-4)',
        width: '100%',
      }}
    >
      {macros.map((macro) => {
        const targetGrams = Math.max(macro.target, 1);
        const percent = Math.round((macro.current / targetGrams) * 100);
        const clampedPercent = Math.min(percent, 100);
        const isOver = percent > 100;
        const currentKcal = Math.round(macro.current * macro.multiplier);

        return (
          <div
            key={macro.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {/* Header: Name, Grams, Percentage Pill */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 'var(--text-body-medium)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }} role="img" aria-label={macro.shortName}>
                  {macro.icon}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {macro.shortName}
                </span>
                {showCaloriesContribution && (
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      fontWeight: 500,
                    }}
                  >
                    ({currentKcal} kcal)
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-primary)',
                    fontWeight: 600,
                  }}
                >
                  <strong>{Math.round(macro.current)}g</strong>
                  <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                    {' '}/ {macro.target}g
                  </span>
                </span>

                <span
                  className="tabular-nums"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isOver ? 'rgba(239, 68, 68, 0.15)' : macro.tintVar,
                    color: isOver ? 'var(--color-status-danger)' : macro.colorVar,
                  }}
                >
                  {percent}%
                </span>
              </div>
            </div>

            {/* Horizontal Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--color-bg-surface-subtle)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${clampedPercent}%`,
                  height: '100%',
                  backgroundColor: isOver ? 'var(--color-status-danger)' : macro.colorVar,
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.4s ease-out, background-color 0.2s ease-out',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
