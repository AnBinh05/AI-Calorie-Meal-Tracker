/**
 * Standard formatters for NutriAI Web Dashboard.
 */

export function formatCalories(kcal: number): string {
  return `${Math.round(kcal).toLocaleString('vi-VN')} kcal`;
}

export function formatGrams(grams: number): string {
  return `${Math.round(grams)}g`;
}

export function formatPercentage(value: number, total: number): string {
  if (!total || total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

export function formatDateVietnamese(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
