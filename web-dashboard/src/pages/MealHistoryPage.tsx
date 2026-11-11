import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { CreateMealRequest, Meal, MealItem, MealType } from '../types';
import { AiMealReviewModal } from '../components/AiMealReviewModal';
import { toLocalISODate, shiftISODate } from '../utils/formatters';
import { Trash2, Heart, Pencil, Plus, Calendar } from 'lucide-react';

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const MealHistoryPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => toLocalISODate());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'manual' | 'edit'>('manual');
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, [selectedDate]);

  const weekStrip = useMemo(() => {
    return Array.from({ length: 7 }, (_, idx) => {
      const dateStr = shiftISODate(selectedDate, idx - 3);
      const [y, m, d] = dateStr.split('-').map(Number);
      const dt = new Date(y, (m || 1) - 1, d || 1);
      return {
        dateStr,
        label: WEEKDAY_LABELS[dt.getDay()],
        dayNum: d,
        isToday: dateStr === toLocalISODate(),
        isSelected: dateStr === selectedDate,
      };
    });
  }, [selectedDate]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await api.getDailyMeals(selectedDate);
      if (res.success && res.data) {
        setMeals(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bữa ăn này không?')) {
      try {
        await api.deleteMeal(id);
        fetchMeals();
      } catch (e) {
        alert('Không thể xóa bữa ăn');
      }
    }
  };

  const handleBookmarkFavorite = async (mealId?: number, mealName?: string) => {
    if (!mealId) return;
    try {
      const res = await api.createFavoriteFromMeal(mealId, mealName);
      if (res.success) {
        alert(`Đã lưu "${mealName || 'Bữa ăn'}" vào danh sách món yêu thích!`);
      }
    } catch (err: any) {
      alert('Không thể lưu vào yêu thích: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenManualAdd = () => {
    setEditingMeal(null);
    setModalMode('manual');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveMeal = async (mealData: {
    name: string;
    mealType: MealType;
    healthTip?: string;
    items: MealItem[];
  }) => {
    try {
      setIsSaving(true);
      const payload: CreateMealRequest = {
        mealDate: editingMeal?.mealDate || selectedDate,
        mealType: mealData.mealType,
        name: mealData.name,
        imageUrl: editingMeal?.imageUrl,
        healthTip: mealData.healthTip || editingMeal?.healthTip,
        items: mealData.items.map((item) => ({
          name: item.name,
          estimatedWeightGrams: item.estimatedWeightGrams,
          servingSize: item.servingSize || '1 phần',
          calories: item.calories,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0,
          fiber: item.fiber || 0,
        })),
      };

      const res = editingMeal?.id
        ? await api.updateMeal(editingMeal.id, payload)
        : await api.createMeal(payload);

      if (res.success) {
        setIsModalOpen(false);
        setEditingMeal(null);
        await fetchMeals();
      } else {
        alert(res.message || 'Không thể lưu bữa ăn');
      }
    } catch (err: any) {
      alert('Lỗi lưu bữa ăn: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const dayTotals = useMemo(
    () =>
      meals.reduce(
        (acc, m) => ({
          calories: acc.calories + (m.totalCalories || 0),
          protein: acc.protein + (m.totalProtein || 0),
          carbs: acc.carbs + (m.totalCarbs || 0),
          fat: acc.fat + (m.totalFat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [meals]
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Lịch sử & Nhật ký bữa ăn</h2>
          <p className="page-subtitle">Xem lại chi tiết từng món ăn, chỉnh sửa định lượng và nguồn ghi nhận</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} color="var(--color-brand-primary)" aria-hidden="true" />
            <input
              type="date"
              aria-label="Chọn ngày xem lịch sử bữa ăn"
              className="form-input"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              style={{ width: 'auto' }}
            />
          </div>

          <button type="button" className="btn btn-primary" onClick={handleOpenManualAdd}>
            <Plus size={16} aria-hidden="true" />
            <span>Thêm bữa ăn</span>
          </button>
        </div>
      </div>

      {/* 7-Day Calendar Strip */}
      <div
        className="card"
        style={{
          padding: '12px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
        }}
      >
        {weekStrip.map((day) => (
          <button
            key={day.dateStr}
            type="button"
            onClick={() => setSelectedDate(day.dateStr)}
            style={{
              padding: '8px 6px',
              borderRadius: 'var(--radius-md)',
              border: day.isSelected ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border-default)',
              backgroundColor: day.isSelected ? 'var(--color-brand-tint)' : 'var(--color-bg-surface-subtle)',
              color: day.isSelected ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.8 }}>{day.label}</span>
            <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 800 }}>{day.dayNum}</span>
            {day.isToday && (
              <span style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: 'var(--color-brand-primary)' }} />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          Đang tải dữ liệu bữa ăn...
        </div>
      ) : meals.length > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
            {meals.map((meal) => (
              <div key={meal.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span className={`badge badge-${meal.mealType.toLowerCase()}`}>
                        {meal.mealTypeDisplayName || meal.mealType}
                      </span>
                      <span className={`badge ${meal.imageUrl ? 'badge-ai' : 'badge-manual'}`}>
                        {meal.imageUrl ? '✨ AI Scan' : '✍️ Thủ công'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginTop: '6px' }}>{meal.name}</h3>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(meal)}
                      className="btn btn-outline"
                      style={{ padding: '6px 10px', borderRadius: '8px' }}
                      title="Chỉnh sửa bữa ăn"
                      aria-label={`Chỉnh sửa bữa ăn ${meal.name}`}
                    >
                      <Pencil size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBookmarkFavorite(meal.id, meal.name)}
                      className="btn btn-outline"
                      style={{ padding: '6px 10px', borderRadius: '8px' }}
                      title="Lưu thành món yêu thích"
                      aria-label={`Lưu "${meal.name}" vào danh sách món yêu thích`}
                    >
                      <Heart size={14} color="#ec4899" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(meal.id!)}
                      className="btn btn-danger"
                      style={{ padding: '6px 10px', borderRadius: '8px' }}
                      title="Xóa bữa ăn"
                      aria-label={`Xóa bữa ăn ${meal.name}`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {meal.imageUrl && (
                  <div style={{ height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
                    <img src={meal.imageUrl} alt={meal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  backgroundColor: 'var(--color-bg-surface-subtle)',
                  border: '1px solid var(--color-border-default)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <div>
                    <div className="tabular-nums" style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-brand-primary)' }}>{Math.round(meal.totalCalories)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Calories</div>
                  </div>
                  <div>
                    <div className="tabular-nums" style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-macro-protein)' }}>{Math.round(meal.totalProtein)}g</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Protein</div>
                  </div>
                  <div>
                    <div className="tabular-nums" style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-macro-carbs)' }}>{Math.round(meal.totalCarbs)}g</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Carbs</div>
                  </div>
                  <div>
                    <div className="tabular-nums" style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-macro-fat)' }}>{Math.round(meal.totalFat)}g</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Fat</div>
                  </div>
                </div>

                {meal.items && meal.items.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Các món ăn chi tiết:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {meal.items.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span>• {item.name} {item.estimatedWeightGrams ? `(${item.estimatedWeightGrams}g)` : ''}</span>
                          <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{Math.round(item.calories)} kcal</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Daily Summary Footer */}
          <div
            className="card"
            style={{
              marginTop: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              backgroundColor: 'var(--color-brand-tint)',
              borderColor: 'var(--color-brand-primary)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Tổng kết dinh dưỡng ngày {selectedDate} ({meals.length} bữa):
            </div>
            <div className="tabular-nums" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '14px', fontWeight: 800 }}>
              <span style={{ color: 'var(--color-brand-primary)' }}>{Math.round(dayTotals.calories)} kcal</span>
              <span style={{ color: 'var(--color-macro-protein)' }}>P: {Math.round(dayTotals.protein)}g</span>
              <span style={{ color: 'var(--color-macro-carbs)' }}>C: {Math.round(dayTotals.carbs)}g</span>
              <span style={{ color: 'var(--color-macro-fat)' }}>F: {Math.round(dayTotals.fat)}g</span>
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--color-text-secondary)' }}>
          <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Không tìm thấy bữa ăn nào vào ngày {selectedDate}</p>
          <p style={{ fontSize: '13px', marginTop: '6px', marginBottom: '16px' }}>
            Bạn có thể chọn ngày khác trên thanh lịch hoặc tự thêm bữa ăn mới ngay tại đây.
          </p>
          <button type="button" className="btn btn-primary" onClick={handleOpenManualAdd}>
            <Plus size={16} aria-hidden="true" />
            <span>Thêm bữa ăn thủ công</span>
          </button>
        </div>
      )}

      <AiMealReviewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMeal(null);
        }}
        mode={modalMode}
        imagePreviewUrl={editingMeal?.imageUrl}
        initialMealName={editingMeal?.name}
        initialMealType={editingMeal?.mealType || 'LUNCH'}
        initialItems={editingMeal?.items}
        healthTip={editingMeal?.healthTip}
        onSaveMeal={handleSaveMeal}
        isSaving={isSaving}
      />
    </div>
  );
};
