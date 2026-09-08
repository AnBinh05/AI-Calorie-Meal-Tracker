import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { api } from '../services/api';
import { DailySummary } from '../types';
import { Sparkles, Utensils } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.getDailySummary();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const calorieTarget = summary?.calorieTarget || 2000;
  const consumedCalories = summary?.totalCaloriesConsumed || 0;
  const remainingCalories = Math.max(calorieTarget - consumedCalories, 0);
  const caloriePercent = Math.round((consumedCalories / calorieTarget) * 100);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Tổng quan dinh dưỡng</h2>
          <p className="page-subtitle">Theo dõi tiến độ tiêu thụ năng lượng và tỷ lệ dinh dưỡng theo thời gian thực</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          Đang tải dữ liệu tổng quan hôm nay...
        </div>
      ) : (
        <>
          {/* 4 Stat Cards */}
          <div className="stats-grid">
        <StatCard
          title="Calories nạp vào"
          value={`${Math.round(consumedCalories)} kcal`}
          subtitle={`Mục tiêu: ${calorieTarget} kcal (${caloriePercent}%)`}
          progress={caloriePercent}
          color="var(--primary)"
          icon="🔥"
        />

        <StatCard
          title="Protein (Chất đạm)"
          value={`${Math.round(summary?.totalProteinConsumed || 0)}g`}
          subtitle={`Mục tiêu: ${summary?.proteinTargetGrams || 150}g`}
          progress={((summary?.totalProteinConsumed || 0) / (summary?.proteinTargetGrams || 150)) * 100}
          color="var(--accent-blue)"
          icon="🥩"
        />

        <StatCard
          title="Carbohydrates (Đường bột)"
          value={`${Math.round(summary?.totalCarbsConsumed || 0)}g`}
          subtitle={`Mục tiêu: ${summary?.carbsTargetGrams || 225}g`}
          progress={((summary?.totalCarbsConsumed || 0) / (summary?.carbsTargetGrams || 225)) * 100}
          color="var(--accent-yellow)"
          icon="🍚"
        />

        <StatCard
          title="Fat (Chất béo)"
          value={`${Math.round(summary?.totalFatConsumed || 0)}g`}
          subtitle={`Mục tiêu: ${summary?.fatTargetGrams || 55}g`}
          progress={((summary?.totalFatConsumed || 0) / (summary?.fatTargetGrams || 55)) * 100}
          color="var(--accent-pink)"
          icon="🥑"
        />
      </div>

      {/* Main Grid Section */}
      <div className="dashboard-layout">
        {/* Left Column: Recent Meals */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Các bữa ăn hôm nay ({summary?.meals?.length || 0})</h3>
            <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>Đồng bộ từ Mobile</span>
          </div>

          {summary?.meals && summary.meals.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {summary.meals.map((meal) => (
                <div
                  key={meal.id}
                  style={{
                    backgroundColor: '#090d16',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      overflow: 'hidden'
                    }}>
                      {meal.imageUrl ? (
                        <img src={meal.imageUrl} alt={meal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        '🍽️'
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge badge-${meal.mealType.toLowerCase()}`}>
                          {meal.mealTypeDisplayName || meal.mealType}
                        </span>
                        <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{meal.name}</h4>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {meal.items?.length || 0} món • P: {Math.round(meal.totalProtein)}g • C: {Math.round(meal.totalCarbs)}g • F: {Math.round(meal.totalFat)}g
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                      {Math.round(meal.totalCalories)} kcal
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
              <Utensils size={40} style={{ margin: '0 auto 12px', color: 'var(--text-dim)' }} />
              <p style={{ fontWeight: '600' }}>Chưa có bữa ăn nào được ghi nhận hôm nay</p>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '4px' }}>
                Hãy mở ứng dụng di động để chụp ảnh món ăn và trải nghiệm phân tích tự động từ AI!
              </p>
            </div>
          )}
        </div>

        {/* Right Column: AI Health Advice & Daily Target Balance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ background: 'linear-gradient(145deg, #0f172a 0%, #064e3b 100%)', borderColor: '#059669' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={20} color="#a7f3d0" />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#a7f3d0' }}>AI Nutrition Insights</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#d1fae5', lineHeight: '20px' }}>
              {summary?.meals && summary.meals.length > 0 && summary.meals[0].healthTip
                ? summary.meals[0].healthTip
                : 'Hôm nay bạn đang kiểm soát dinh dưỡng rất tốt! Hãy tiếp tục duy trì lượng nước uống đầy đủ (2-2.5L) và phân bổ protein đều qua các bữa ăn chính.'}
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Cân đối năng lượng</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Năng lượng mục tiêu</span>
              <span style={{ fontWeight: '700' }}>{calorieTarget} kcal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Đã tiêu thụ</span>
              <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{Math.round(consumedCalories)} kcal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Còn lại hôm nay</span>
              <span style={{ fontWeight: '800', color: '#38bdf8' }}>{Math.round(remainingCalories)} kcal</span>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
