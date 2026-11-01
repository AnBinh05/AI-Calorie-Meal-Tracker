import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FavoriteMeal, MealType } from '../types';
import { MacroBadge } from '../components/MacroBadge';
import {
  Heart,
  Plus,
  Search,
  Zap,
  Trash2,
  X,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const FavoriteMealsPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealType, setSelectedMealType] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [loggingId, setLoggingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Modal create state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [newMealType, setNewMealType] = useState<MealType>('LUNCH');
  const [newMealNotes, setNewMealNotes] = useState('');
  const [newItems, setNewItems] = useState<{
    name: string;
    estimatedWeightGrams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[]>([
    { name: 'Ức gà nướng áp chảo', estimatedWeightGrams: 150, calories: 250, protein: 35, carbs: 0, fat: 5 },
    { name: 'Khoai lang hấp', estimatedWeightGrams: 120, calories: 120, protein: 2, carbs: 28, fat: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, [selectedMealType]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const mealTypeParam = selectedMealType !== 'ALL' ? (selectedMealType as MealType) : undefined;
      const res = await api.getFavoriteMeals({
        keyword: searchKeyword.trim() || undefined,
        mealType: mealTypeParam,
        size: 50,
      });
      if (res.success && res.data) {
        setFavorites(res.data.content || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách món yêu thích:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFavorites();
  };

  const handleQuickLog = async (fav: FavoriteMeal) => {
    try {
      setLoggingId(fav.id);
      const res = await api.quickLogFavoriteMeal(fav.id, {
        mealDate: new Date().toISOString().split('T')[0],
        mealType: fav.mealType,
        notes: `Ghi nhận nhanh từ món yêu thích "${fav.name}"`,
      });

      if (res.success) {
        setSuccessMessage(`Đã ghi nhận "${fav.name}" (${Math.round(fav.totalCalories)} kcal) vào nhật ký hôm nay!`);
        // Tăng usageCount trên UI
        setFavorites((prev) =>
          prev.map((item) => (item.id === fav.id ? { ...item, usageCount: item.usageCount + 1 } : item))
        );
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        alert(res.message || 'Không thể ghi nhận món ăn');
      }
    } catch (err: any) {
      console.error('Lỗi khi ghi nhận nhanh:', err);
      alert('Lỗi: ' + (err.response?.data?.message || err.message || 'Không thể ghi nhận món ăn'));
    } finally {
      setLoggingId(null);
    }
  };

  const handleDeleteFavorite = async (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa "${name}" khỏi danh sách món ăn yêu thích?`)) {
      try {
        await api.deleteFavoriteMeal(id);
        setFavorites((prev) => prev.filter((item) => item.id !== id));
      } catch (err: any) {
        console.error('Lỗi khi xóa món yêu thích:', err);
        alert('Không thể xóa: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleAddItemToForm = () => {
    setNewItems((prev) => [
      ...prev,
      { name: 'Món mới', estimatedWeightGrams: 100, calories: 150, protein: 10, carbs: 15, fat: 5 },
    ]);
  };

  const handleRemoveItemFromForm = (index: number) => {
    setNewItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemFieldChange = (index: number, field: string, val: string | number) => {
    setNewItems((prev) =>
      prev.map((it, idx) => (idx === index ? { ...it, [field]: val } : it))
    );
  };

  const handleCreateFavoriteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName.trim()) {
      alert('Vui lòng nhập tên món ăn yêu thích');
      return;
    }
    if (newItems.length === 0) {
      alert('Vui lòng thêm ít nhất 1 thành phần món ăn');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.createFavoriteMeal({
        name: newMealName.trim(),
        mealType: newMealType,
        notes: newMealNotes.trim() || undefined,
        items: newItems.map((item) => ({
          name: item.name,
          estimatedWeightGrams: Number(item.estimatedWeightGrams) || 100,
          servingSize: '1 phần',
          calories: Number(item.calories) || 0,
          protein: Number(item.protein) || 0,
          carbs: Number(item.carbs) || 0,
          fat: Number(item.fat) || 0,
        })),
      });

      if (res.success && res.data) {
        setIsCreateModalOpen(false);
        setNewMealName('');
        setNewMealNotes('');
        await fetchFavorites();
        setSuccessMessage(`Đã thêm "${res.data.name}" vào danh sách yêu thích!`);
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        alert(res.message || 'Không thể tạo món yêu thích');
      }
    } catch (err: any) {
      console.error('Lỗi khi tạo món yêu thích:', err);
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính tổng calo và macro của form tạo mới
  const formTotalCalories = newItems.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
  const formTotalProtein = newItems.reduce((sum, item) => sum + (Number(item.protein) || 0), 0);
  const formTotalCarbs = newItems.reduce((sum, item) => sum + (Number(item.carbs) || 0), 0);
  const formTotalFat = newItems.reduce((sum, item) => sum + (Number(item.fat) || 0), 0);

  const mealTypeTabs = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'BREAKFAST', label: 'Bữa sáng' },
    { id: 'LUNCH', label: 'Bữa trưa' },
    { id: 'DINNER', label: 'Bữa tối' },
    { id: 'SNACK', label: 'Bữa phụ' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={24} color="#ec4899" fill="#ec4899" aria-hidden="true" />
            <h2 className="page-title" style={{ margin: 0 }}>Món ăn yêu thích & Quick-Log</h2>
          </div>
          <p className="page-subtitle" style={{ marginTop: '6px' }}>
            Lưu trữ combo món ăn quen thuộc để ghi nhận dinh dưỡng chỉ với 1 cú click, không cần chụp ảnh lại mỗi ngày
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} aria-hidden="true" />
          <span>Tạo món yêu thích mới</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 18px',
            marginBottom: '20px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid var(--color-brand-primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-brand-primary)',
            fontSize: '14px',
            fontWeight: '600',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <Check size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Meal Type Tabs */}
        <div style={{ display: 'inline-flex', background: 'var(--color-bg-surface-subtle)', padding: '3px', borderRadius: 'var(--radius-md)', flexWrap: 'wrap' }}>
          {mealTypeTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`btn ${selectedMealType === tab.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 14px', fontSize: '13px', borderRadius: 'calc(var(--radius-md) - 2px)' }}
              onClick={() => setSelectedMealType(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={16}
              color="var(--color-text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên món..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '38px', fontSize: '13px' }}
            />
          </div>
          <button type="submit" className="btn btn-outline" style={{ height: '38px', padding: '0 14px' }}>
            Tìm
          </button>
        </form>
      </div>

      {/* Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-secondary)' }}>
          <Loader2 size={32} className="spinner" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Đang tải danh sách món ăn yêu thích...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-bg-surface-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Heart size={32} color="var(--color-text-muted)" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            Chưa có món ăn yêu thích nào
          </h3>
          <p style={{ fontSize: '14px', maxWidth: '420px', lineHeight: '22px', marginBottom: '20px' }}>
            Lưu lại các bữa ăn bạn thường ăn hàng ngày để không phải chụp ảnh hoặc nhập lại từng món mỗi lần ghi nhật ký.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} />
            <span>Tạo món yêu thích đầu tiên</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'var(--spacing-5)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              }}
            >
              <div>
                {/* Header card: Name, mealType badge, usage count */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-bg-surface-subtle)',
                          color: 'var(--color-brand-primary)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                      >
                        {fav.mealTypeDisplayName || fav.mealType}
                      </span>
                      {fav.usageCount > 0 && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: 'var(--color-macro-carbs)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          🔥 Đã log {fav.usageCount} lần
                        </span>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: 'var(--color-text-primary)',
                        lineHeight: '22px',
                      }}
                    >
                      {fav.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => handleDeleteFavorite(fav.id, fav.name)}
                    aria-label={`Xóa món "${fav.name}" khỏi danh sách yêu thích`}
                    style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                    }}
                    title="Xóa khỏi danh sách"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Notes */}
                {fav.notes && (
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px', fontStyle: 'italic' }}>
                    "{fav.notes}"
                  </p>
                )}

                {/* Total Calories & Macro Badges */}
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-surface-subtle)',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Tổng năng lượng</span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-brand-primary)' }} className="tabular-nums">
                      {Math.round(fav.totalCalories || 0)} kcal
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <MacroBadge type="protein" label="Protein" value={Math.round(fav.totalProtein || 0)} unit="g" />
                    <MacroBadge type="carbs" label="Carbs" value={Math.round(fav.totalCarbs || 0)} unit="g" />
                    <MacroBadge type="fat" label="Chất béo" value={Math.round(fav.totalFat || 0)} unit="g" />
                  </div>
                </div>

                {/* Sub-items list preview */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                    Thành phần món ({fav.items?.length || 0}):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {fav.items?.map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                          • {it.name}
                        </span>
                        <span style={{ color: 'var(--color-text-muted)' }} className="tabular-nums">
                          {it.estimatedWeightGrams ? `${it.estimatedWeightGrams}g` : ''} ({Math.round(it.calories)} kcal)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Log Action Button */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleQuickLog(fav)}
                disabled={loggingId === fav.id}
                aria-label={`Ghi nhận nhanh món "${fav.name}" vào nhật ký hôm nay`}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: '700',
                  padding: '10px 16px',
                }}
              >
                {loggingId === fav.id ? (
                  <>
                    <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Đang ghi nhận...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} fill="currentColor" />
                    <span>Ghi nhận ngay hôm nay</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Favorite Meal */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-default)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--color-brand-primary)" />
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                  Tạo món ăn yêu thích mới
                </h3>
              </div>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setIsCreateModalOpen(false)}
                aria-label="Đóng cửa sổ"
                style={{ padding: '6px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateFavoriteSubmit}>
              {/* Meal Name & Meal Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                    Tên gợi nhớ món yêu thích *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Combo Ức gà nướng & Khoai lang"
                    value={newMealName}
                    onChange={(e) => setNewMealName(e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                    Bữa ăn mặc định
                  </label>
                  <select
                    value={newMealType}
                    onChange={(e) => setNewMealType(e.target.value as MealType)}
                    className="form-input"
                    style={{ width: '100%', height: '42px' }}
                  >
                    <option value="BREAKFAST">Bữa sáng</option>
                    <option value="LUNCH">Bữa trưa</option>
                    <option value="DINNER">Bữa tối</option>
                    <option value="SNACK">Bữa phụ</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Ghi chú dinh dưỡng (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Dành cho bữa trưa văn phòng, hạn chế dầu mỡ..."
                  value={newMealNotes}
                  onChange={(e) => setNewMealNotes(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Items Section */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>
                    Danh sách các món con thành phần ({newItems.length})
                  </label>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleAddItemToForm}
                    style={{ fontSize: '12px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Thêm món con
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {newItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px',
                        backgroundColor: 'var(--color-bg-surface-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <label style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Tên món</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemFieldChange(idx, 'name', e.target.value)}
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '12px', height: '32px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Gram (g)</label>
                        <input
                          type="number"
                          value={item.estimatedWeightGrams}
                          onChange={(e) => handleItemFieldChange(idx, 'estimatedWeightGrams', e.target.value)}
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '12px', height: '32px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Calories</label>
                        <input
                          type="number"
                          value={item.calories}
                          onChange={(e) => handleItemFieldChange(idx, 'calories', e.target.value)}
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '12px', height: '32px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Protein</label>
                        <input
                          type="number"
                          value={item.protein}
                          onChange={(e) => handleItemFieldChange(idx, 'protein', e.target.value)}
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '12px', height: '32px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Carbs</label>
                        <input
                          type="number"
                          value={item.carbs}
                          onChange={(e) => handleItemFieldChange(idx, 'carbs', e.target.value)}
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '12px', height: '32px' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItemFromForm(idx)}
                        className="btn-ghost"
                        style={{ padding: '6px', color: 'var(--color-status-danger)', marginTop: '12px' }}
                        title="Xóa món con này"
                        aria-label="Xóa món con"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Summary Totals */}
              <div
                style={{
                  padding: '14px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px dashed var(--color-brand-primary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block' }}>Tổng tính toán</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-brand-primary)' }} className="tabular-nums">
                    {Math.round(formTotalCalories)} kcal
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <MacroBadge type="protein" label="Protein" value={Math.round(formTotalProtein)} unit="g" />
                  <MacroBadge type="carbs" label="Carbs" value={Math.round(formTotalCarbs)} unit="g" />
                  <MacroBadge type="fat" label="Fat" value={Math.round(formTotalFat)} unit="g" />
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Lưu món yêu thích</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
