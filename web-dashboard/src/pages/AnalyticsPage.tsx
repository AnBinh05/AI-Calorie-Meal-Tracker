import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { DailySummary, DateRangeSummary } from '../types';
import { StatCard } from '../components/StatCard';
import { toLocalISODate, shiftISODate } from '../utils/formatters';
import { FileSpreadsheet, FileText, Loader2, Lightbulb, Target } from 'lucide-react';

type RangePreset = 7 | 30 | 90 | 'custom';

export const AnalyticsPage: React.FC = () => {
  const [rangeSummary, setRangeSummary] = useState<DateRangeSummary | null>(null);
  const [preset, setPreset] = useState<RangePreset>(7);
  const [customStart, setCustomStart] = useState<string>(() => shiftISODate(toLocalISODate(), -13));
  const [customEnd, setCustomEnd] = useState<string>(() => toLocalISODate());
  const [hoveredDay, setHoveredDay] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const getRangeDates = () => {
    if (preset === 'custom') {
      return {
        start: customStart <= customEnd ? customStart : customEnd,
        end: customStart <= customEnd ? customEnd : customStart,
      };
    }
    const end = toLocalISODate();
    const start = shiftISODate(end, -(preset - 1));
    return { start, end };
  };

  useEffect(() => {
    fetchRangeData();
  }, [preset, customStart, customEnd]);

  const fetchRangeData = async () => {
    try {
      setLoading(true);
      const { start, end } = getRangeDates();
      const res = await api.getRangeSummary(start, end);
      if (res.success && res.data) {
        setRangeSummary(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setIsExportingCsv(true);
      const { start, end } = getRangeDates();
      await api.downloadExport('csv', start, end);
    } catch (err: any) {
      console.error('Lỗi khi xuất CSV:', err);
      const errMsg = err.response?.data?.message || err.message || 'Lỗi kết nối máy chủ';
      alert('Không thể xuất file CSV: ' + errMsg);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      const { start, end } = getRangeDates();
      await api.downloadExport('pdf', start, end);
    } catch (err: any) {
      console.error('Lỗi khi xuất PDF:', err);
      const errMsg = err.response?.data?.message || err.message || 'Lỗi kết nối máy chủ';
      alert('Không thể xuất file PDF: ' + errMsg);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const targetCal = rangeSummary?.dailyCalorieTarget || 2000;
  const dailySummaries = rangeSummary?.dailySummaries || [];

  const adherenceStats = useMemo(() => {
    if (dailySummaries.length === 0) return { loggedDays: 0, onTargetDays: 0, adherencePct: 0 };
    const logged = dailySummaries.filter((d) => (d.totalCaloriesConsumed || 0) > 0);
    const onTarget = logged.filter(
      (d) => d.totalCaloriesConsumed >= targetCal * 0.85 && d.totalCaloriesConsumed <= targetCal * 1.1
    );
    return {
      loggedDays: logged.length,
      onTargetDays: onTarget.length,
      adherencePct: logged.length > 0 ? Math.round((onTarget.length / logged.length) * 100) : 0,
    };
  }, [dailySummaries, targetCal]);

  const macroPercents = useMemo(() => {
    const dist = rangeSummary?.macroDistributionPercent;
    const protein = dist?.proteinPercent ?? 30;
    const carbs = dist?.carbsPercent ?? 45;
    const fat = dist?.fatPercent ?? 25;
    return { protein, carbs, fat };
  }, [rangeSummary]);

  const aiInsightText = useMemo(() => {
    if (!rangeSummary || adherenceStats.loggedDays === 0) {
      return 'Chưa có đủ dữ liệu bữa ăn trong khoảng thời gian đã chọn. Hãy chụp ảnh hoặc ghi nhận các bữa ăn hằng ngày để AI phân tích xu hướng dinh dưỡng cho bạn.';
    }
    const avgCal = Math.round(rangeSummary.averageDailyCalories || 0);
    const diff = avgCal - targetCal;
    const calNote =
      Math.abs(diff) <= targetCal * 0.1
        ? `Lượng calo trung bình (${avgCal.toLocaleString()} kcal/ngày) đang bám rất sát mục tiêu ${targetCal.toLocaleString()} kcal.`
        : diff > 0
          ? `Lượng calo trung bình (${avgCal.toLocaleString()} kcal/ngày) đang vượt mục tiêu +${diff.toLocaleString()} kcal; bạn nên cân nhắc giảm nhẹ tinh bột tinh chế hoặc đồ uống ngọt vào bữa tối.`
          : `Lượng calo trung bình (${avgCal.toLocaleString()} kcal/ngày) đang thấp hơn mục tiêu ${Math.abs(diff).toLocaleString()} kcal; hãy bổ sung thêm đạm nạc và chất béo tốt để tránh thiếu năng lượng.`;

    const proteinNote =
      macroPercents.protein < 22
        ? ` Tỷ lệ Protein hiện ở mức ${macroPercents.protein}% (khuyến nghị ~25-30%), nên tăng cường thêm thịt nạc, cá, trứng hoặc đậu phụ.`
        : ` Tỷ lệ đạm đạt ${macroPercents.protein}%, rất tốt để duy trì khối cơ và cảm giác no lâu.`;

    return `${calNote}${proteinNote} Duy trì uống đủ 2-2.5 lít nước mỗi ngày để tối ưu trao đổi chất.`;
  }, [rangeSummary, adherenceStats.loggedDays, targetCal, macroPercents]);

  const chartSummaries = dailySummaries.slice(-31);
  const maxChartCal = Math.max(...chartSummaries.map((d) => d.totalCaloriesConsumed || 0), targetCal * 1.25);

  const donutRadius = 56;
  const donutCirc = 2 * Math.PI * donutRadius;
  const proteinLen = (macroPercents.protein / 100) * donutCirc;
  const carbsLen = (macroPercents.carbs / 100) * donutCirc;
  const fatLen = (macroPercents.fat / 100) * donutCirc;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 className="page-title">Phân tích & Xu hướng</h2>
          <p className="page-subtitle">Thống kê trung bình lượng calories, tỷ lệ phân bổ Macros và khuyến nghị thông minh</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Day range toggle */}
          <div style={{ display: 'inline-flex', background: 'var(--color-bg-surface-subtle)', padding: '3px', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: '2px' }}>
            {([
              { key: 7, label: '7 ngày' },
              { key: 30, label: '30 ngày' },
              { key: 90, label: '3 tháng' },
              { key: 'custom', label: 'Tùy chọn' },
            ] as { key: RangePreset; label: string }[]).map((opt) => (
              <button
                key={String(opt.key)}
                type="button"
                className={`btn ${preset === opt.key ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '6px 12px', fontSize: '13px', borderRadius: 'calc(var(--radius-md) - 2px)' }}
                onClick={() => setPreset(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {preset === 'custom' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="date"
                aria-label="Từ ngày"
                className="form-input"
                value={customStart}
                onChange={(e) => e.target.value && setCustomStart(e.target.value)}
                style={{ width: 'auto', padding: '5px 8px', fontSize: '12px' }}
              />
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>→</span>
              <input
                type="date"
                aria-label="Đến ngày"
                className="form-input"
                value={customEnd}
                onChange={(e) => e.target.value && setCustomEnd(e.target.value)}
                style={{ width: 'auto', padding: '5px 8px', fontSize: '12px' }}
              />
            </div>
          )}

          <div style={{ width: '1px', height: '24px', background: 'var(--color-border-default)' }} aria-hidden="true" />

          {/* Export Action Buttons */}
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleExportCsv}
            disabled={isExportingCsv || isExportingPdf || loading}
            aria-label="Xuất dữ liệu dinh dưỡng ra file CSV"
            title="Tải báo cáo nhật ký định dạng bảng tính CSV"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}
          >
            {isExportingCsv ? (
              <>
                <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Đang xuất CSV...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet size={16} color="var(--color-brand-primary)" aria-hidden="true" />
                <span>Xuất CSV</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={handleExportPdf}
            disabled={isExportingCsv || isExportingPdf || loading}
            aria-label="Xuất báo cáo dinh dưỡng ra file PDF"
            title="Tải báo cáo tóm tắt dinh dưỡng định dạng PDF"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}
          >
            {isExportingPdf ? (
              <>
                <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Đang xuất PDF...</span>
              </>
            ) : (
              <>
                <FileText size={16} color="var(--color-status-danger)" aria-hidden="true" />
                <span>Xuất PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)' }}>
          Đang tải dữ liệu phân tích...
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              title="Calories trung bình / ngày"
              value={`${Math.round(rangeSummary?.averageDailyCalories || 0)} kcal`}
              subtitle={`Mục tiêu: ${targetCal} kcal (${adherenceStats.adherencePct}% đạt chuẩn)`}
              progress={((rangeSummary?.averageDailyCalories || 0) / targetCal) * 100}
              color="var(--color-brand-primary)"
              icon="📊"
            />

            <StatCard
              title="Protein trung bình"
              value={`${Math.round(rangeSummary?.averageDailyProtein || 0)}g`}
              subtitle={`Chiếm ${macroPercents.protein}% tổng năng lượng`}
              color="var(--color-macro-protein)"
              icon="🥩"
            />

            <StatCard
              title="Carbs trung bình"
              value={`${Math.round(rangeSummary?.averageDailyCarbs || 0)}g`}
              subtitle={`Chiếm ${macroPercents.carbs}% tổng năng lượng`}
              color="var(--color-macro-carbs)"
              icon="🍚"
            />

            <StatCard
              title="Fat trung bình"
              value={`${Math.round(rangeSummary?.averageDailyFat || 0)}g`}
              subtitle={`Chiếm ${macroPercents.fat}% tổng năng lượng`}
              color="var(--color-macro-fat)"
              icon="🥑"
            />
          </div>

          {/* Charts Row: Daily Calorie Bar Chart + Macro Distribution Donut */}
          <div className="dashboard-layout" style={{ marginBottom: '24px' }}>
            {/* Daily Calorie Bar Chart */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Biểu đồ Calo hàng ngày</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {adherenceStats.onTargetDays}/{adherenceStats.loggedDays} ngày có ghi nhận đạt trong mức mục tiêu
                  </p>
                </div>
                <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Target size={12} aria-hidden="true" />
                  Mục tiêu {targetCal.toLocaleString()} kcal
                </span>
              </div>

              <div
                style={{
                  position: 'relative',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: chartSummaries.length > 15 ? '4px' : '8px',
                  paddingTop: '16px',
                  borderBottom: '1px solid var(--color-border-default)',
                }}
              >
                {/* Target dashed line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: `${(targetCal / maxChartCal) * 164}px`,
                    borderTop: '1.5px dashed var(--color-text-muted)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />

                {chartSummaries.map((day) => {
                  const cal = Math.round(day.totalCaloriesConsumed || 0);
                  const heightPx = Math.max((cal / maxChartCal) * 164, cal > 0 ? 8 : 3);
                  const barColor =
                    cal <= 0
                      ? 'var(--color-border-default)'
                      : cal <= targetCal * 1.05
                        ? 'var(--color-brand-primary)'
                        : cal <= targetCal * 1.15
                          ? 'var(--color-status-warning)'
                          : 'var(--color-status-danger)';
                  return (
                    <div
                      key={day.date}
                      tabIndex={0}
                      role="button"
                      aria-label={`Ngày ${day.date}: ${cal} kcal`}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      onFocus={() => setHoveredDay(day)}
                      onBlur={() => setHoveredDay(null)}
                      style={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 2,
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '28px',
                          height: `${heightPx}px`,
                          backgroundColor: barColor,
                          borderRadius: '4px 4px 0 0',
                          opacity: hoveredDay?.date === day.date ? 1 : 0.85,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg-surface-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                }}
              >
                {hoveredDay ? (
                  <>
                    <span style={{ fontWeight: 700 }}>Ngày {hoveredDay.date} ({hoveredDay.mealCount} bữa):</span>
                    <span className="tabular-nums" style={{ fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                      {Math.round(hoveredDay.totalCaloriesConsumed)} kcal ({Math.round(hoveredDay.totalCaloriesConsumed - targetCal) >= 0 ? '+' : ''}
                      {Math.round(hoveredDay.totalCaloriesConsumed - targetCal)} kcal)
                    </span>
                  </>
                ) : (
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Di chuột hoặc chọn từng cột để xem chi tiết calo theo ngày
                  </span>
                )}
              </div>
            </div>

            {/* Macro Distribution Donut Chart */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>Phân bổ tỷ lệ Macros</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  So sánh với tỷ lệ khuyến nghị (30% P • 45% C • 25% F)
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 16px' }}>
                <svg width="144" height="144" viewBox="0 0 144 144" role="img" aria-label="Biểu đồ tỷ lệ phân bổ Protein, Carbs và Fat">
                  <circle cx="72" cy="72" r={donutRadius} fill="none" stroke="var(--color-bg-surface-subtle)" strokeWidth="18" />
                  <circle
                    cx="72"
                    cy="72"
                    r={donutRadius}
                    fill="none"
                    stroke="var(--color-macro-carbs)"
                    strokeWidth="18"
                    strokeDasharray={`${carbsLen} ${donutCirc}`}
                    strokeDashoffset={0}
                    transform="rotate(-90 72 72)"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r={donutRadius}
                    fill="none"
                    stroke="var(--color-macro-protein)"
                    strokeWidth="18"
                    strokeDasharray={`${proteinLen} ${donutCirc}`}
                    strokeDashoffset={-carbsLen}
                    transform="rotate(-90 72 72)"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r={donutRadius}
                    fill="none"
                    stroke="var(--color-macro-fat)"
                    strokeWidth="18"
                    strokeDasharray={`${fatLen} ${donutCirc}`}
                    strokeDashoffset={-(carbsLen + proteinLen)}
                    transform="rotate(-90 72 72)"
                  />
                  <text x="72" y="68" textAnchor="middle" fill="var(--color-text-primary)" fontSize="14" fontWeight="800">
                    Macros
                  </text>
                  <text x="72" y="86" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontWeight="600">
                    Thực tế %
                  </text>
                </svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-macro-carbs)', fontWeight: 700 }}>● Carbs (Khuyến nghị 45%)</span>
                  <span className="tabular-nums" style={{ fontWeight: 800 }}>{macroPercents.carbs}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-macro-protein)', fontWeight: 700 }}>● Protein (Khuyến nghị 30%)</span>
                  <span className="tabular-nums" style={{ fontWeight: 800 }}>{macroPercents.protein}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-macro-fat)', fontWeight: 700 }}>● Fat (Khuyến nghị 25%)</span>
                  <span className="tabular-nums" style={{ fontWeight: 800 }}>{macroPercents.fat}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight Callout Box */}
          <div
            className="card"
            style={{
              marginBottom: '24px',
              backgroundColor: 'var(--color-brand-tint)',
              borderColor: 'var(--color-brand-primary)',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
            }}
          >
            <Lightbulb size={22} color="var(--color-brand-primary)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-brand-primary)', marginBottom: '4px' }}>
                Khuyến nghị thông minh từ NutriAI
              </h3>
              <p className="text-pretty" style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '20px' }}>
                {aiInsightText}
              </p>
            </div>
          </div>

          {/* Daily Progress Bars List */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>
              Chi tiết calories theo từng ngày ({dailySummaries.length} ngày)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {dailySummaries.map((daily) => {
                const pct = Math.min(Math.round(((daily.totalCaloriesConsumed || 0) / (daily.calorieTarget || 2000)) * 100), 100);
                return (
                  <div key={daily.date} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="tabular-nums" style={{ width: '100px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{daily.date}</span>
                    <div style={{ flex: 1, height: '14px', backgroundColor: 'var(--color-bg-surface-subtle)', borderRadius: '7px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          backgroundColor: pct > 105 ? 'var(--color-status-danger)' : 'var(--color-brand-primary)',
                          borderRadius: '7px',
                        }}
                      />
                    </div>
                    <span className="tabular-nums" style={{ width: '140px', textAlign: 'right', fontSize: '13px', fontWeight: '700' }}>
                      {Math.round(daily.totalCaloriesConsumed)} / {daily.calorieTarget} kcal
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
