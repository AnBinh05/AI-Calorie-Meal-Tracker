import React from 'react';
import { DailyCalorieDonut } from './DailyCalorieDonut';
import { MacroNutrientBars } from './MacroNutrientBars';

export interface DailyCalorieProgressCardProps {
  consumedCalories: number;
  calorieTarget: number;
  consumedCarbs: number;
  carbsTarget: number;
  consumedProtein: number;
  proteinTarget: number;
  consumedFat: number;
  fatTarget: number;
  className?: string;
}

export const DailyCalorieProgressCard: React.FC<DailyCalorieProgressCardProps> = ({
  consumedCalories,
  calorieTarget,
  consumedCarbs,
  carbsTarget,
  consumedProtein,
  proteinTarget,
  consumedFat,
  fatTarget,
  className = '',
}) => {
  return (
    <div
      className={`card daily-calorie-progress-card ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 'var(--spacing-8)',
        alignItems: 'center',
        padding: 'var(--spacing-6) var(--spacing-8)',
      }}
    >
      {/* Left: Calorie Donut Ring */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingRight: 'var(--spacing-4)',
          borderRight: '1px solid var(--color-border-default)',
        }}
      >
        <DailyCalorieDonut
          consumed={consumedCalories}
          target={calorieTarget}
          size={190}
          strokeWidth={14}
          showRemaining={true}
        />
      </div>

      {/* Right: Macro Progress Bars & Info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3
            style={{
              fontSize: 'var(--text-heading-2)',
              lineHeight: 'var(--leading-heading-2)',
              fontWeight: 'var(--font-weight-heading-2)',
              color: 'var(--color-text-primary)',
            }}
          >
            Tiến trình Calo & Đa lượng hôm nay
          </h3>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--color-brand-primary)',
              fontWeight: 600,
              backgroundColor: 'var(--color-brand-tint)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            Mục tiêu chuẩn
          </span>
        </div>

        <MacroNutrientBars
          carbs={{ consumed: consumedCarbs, target: carbsTarget }}
          protein={{ consumed: consumedProtein, target: proteinTarget }}
          fat={{ consumed: consumedFat, target: fatTarget }}
          showCaloriesContribution={true}
        />
      </div>
    </div>
  );
};
