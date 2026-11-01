import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Plus, Minus, Check, Trash2 } from 'lucide-react';
import { MacroBadge } from './MacroBadge';
import { MealItem } from '../types';

export interface ReviewItemState {
  id: string;
  name: string;
  grams: number;
  initialGrams: number;
  initialCalories: number;
  initialProtein: number;
  initialCarbs: number;
  initialFat: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
}

export interface AiMealReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imagePreviewUrl?: string;
  initialMealName?: string;
  initialItems?: MealItem[];
  healthTip?: string;
  onSaveMeal: (mealData: {
    name: string;
    healthTip?: string;
    items: MealItem[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }) => Promise<void> | void;
  isSaving?: boolean;
}

export const AiMealReviewModal: React.FC<AiMealReviewModalProps> = ({
  isOpen,
  onClose,
  imagePreviewUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
  initialMealName = 'Bữa ăn phân tích AI',
  initialItems = [],
  healthTip = '',
  onSaveMeal,
  isSaving = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [mealName, setMealName] = useState(initialMealName);
  const [items, setItems] = useState<ReviewItemState[]>([]);
  const [includeExtraOil, setIncludeExtraOil] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMealName(initialMealName || 'Bữa ăn phân tích AI');
      if (initialItems && initialItems.length > 0) {
        setItems(
          initialItems.map((item, idx) => {
            const grams = item.estimatedWeightGrams || 100;
            return {
              id: String(item.id || idx + 1),
              name: item.name,
              grams: grams,
              initialGrams: grams,
              initialCalories: item.calories || 100,
              initialProtein: item.protein || 0,
              initialCarbs: item.carbs || 0,
              initialFat: item.fat || 0,
              calories: item.calories || 100,
              protein: item.protein || 0,
              carbs: item.carbs || 0,
              fat: item.fat || 0,
              servingSize: item.servingSize || '1 phần',
            };
          })
        );
      } else {
        // Fallback default item
        setItems([
          {
            id: '1',
            name: 'Món ăn nhận diện',
            grams: 150,
            initialGrams: 150,
            initialCalories: 250,
            initialProtein: 15,
            initialCarbs: 30,
            initialFat: 8,
            calories: 250,
            protein: 15,
            carbs: 30,
            fat: 8,
            servingSize: '1 phần',
          },
        ]);
      }
    }
  }, [isOpen, initialMealName, initialItems]);

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
        if (focusableElements.length === 0) return;
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
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate totals
  const rawCalories = items.reduce((sum, item) => sum + item.calories, 0);
  const rawProtein = items.reduce((sum, item) => sum + item.protein, 0);
  const rawCarbs = items.reduce((sum, item) => sum + item.carbs, 0);
  const rawFat = items.reduce((sum, item) => sum + item.fat, 0);

  const oilMultiplier = includeExtraOil ? 1.12 : 1.0;
  const totalCalories = Math.round(rawCalories * oilMultiplier);
  const totalProtein = Math.round(rawProtein);
  const totalCarbs = Math.round(rawCarbs);
  const totalFat = Math.round(rawFat * (includeExtraOil ? 1.25 : 1.0));

  const handleUpdateGrams = (id: string, newGrams: number) => {
    const clamped = Math.max(1, Math.min(newGrams, 3000));
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const ratio = clamped / (item.initialGrams || 100);
          return {
            ...item,
            grams: clamped,
            calories: Math.round(item.initialCalories * ratio),
            protein: Math.round(item.initialProtein * ratio * 10) / 10,
            carbs: Math.round(item.initialCarbs * ratio * 10) / 10,
            fat: Math.round(item.initialFat * ratio * 10) / 10,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddNewItem = () => {
    if (!newItemName.trim()) return;
    const newItem: ReviewItemState = {
      id: String(Date.now()),
      name: newItemName.trim(),
      grams: 100,
      initialGrams: 100,
      initialCalories: 150,
      initialProtein: 5,
      initialCarbs: 20,
      initialFat: 5,
      calories: 150,
      protein: 5,
      carbs: 20,
      fat: 5,
      servingSize: '1 phần',
    };
    setItems((prev) => [...prev, newItem]);
    setNewItemName('');
    setIsAddingItem(false);
  };

  const handleSave = async () => {
    if (items.length === 0) {
      alert('Bữa ăn phải có ít nhất 1 món thành phần');
      return;
    }

    const payloadItems: MealItem[] = items.map((item) => ({
      name: item.name,
      estimatedWeightGrams: item.grams,
      servingSize: item.servingSize || '1 phần',
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: 0,
      confidenceScore: 1.0,
    }));

    await onSaveMeal({
      name: mealName.trim() || 'Bữa ăn',
      healthTip: healthTip || 'Bữa ăn đã được ghi nhận vào nhật ký dinh dưỡng.',
      items: payloadItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
    });
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
          maxWidth: '840px',
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
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-brand-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-brand-primary)',
              }}
            >
              <Sparkles size={20} aria-hidden="true" />
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
                Kết quả Gemini AI bóc tách món ăn
              </h3>
              <p
                id="ai-review-desc"
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Kiểm tra định lượng, tinh chỉnh số gram và thêm bớt thành phần trước khi lưu
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
            gridTemplateColumns: '1fr 1.35fr',
            gap: 'var(--spacing-5)',
          }}
        >
          {/* Left: Food Image Preview & Live Nutrition Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div
              style={{
                width: '100%',
                height: '220px',
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
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={12} color="#10b981" /> AI Verified
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
                  Tổng Calories Bữa Ăn
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
                <MacroBadge type="protein" label="Protein" value={totalProtein} unit="g" />
                <MacroBadge type="carbs" label="Carbs" value={totalCarbs} unit="g" />
                <MacroBadge type="fat" label="Fat" value={totalFat} unit="g" />
              </div>

              {healthTip ? (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.4',
                  }}
                >
                  💡 <strong style={{ color: 'var(--color-text-primary)' }}>Lời khuyên:</strong> {healthTip}
                </div>
              ) : null}
            </div>
          </div>

          {/* Right: Items Stepper Editor */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)',
              maxHeight: '380px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            <div className="form-group" style={{ marginBottom: '4px' }}>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                Món ăn thành phần ({items.length})
              </span>

              {!isAddingItem && (
                <button
                  type="button"
                  onClick={() => setIsAddingItem(true)}
                  className="btn btn-ghost"
                  style={{ fontSize: '12px', padding: '2px 8px', color: 'var(--color-brand-primary)' }}
                >
                  <Plus size={14} /> Thêm món
                </button>
              )}
            </div>

            {isAddingItem && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg-surface-subtle)',
                  border: '1px dashed var(--color-brand-primary)',
                }}
              >
                <input
                  type="text"
                  placeholder="Nhập tên món mới (vd: Canh rau dền)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, padding: '4px 8px', fontSize: '12px' }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddNewItem}
                  className="btn btn-primary"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                >
                  Thêm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingItem(false);
                    setNewItemName('');
                  }}
                  className="btn btn-ghost"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Hủy
                </button>
              </div>
            )}

            {items.map((item) => (
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
                    {item.calories} kcal • P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
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

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label={`Xóa món ${item.name}`}
                    className="btn btn-ghost"
                    style={{ width: '28px', height: '28px', padding: 0, color: 'var(--color-status-danger)' }}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}

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
            disabled={isSaving}
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving || items.length === 0}
          >
            <Check size={16} aria-hidden="true" />
            <span>{isSaving ? 'Đang lưu vào CSDL...' : '💾 Lưu vào Nhật ký bữa ăn'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
