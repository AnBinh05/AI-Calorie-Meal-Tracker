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

/**
 * Format Date to YYYY-MM-DD in the user's local timezone (avoids UTC midnight shift).
 */
export function toLocalISODate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Shift a YYYY-MM-DD string by `deltaDays` in local time.
 */
export function shiftISODate(isoDate: string, deltaDays: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, (d || 1) + deltaDays);
  return toLocalISODate(dt);
}
