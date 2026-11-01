import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FavoriteMeal } from '../types';
import { Heart, Zap, Loader2, ArrowRight } from 'lucide-react';

interface FavoriteMealsQuickWidgetProps {
  onMealLogged?: () => void;
  onNavigateToFavorites?: () => void;
}

export const FavoriteMealsQuickWidget: React.FC<FavoriteMealsQuickWidgetProps> = ({
  onMealLogged,
  onNavigateToFavorites,
}) => {
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingId, setLoggingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchTopFavorites();
  }, []);

  const fetchTopFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.getFavoriteMeals({ size: 4 });
      if (res.success && res.data) {
        setFavorites(res.data.content || []);
      }
    } catch (e) {
      console.error('Lỗi khi tải món yêu thích:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLog = async (fav: FavoriteMeal) => {
    try {
      setLoggingId(fav.id);
      const res = await api.quickLogFavoriteMeal(fav.id, {
        mealDate: new Date().toISOString().split('T')[0],
        mealType: fav.mealType,
      });

      if (res.success) {
        setFeedback(`✓ Đã log ${fav.name}`);
        if (onMealLogged) {
          onMealLogged();
        }
        setTimeout(() => setFeedback(null), 3000);
      } else {
        alert(res.message || 'Không thể log món ăn');
      }
    } catch (err: any) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoggingId(null);
    }
  };

  if (loading) {
    return null;
  }

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="card" style={{ padding: 'var(--spacing-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={18} color="#ec4899" fill="#ec4899" aria-hidden="true" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
            Món ăn quen thuộc (Quick-Log)
          </h3>
        </div>

        {onNavigateToFavorites && (
          <button
            type="button"
            className="btn-ghost"
            onClick={onNavigateToFavorites}
            style={{ fontSize: '12px', color: 'var(--color-brand-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
          >
            <span>Tất cả</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {feedback && (
        <div
          role="status"
          style={{
            fontSize: '12px',
            color: 'var(--color-brand-primary)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '10px',
            fontWeight: '600',
          }}
        >
          {feedback}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {favorites.map((fav) => (
          <div
            key={fav.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              backgroundColor: 'var(--color-bg-surface-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-default)',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  {fav.mealTypeDisplayName || fav.mealType}
                </span>
                {fav.usageCount > 0 && (
                  <span style={{ fontSize: '10px', color: 'var(--color-macro-carbs)', fontWeight: '600' }}>
                    🔥 {fav.usageCount}
                  </span>
                )}
              </div>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {fav.name}
              </h4>
              <div style={{ fontSize: '12px', color: 'var(--color-brand-primary)', fontWeight: '700' }} className="tabular-nums">
                {Math.round(fav.totalCalories || 0)} kcal
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => handleQuickLog(fav)}
              disabled={loggingId === fav.id}
              aria-label={`Log nhanh ${fav.name}`}
              title="Ghi nhận ngay vào nhật ký hôm nay"
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
              }}
            >
              {loggingId === fav.id ? (
                <Loader2 size={14} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <Zap size={14} fill="currentColor" color="var(--color-brand-primary)" />
                  <span>Log</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
