import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Meal } from '../types';
import { Trash2 } from 'lucide-react';

export const MealHistoryPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeals();
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

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Lịch sử & Nhật ký bữa ăn</h2>
          <p className="page-subtitle">Xem lại chi tiết từng món ăn, ảnh chụp và phân rã các chỉ số dinh dưỡng</p>
        </div>

        <div>
          <input
            type="date"
            className="form-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: 'auto' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          Đang tải dữ liệu bữa ăn...
        </div>
      ) : meals.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
          {meals.map((meal) => (
            <div key={meal.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className={`badge badge-${meal.mealType.toLowerCase()}`}>
                    {meal.mealTypeDisplayName || meal.mealType}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginTop: '6px' }}>{meal.name}</h3>
                </div>

                <button
                  onClick={() => handleDelete(meal.id!)}
                  className="btn btn-danger"
                  style={{ padding: '6px 10px', borderRadius: '8px' }}
                  title="Xóa bữa ăn"
                >
                  <Trash2 size={14} />
                </button>
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
                backgroundColor: '#090d16',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>{Math.round(meal.totalCalories)}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Calories</div>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-blue)' }}>{Math.round(meal.totalProtein)}g</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Protein</div>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-yellow)' }}>{Math.round(meal.totalCarbs)}g</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Carbs</div>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-pink)' }}>{Math.round(meal.totalFat)}g</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Fat</div>
                </div>
              </div>

              {meal.items && meal.items.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Các món ăn chi tiết:</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {meal.items.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span>• {item.name} {item.estimatedWeightGrams ? `(${item.estimatedWeightGrams}g)` : ''}</span>
                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{Math.round(item.calories)} kcal</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '16px', fontWeight: '600' }}>Không tìm thấy bữa ăn nào vào ngày {selectedDate}</p>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '6px' }}>
            Vui lòng chọn ngày khác trên bộ lọc hoặc thêm bữa ăn mới từ Mobile App.
          </p>
        </div>
      )}
    </div>
  );
};
