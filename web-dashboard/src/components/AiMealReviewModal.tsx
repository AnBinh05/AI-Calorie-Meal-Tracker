import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Plus, Minus, Check } from 'lucide-react';
import { MacroBadge } from './MacroBadge';

export interface RecognizedItem {
  id: string;
  name: string;
  grams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export interface AiMealReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imagePreviewUrl?: string;
  onSaveMeal: (mealData: any) => void;
}

export const AiMealReviewModal: React.FC<AiMealReviewModalProps> = ({
  isOpen,
  onClose,
  imagePreviewUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
  onSaveMeal,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [mealName, setMealName] = useState('Cơm tấm sườn bì chả');
  const [items, setItems] = useState<RecognizedItem[]>([
    { id: '1', name: 'Sườn heo nướng mật ong', grams: 150, caloriesPer100g: 240, proteinPer100g: 26, carbsPer100g: 6, fatPer100g: 13 },
    { id: '2', name: 'Cơm tấm trắng', grams: 180, caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3 },
    { id: '3', name: 'Chả trứng hấp', grams: 60, caloriesPer100g: 180, proteinPer100g: 12, carbsPer100g: 4, fatPer100g: 13 },
    { id: '4', name: 'Bì heo trộn thính', grams: 40, caloriesPer100g: 120, proteinPer100g: 15, carbsPer100g: 3, fatPer100g: 5 },
  ]);
  const [includeExtraOil, setIncludeExtraOil] = useState(true);
  const [saving, setSaving] = useState(false);

  // Keyboard accessibility: Escape key to close & Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Initial focus on close button or modal
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate totals
  const rawCalories = items.reduce((sum, item) => sum + (item.grams * item.caloriesPer100g) / 100, 0);
  const rawProtein = items.reduce((sum, item) => sum + (item.grams * item.proteinPer100g) / 100, 0);
  const rawCarbs = items.reduce((sum, item) => sum + (item.grams * item.carbsPer100g) / 100, 0);
  const rawFat = items.reduce((sum, item) => sum + (item.grams * item.fatPer100g) / 100, 0);

  const oilMultiplier = includeExtraOil ? 1.12 : 1.0;
  const totalCalories = Math.round(rawCalories * oilMultiplier);
  const totalProtein = Math.round(rawProtein);
  const totalCarbs = Math.round(rawCarbs);
  const totalFat = Math.round(rawFat * (includeExtraOil ? 1.25 : 1.0));

  const handleUpdateGrams = (id: string, newGrams: number) => {
    const clamped = Math.max(0, Math.min(newGrams, 2000));
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, grams: clamped } : item))
    );
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onSaveMeal({
        name: mealName,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        items,
        extraOil: includeExtraOil,
      });
      setSaving(false);
      onClose();
    }, 400);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-review-title"
        aria-describedby="ai-review-desc"
        style={{
          maxWidth: '820px',
          padding: 'var(--spacing-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-5)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-brand-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-brand-primary)',
              }}
            >
              <Sparkles size={18} aria-hidden="true" />
            </div>
            <div>
              <h3
                id="ai-review-title"
                style={{
                  fontSize: 'var(--text-heading-2)',
                  fontWeight: 'var(--font-weight-heading-2)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Kết quả AI bóc tách món ăn
              </h3>
              <p
                id="ai-review-desc"
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Kiểm tra và tinh chỉnh số gram từng thành phần trước khi lưu vào nhật ký
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Đóng cửa sổ phân tích bữa ăn"
            type="button"
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* 2-Column Content Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: 'var(--spacing-5)',
          }}
        >
          {/* Left: Food Image Preview & Live Nutrition Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div
              style={{
                width: '100%',
                height: '210px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-bg-surface-subtle)',
                position: 'relative',
              }}
            >
              <img
                src={imagePreviewUrl}
                alt="Ảnh chụp đĩa ăn đã được AI phân tích"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                ✨ AI Vision 98%
              </span>
            </div>

            {/* Nutrition Total Card */}
            <div
              className="card"
              style={{
                padding: 'var(--spacing-4)',
                backgroundColor: 'var(--color-brand-tint)',
                borderColor: 'var(--color-brand-primary)',
              }}
              aria-live="polite"
              aria-atomic="true"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Tổng ước tính Calo
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: 'var(--color-brand-primary)',
                  }}
                >
                  {totalCalories} <span style={{ fontSize: '14px', fontWeight: 600 }}>kcal</span>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <MacroBadge type="carbs" label="Carbs" value={totalCarbs} unit="g" />
                <MacroBadge type="protein" label="Protein" value={totalProtein} unit="g" />
                <MacroBadge type="fat" label="Fat" value={totalFat} unit="g" />
              </div>
            </div>
          </div>

          {/* Right: Items Stepper Editor */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)',
              maxHeight: '340px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label htmlFor="meal-name-input" className="form-label">
                Tên bữa ăn
              </label>
              <input
                id="meal-name-input"
                type="text"
                className="form-input"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                required
              />
            </div>

            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
              }}
            >
              Thành phần món ăn ({items.length})
            </span>

            {items.map((item) => {
              const itemCalories = Math.round((item.grams * item.caloriesPer100g) / 100);
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-surface-subtle)',
                    border: '1px solid var(--color-border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {item.name}
                    </div>
                    <div className="tabular-nums" style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {itemCalories} kcal • P: {Math.round((item.grams * item.proteinPer100g) / 100)}g • C: {Math.round((item.grams * item.carbsPer100g) / 100)}g
                    </div>
                  </div>

                  {/* Stepper Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateGrams(item.id, item.grams - 10)}
                      aria-label={`Giảm 10g cho món ${item.name}`}
                      className="btn btn-outline"
                      style={{ width: '28px', height: '28px', padding: 0 }}
                    >
                      <Minus size={14} aria-hidden="true" />
                    </button>

                    <input
                      type="number"
                      aria-label={`Khối lượng gram cho món ${item.name}`}
                      value={item.grams}
                      onChange={(e) => handleUpdateGrams(item.id, parseInt(e.target.value) || 0)}
                      className="form-input tabular-nums"
                      style={{ width: '56px', height: '28px', padding: '2px 4px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}
                    />
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>g</span>

                    <button
                      type="button"
                      onClick={() => handleUpdateGrams(item.id, item.grams + 10)}
                      aria-label={`Tăng 10g cho món ${item.name}`}
                      className="btn btn-outline"
                      style={{ width: '28px', height: '28px', padding: 0 }}
                    >
                      <Plus size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Extra Oil Cooking Factor Checkbox */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                marginTop: '4px',
              }}
            >
              <input
                type="checkbox"
                id="extra-oil-check"
                checked={includeExtraOil}
                onChange={(e) => setIncludeExtraOil(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-brand-primary)' }}
              />
              <label htmlFor="extra-oil-check" style={{ fontSize: '12px', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                Bổ sung ước tính dầu mỡ & sốt gia vị xào nấu (+12% kcal)
              </label>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-3)',
            paddingTop: 'var(--spacing-4)',
            borderTop: '1px solid var(--color-border-default)',
          }}
        >
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={saving}
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <Check size={16} aria-hidden="true" />
            <span>{saving ? 'Đang lưu...' : '💾 Lưu vào Nhật ký bữa ăn'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
