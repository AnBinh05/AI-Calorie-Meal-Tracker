import React, { useState } from 'react';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

export interface DayCalorieData {
  day: string;          // e.g. 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'
  fullDayName: string;  // e.g. 'Thứ Hai', 'Thứ Ba'...
  date: string;         // e.g. '15/09'
  calories: number;
  isToday?: boolean;
}

interface WeeklyCalorieMiniChartProps {
  targetCalories?: number;
  data?: DayCalorieData[];
}

const DEFAULT_WEEKLY_DATA: DayCalorieData[] = [
  { day: 'T2', fullDayName: 'Thứ Hai', date: '14/09', calories: 1950 },
  { day: 'T3', fullDayName: 'Thứ Ba', date: '15/09', calories: 2040 },
  { day: 'T4', fullDayName: 'Thứ Tư', date: '16/09', calories: 1820 },
  { day: 'T5', fullDayName: 'Thứ Năm', date: '17/09', calories: 2180 },
  { day: 'T6', fullDayName: 'Thứ Sáu', date: '18/09', calories: 1910 },
  { day: 'T7', fullDayName: 'Thứ Bảy', date: '19/09', calories: 2350 },
  { day: 'CN', fullDayName: 'Chủ Nhật (Hôm nay)', date: '20/09', calories: 1450, isToday: true },
];

export const WeeklyCalorieMiniChart: React.FC<WeeklyCalorieMiniChartProps> = ({
  targetCalories = 2000,
  data = DEFAULT_WEEKLY_DATA,
}) => {
  const [hoveredDay, setHoveredDay] = useState<DayCalorieData | null>(null);
  const safeTarget = targetCalories > 0 ? targetCalories : 2000;
  const chartData = data.length > 0 ? data : DEFAULT_WEEKLY_DATA;

  const maxCal = Math.max(...chartData.map(d => d.calories), safeTarget * 1.25);
  const chartHeight = 120; // px

  const averageCalories = Math.round(chartData.reduce((sum, d) => sum + d.calories, 0) / chartData.length);
  const daysOnTarget = chartData.filter(d => d.calories > 0 && d.calories <= safeTarget * 1.05).length;

  const targetLineY = chartHeight - (safeTarget / maxCal) * chartHeight;

  const getBarColor = (calories: number) => {
    if (calories <= 0) {
      return 'var(--color-border-default)';
    }
    if (calories <= safeTarget) {
      return 'var(--color-brand-primary)';
    } else if (calories <= safeTarget * 1.1) {
      return 'var(--color-macro-carbs)';
    } else {
      return 'var(--color-status-danger)';
    }
  };

  return (
    <div className="card" style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--color-brand-primary)" aria-hidden="true" />
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
              Xu hướng Calo 7 ngày
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Mục tiêu chuẩn: <strong className="tabular-nums">{safeTarget.toLocaleString()} kcal/ngày</strong>
          </p>
        </div>
        <div style={{
          fontSize: '12px',
          fontWeight: '700',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-brand-tint)',
          color: 'var(--color-brand-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <CheckCircle2 size={13} />
          <span>{daysOnTarget}/7 ngày đạt</span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div
        role="region"
        aria-label="Biểu đồ cột xu hướng calo 7 ngày qua"
        style={{
          position: 'relative',
          height: `${chartHeight}px`,
          marginTop: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-2)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '0 4px',
        }}
      >
        {/* Dashed Target Line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${targetLineY}px`,
            borderTop: '1.5px dashed var(--color-text-muted)',
            zIndex: 1,
            pointerEvents: 'none',
            opacity: 0.65,
          }}
        >
          <span
            className="tabular-nums"
            style={{
              position: 'absolute',
              right: 0,
              top: '-16px',
              fontSize: '10px',
              fontWeight: '700',
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-bg-surface)',
              padding: '0 4px',
              borderRadius: '2px'
            }}
          >
            Mục tiêu {safeTarget.toLocaleString()}
          </span>
        </div>

        {/* 7 Vertical Bars */}
        {chartData.map((item) => {
          const barHeight = Math.max((item.calories / maxCal) * chartHeight, item.calories > 0 ? 10 : 4);
          const barColor = getBarColor(item.calories);
          const isSelected = hoveredDay?.date === item.date && hoveredDay?.day === item.day;

          return (
            <div
              key={`${item.date}-${item.day}`}
              onMouseEnter={() => setHoveredDay(item)}
              onMouseLeave={() => setHoveredDay(null)}
              onFocus={() => setHoveredDay(item)}
              onBlur={() => setHoveredDay(null)}
              tabIndex={0}
              role="button"
              aria-label={`${item.fullDayName} (${item.date}): ${item.calories} calo`}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
                position: 'relative',
                cursor: 'pointer',
                outline: 'none',
                zIndex: 2,
              }}
            >
              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '24px',
                  height: `${barHeight}px`,
                  backgroundColor: barColor,
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 2px 2px',
                  opacity: item.isToday ? 1 : isSelected ? 1 : 0.82,
                  boxShadow: item.isToday || isSelected ? `0 0 8px ${barColor}66` : 'none',
                  transform: isSelected ? 'scaleY(1.03)' : 'scaleY(1)',
                  transformOrigin: 'bottom',
                  transition: 'transform 180ms ease, opacity 180ms ease, box-shadow 180ms ease',
                  border: item.isToday ? '1.5px solid var(--color-text-primary)' : 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X-Axis Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '0 4px' }}>
        {chartData.map((item) => (
          <div
            key={`${item.date}-${item.day}-label`}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: item.isToday ? '800' : '600',
              color: item.isToday ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
            }}
          >
            {item.day}
          </div>
        ))}
      </div>

      {/* Dynamic Hover Tooltip / Status Footer */}
      <div
        style={{
          marginTop: 'var(--spacing-3)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-bg-surface-subtle)',
          border: '1px solid var(--color-border-default)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '36px',
        }}
      >
        {hoveredDay ? (
          <>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
              {hoveredDay.fullDayName} ({hoveredDay.date}):
            </span>
            <span className="tabular-nums" style={{ fontSize: '13px', fontWeight: '800', color: getBarColor(hoveredDay.calories) }}>
              {Math.round(hoveredDay.calories).toLocaleString()} kcal{' '}
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
                ({Math.round(hoveredDay.calories - safeTarget) >= 0 ? '+' : ''}{Math.round(hoveredDay.calories - safeTarget)} kcal)
              </span>
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Trung bình 7 ngày qua:
            </span>
            <span className="tabular-nums" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
              {averageCalories.toLocaleString()} kcal/ngày
            </span>
          </>
        )}
      </div>
    </div>
  );
};
