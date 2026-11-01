import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DateRangeSummary } from '../types';
import { StatCard } from '../components/StatCard';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [rangeSummary, setRangeSummary] = useState<DateRangeSummary | null>(null);
  const [daysCount, setDaysCount] = useState<number>(7);
  const [loading, setLoading] = useState(true);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const getRangeDates = () => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - (daysCount - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return { start, end };
  };

  useEffect(() => {
    fetchRangeData();
  }, [daysCount]);

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

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 className="page-title">Phân tích & Xu hướng</h2>
          <p className="page-subtitle">Thống kê trung bình lượng calories và tỷ lệ phân bổ các nhóm chất</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Day range toggle */}
          <div style={{ display: 'inline-flex', background: 'var(--color-bg-surface-subtle)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
            <button
              type="button"
              className={`btn ${daysCount === 7 ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 14px', fontSize: '13px', borderRadius: 'calc(var(--radius-md) - 2px)' }}
              onClick={() => setDaysCount(7)}
            >
              7 ngày gần nhất
            </button>
            <button
              type="button"
              className={`btn ${daysCount === 30 ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 14px', fontSize: '13px', borderRadius: 'calc(var(--radius-md) - 2px)' }}
              onClick={() => setDaysCount(30)}
            >
              30 ngày gần nhất
            </button>
          </div>

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
                <FileText size={16} color="#ef4444" aria-hidden="true" />
                <span>Xuất PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          Đang tải dữ liệu phân tích...
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              title="Calories trung bình / ngày"
              value={`${Math.round(rangeSummary?.averageDailyCalories || 0)} kcal`}
              subtitle={`Mục tiêu: ${rangeSummary?.dailyCalorieTarget || 2000} kcal`}
              progress={((rangeSummary?.averageDailyCalories || 0) / (rangeSummary?.dailyCalorieTarget || 2000)) * 100}
              color="var(--primary)"
              icon="📊"
            />

        <StatCard
          title="Protein trung bình"
          value={`${Math.round(rangeSummary?.averageDailyProtein || 0)}g`}
          subtitle="Chất đạm hàng ngày"
          color="var(--accent-blue)"
          icon="🥩"
        />

        <StatCard
          title="Carbs trung bình"
          value={`${Math.round(rangeSummary?.averageDailyCarbs || 0)}g`}
          subtitle="Đường bột hàng ngày"
          color="var(--accent-yellow)"
          icon="🍚"
        />

        <StatCard
          title="Fat trung bình"
          value={`${Math.round(rangeSummary?.averageDailyFat || 0)}g`}
          subtitle="Chất béo hàng ngày"
          color="var(--accent-pink)"
          icon="🥑"
        />
      </div>

      {/* Daily Progress Bars List */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>
          Tiến độ calories theo từng ngày ({rangeSummary?.dailySummaries?.length || 0} ngày)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {rangeSummary?.dailySummaries?.map((daily, idx) => {
            const pct = Math.min(Math.round(((daily.totalCaloriesConsumed || 0) / (daily.calorieTarget || 2000)) * 100), 100);
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ width: '100px', fontSize: '13px', color: 'var(--text-muted)' }}>{daily.date}</span>
                <div style={{ flex: 1, height: '14px', backgroundColor: '#090d16', borderRadius: '7px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: pct > 105 ? '#f43f5e' : 'var(--primary)',
                      borderRadius: '7px',
                    }}
                  />
                </div>
                <span style={{ width: '130px', textAlign: 'right', fontSize: '13px', fontWeight: '700' }}>
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
