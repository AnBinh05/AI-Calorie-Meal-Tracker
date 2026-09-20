import React, { useState, useEffect, useRef } from 'react';
import { StatCard } from '../components/StatCard';
import { DailyCalorieProgressCard } from '../components/DailyCalorieProgressCard';
import { AiScanDropzone } from '../components/AiScanDropzone';
import { AiMealReviewModal } from '../components/AiMealReviewModal';
import { WeeklyCalorieMiniChart } from '../components/WeeklyCalorieMiniChart';
import { MacroBadge } from '../components/MacroBadge';
import { api } from '../services/api';
import { DailySummary, Meal, MealType } from '../types';
import { Sparkles, Utensils, Plus, Trash2, Calendar } from 'lucide-react';

interface MealCategoryConfig {
  type: MealType;
  title: string;
  icon: string;
  badgeClass: string;
  defaultTime: string;
}

const MEAL_CATEGORIES: MealCategoryConfig[] = [
  { type: 'BREAKFAST', title: 'Bữa sáng', icon: '🌅', badgeClass: 'badge-breakfast', defaultTime: '07:30' },
  { type: 'LUNCH', title: 'Bữa trưa', icon: '☀️', badgeClass: 'badge-lunch', defaultTime: '12:15' },
  { type: 'DINNER', title: 'Bữa tối', icon: '🌙', badgeClass: 'badge-dinner', defaultTime: '19:00' },
  { type: 'SNACK', title: 'Bữa phụ / Ăn vặt', icon: '🍎', badgeClass: 'badge-snack', defaultTime: '15:30' },
];

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string>('');
  const [targetMealTypeForScan, setTargetMealTypeForScan] = useState<MealType>('LUNCH');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.getDailySummary();
      if (res.success && res.data) {
        setSummary(res.data);
      } else {
        throw new Error('No data');
      }
    } catch (e) {
      // Fallback realistic Figma spec mock data
      setSummary({
        date: new Date().toISOString().split('T')[0],
        calorieTarget: 2000,
        totalCaloriesConsumed: 1450,
        remainingCalories: 550,
        carbsTargetGrams: 220,
        totalCarbsConsumed: 140,
        proteinTargetGrams: 130,
        totalProteinConsumed: 95,
        fatTargetGrams: 60,
        totalFatConsumed: 42,
        mealCount: 3,
        meals: [
          {
            id: 1,
            mealDate: new Date().toISOString().split('T')[0],
            name: 'Phở bò tái & Trà đào',
            mealType: 'BREAKFAST',
            mealTypeDisplayName: 'Bữa sáng',
            totalCalories: 420,
            totalProtein: 25,
            totalCarbs: 60,
            totalFat: 8,
            healthTip: 'Bữa sáng giàu protein và tinh bột phức tạp cung cấp năng lượng ổn định cho cả buổi sáng.',
            items: [
              { id: 1, name: 'Phở bò tái', estimatedWeightGrams: 450, servingSize: '1 bát', calories: 370, protein: 22, carbs: 54, fat: 8 },
              { id: 2, name: 'Trà đào ít đường', estimatedWeightGrams: 300, servingSize: '1 ly', calories: 50, protein: 3, carbs: 6, fat: 0 }
            ]
          },
          {
            id: 2,
            mealDate: new Date().toISOString().split('T')[0],
            name: 'Cơm sườn nướng & Canh cải',
            mealType: 'LUNCH',
            mealTypeDisplayName: 'Bữa trưa',
            totalCalories: 650,
            totalProtein: 45,
            totalCarbs: 65,
            totalFat: 24,
            healthTip: 'Cân đối tốt giữa đạm từ sườn nướng và chất xơ từ rau canh cải.',
            items: [
              { id: 3, name: 'Cơm tấm sườn nướng', estimatedWeightGrams: 350, servingSize: '1 đĩa', calories: 590, protein: 40, carbs: 60, fat: 22 },
              { id: 4, name: 'Canh cải ngọt thịt băm', estimatedWeightGrams: 200, servingSize: '1 bát', calories: 60, protein: 5, carbs: 5, fat: 2 }
            ]
          },
          {
            id: 3,
            mealDate: new Date().toISOString().split('T')[0],
            name: 'Salad ức gà mè rang',
            mealType: 'DINNER',
            mealTypeDisplayName: 'Bữa tối',
            totalCalories: 380,
            totalProtein: 25,
            totalCarbs: 15,
            totalFat: 10,
            healthTip: 'Bữa tối nhẹ nhàng ít tinh bột giúp hệ tiêu hóa nghỉ ngơi và hỗ trợ giấc ngủ sâu.',
            items: [
              { id: 5, name: 'Salad ức gà áp chảo', estimatedWeightGrams: 250, servingSize: '1 đĩa', calories: 320, protein: 23, carbs: 12, fat: 8 },
              { id: 6, name: 'Sốt mè rang Nhật', estimatedWeightGrams: 15, servingSize: '15ml', calories: 60, protein: 2, carbs: 3, fat: 2 }
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImagePreview(reader.result as string);
      setIsAiModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleQuickAddClick = (mealType: MealType) => {
    setTargetMealTypeForScan(mealType);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelected(file);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveMealFromAi = (mealData: any) => {
    if (!summary) return;

    const targetTypeConfig = MEAL_CATEGORIES.find(c => c.type === targetMealTypeForScan) || MEAL_CATEGORIES[1];

    const newMeal: Meal = {
      id: Date.now(),
      mealDate: new Date().toISOString().split('T')[0],
      name: mealData.name,
      mealType: targetMealTypeForScan,
      mealTypeDisplayName: `${targetTypeConfig.title} (AI Scan)`,
      totalCalories: mealData.totalCalories,
      totalProtein: mealData.totalProtein,
      totalCarbs: mealData.totalCarbs,
      totalFat: mealData.totalFat,
      healthTip: 'Món ăn do AI phân tích tự động đã được lưu thành công vào nhật ký.',
      items: mealData.items.map((item: any) => ({
        id: parseInt(item.id) || Date.now(),
        name: item.name,
        estimatedWeightGrams: item.grams,
        calories: Math.round((item.grams * item.caloriesPer100g) / 100),
        protein: Math.round((item.grams * item.proteinPer100g) / 100),
        carbs: Math.round((item.grams * item.carbsPer100g) / 100),
        fat: Math.round((item.grams * item.fatPer100g) / 100),
      })),
    };

    const updatedCalories = summary.totalCaloriesConsumed + mealData.totalCalories;
    setSummary({
      ...summary,
      totalCaloriesConsumed: updatedCalories,
      remainingCalories: Math.max(summary.calorieTarget - updatedCalories, 0),
      totalProteinConsumed: summary.totalProteinConsumed + mealData.totalProtein,
      totalCarbsConsumed: summary.totalCarbsConsumed + mealData.totalCarbs,
      totalFatConsumed: summary.totalFatConsumed + mealData.totalFat,
      mealCount: summary.mealCount + 1,
      meals: [newMeal, ...summary.meals],
    });
  };

  const handleDeleteMeal = (mealId?: number) => {
    if (!summary || !mealId) return;
    const mealToDelete = summary.meals.find(m => m.id === mealId);
    if (!mealToDelete) return;

    const updatedMeals = summary.meals.filter(m => m.id !== mealId);
    const updatedCalories = Math.max(summary.totalCaloriesConsumed - mealToDelete.totalCalories, 0);

    setSummary({
      ...summary,
      totalCaloriesConsumed: updatedCalories,
      remainingCalories: Math.max(summary.calorieTarget - updatedCalories, 0),
      totalProteinConsumed: Math.max(summary.totalProteinConsumed - mealToDelete.totalProtein, 0),
      totalCarbsConsumed: Math.max(summary.totalCarbsConsumed - mealToDelete.totalCarbs, 0),
      totalFatConsumed: Math.max(summary.totalFatConsumed - mealToDelete.totalFat, 0),
      mealCount: Math.max(summary.mealCount - 1, 0),
      meals: updatedMeals,
    });
  };

  const calorieTarget = summary?.calorieTarget || 2000;
  const consumedCalories = summary?.totalCaloriesConsumed || 0;
  const carbsTarget = summary?.carbsTargetGrams || 220;
  const consumedCarbs = summary?.totalCarbsConsumed || 0;
  const proteinTarget = summary?.proteinTargetGrams || 130;
  const consumedProtein = summary?.totalProteinConsumed || 0;
  const fatTarget = summary?.fatTargetGrams || 60;
  const consumedFat = summary?.totalFatConsumed || 0;
  const caloriePercent = Math.round((consumedCalories / calorieTarget) * 100);

  return (
    <div>
      {/* Hidden file input for fast meal addition */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        aria-label="Tải ảnh đĩa ăn nhanh"
      />

      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Tổng quan dinh dưỡng</h2>
          <p className="page-subtitle">Theo dõi tiến độ tiêu thụ năng lượng và tỷ lệ dinh dưỡng theo thời gian thực</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-bg-surface-subtle)',
            border: '1px solid var(--color-border-default)'
          }}>
            <Calendar size={14} color="var(--color-brand-primary)" />
            <span>Hôm nay: {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)' }}>
          Đang tải dữ liệu tổng quan hôm nay...
        </div>
      ) : (
        <>
          {/* Main Calorie & Macro Progress Card (Figma Specs) */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <DailyCalorieProgressCard
              consumedCalories={consumedCalories}
              calorieTarget={calorieTarget}
              consumedCarbs={consumedCarbs}
              carbsTarget={carbsTarget}
              consumedProtein={consumedProtein}
              proteinTarget={proteinTarget}
              consumedFat={consumedFat}
              fatTarget={fatTarget}
            />
          </div>

          {/* 4 Stat Cards */}
          <div className="stats-grid" style={{ marginBottom: 'var(--spacing-6)' }}>
            <StatCard
              title="Calories nạp vào"
              value={`${Math.round(consumedCalories)} kcal`}
              subtitle={`Mục tiêu: ${calorieTarget} kcal (${caloriePercent}%)`}
              progress={caloriePercent}
              color="var(--color-brand-primary)"
              icon="🔥"
            />

            <StatCard
              title="Protein (Chất đạm)"
              value={`${Math.round(consumedProtein)}g`}
              subtitle={`Mục tiêu: ${proteinTarget}g`}
              progress={(consumedProtein / proteinTarget) * 100}
              color="var(--color-macro-protein)"
              icon="🥩"
            />

            <StatCard
              title="Carbohydrates (Đường bột)"
              value={`${Math.round(consumedCarbs)}g`}
              subtitle={`Mục tiêu: ${carbsTarget}g`}
              progress={(consumedCarbs / carbsTarget) * 100}
              color="var(--color-macro-carbs)"
              icon="🍚"
            />

            <StatCard
              title="Fat (Chất béo)"
              value={`${Math.round(consumedFat)}g`}
              subtitle={`Mục tiêu: ${fatTarget}g`}
              progress={(consumedFat / fatTarget) * 100}
              color="var(--color-macro-fat)"
              icon="🥑"
            />
          </div>

          {/* Main Grid Section */}
          <div className="dashboard-layout">
            {/* Left Column: 4 Meal Category Cards (PRD US-002) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                  Nhật ký bữa ăn hôm nay ({summary?.meals?.length || 0} bữa)
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--color-brand-primary)', fontWeight: '600' }}>
                  Đồng bộ tự động AI
                </span>
              </div>

              {/* 4 Meal Category Groups */}
              {MEAL_CATEGORIES.map((category) => {
                const categoryMeals = summary?.meals?.filter(m => m.mealType === category.type) || [];
                const hasMeals = categoryMeals.length > 0;
                const catCalories = categoryMeals.reduce((sum, m) => sum + m.totalCalories, 0);
                const catProtein = categoryMeals.reduce((sum, m) => sum + m.totalProtein, 0);
                const catCarbs = categoryMeals.reduce((sum, m) => sum + m.totalCarbs, 0);
                const catFat = categoryMeals.reduce((sum, m) => sum + m.totalFat, 0);

                return (
                  <div key={category.type} className="card" style={{ padding: 'var(--spacing-5)' }}>
                    {/* Category Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: 'var(--spacing-3)',
                      borderBottom: '1px solid var(--color-border-default)',
                      marginBottom: 'var(--spacing-4)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '22px' }} aria-hidden="true">{category.icon}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                              {category.title}
                            </h4>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                              ({categoryMeals.length} món)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Calorie & Macro Subtotals */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {hasMeals ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-brand-primary)' }}>
                              {Math.round(catCalories)} kcal
                            </span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <MacroBadge type="protein" value={Math.round(catProtein)} unit="g" />
                              <MacroBadge type="carbs" value={Math.round(catCarbs)} unit="g" />
                              <MacroBadge type="fat" value={Math.round(catFat)} unit="g" />
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                            Chưa ghi nhận
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meal Items List or Empty State */}
                    {hasMeals ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {categoryMeals.map((meal) => (
                          <div
                            key={meal.id}
                            style={{
                              backgroundColor: 'var(--color-bg-surface-subtle)',
                              borderRadius: 'var(--radius-md)',
                              padding: '14px 16px',
                              border: '1px solid var(--color-border-default)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: 'var(--radius-md)',
                                  backgroundColor: 'var(--color-bg-surface)',
                                  border: '1px solid var(--color-border-default)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '20px',
                                  overflow: 'hidden',
                                  flexShrink: 0
                                }}>
                                  {meal.imageUrl ? (
                                    <img src={meal.imageUrl} alt={meal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <span>🍽️</span>
                                  )}
                                </div>
                                <div>
                                  <h5 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                    {meal.name}
                                  </h5>
                                  <p className="tabular-nums" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                                    {meal.items?.length || 0} thành phần • {meal.totalCalories} kcal
                                  </p>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMeal(meal.id)}
                                  className="btn-icon"
                                  title="Xóa bữa ăn"
                                  aria-label={`Xóa bữa ăn ${meal.name}`}
                                  style={{
                                    padding: '6px',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--color-text-muted)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 150ms ease, background-color 150ms ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--color-status-danger)';
                                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--color-text-muted)';
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Item breakdown pills */}
                            {meal.items && meal.items.length > 0 && (
                              <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '6px',
                                paddingTop: '8px',
                                borderTop: '1px dashed var(--color-border-default)'
                              }}>
                                {meal.items.map((it, idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      fontSize: '11px',
                                      padding: '3px 8px',
                                      borderRadius: 'var(--radius-sm)',
                                      backgroundColor: 'var(--color-bg-surface)',
                                      border: '1px solid var(--color-border-default)',
                                      color: 'var(--color-text-secondary)'
                                    }}
                                  >
                                    <strong>{it.name}</strong> ({it.estimatedWeightGrams || 100}g): <span className="tabular-nums">{it.calories} kcal</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Button to add more items to this category */}
                        <button
                          type="button"
                          onClick={() => handleQuickAddClick(category.type)}
                          className="btn btn-outline"
                          style={{
                            fontSize: '12px',
                            padding: '8px 14px',
                            alignSelf: 'flex-start',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <Plus size={14} />
                          <span>Thêm món vào {category.title}</span>
                        </button>
                      </div>
                    ) : (
                      /* Empty State for Meal Category */
                      <div
                        style={{
                          border: '1.5px dashed var(--color-border-default)',
                          borderRadius: 'var(--radius-md)',
                          padding: '24px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          gap: '10px',
                          backgroundColor: 'var(--color-bg-surface-subtle)',
                        }}
                      >
                        <Utensils size={28} style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                            Chưa có món ăn nào cho {category.title.toLowerCase()}
                          </p>
                          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                            Chụp hoặc quét ảnh đĩa ăn để AI phân tích calo tức thì
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickAddClick(category.type)}
                          className="btn btn-primary"
                          style={{
                            fontSize: '12px',
                            padding: '7px 14px',
                            borderRadius: 'var(--radius-md)',
                          }}
                        >
                          <Plus size={14} />
                          <span>+ Thêm món nhanh</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: AI Scan Dropzone + Weekly Trend Bar Chart + AI Nutrition Insights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* AI Quick Scan Dropzone Widget */}
              <div className="card" style={{ padding: 'var(--spacing-5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-3)' }}>
                  <Sparkles size={18} color="var(--color-brand-primary)" aria-hidden="true" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                    Quét món ăn bằng AI
                  </h3>
                </div>
                <AiScanDropzone
                  onImageSelected={handleImageSelected}
                />
              </div>

              {/* Weekly Calorie Mini Bar Chart (US-002) */}
              <WeeklyCalorieMiniChart
                targetCalories={calorieTarget}
              />

              {/* AI Health Advice Callout */}
              <div
                className="card"
                style={{
                  background: 'linear-gradient(145deg, var(--color-bg-surface) 0%, var(--color-brand-tint) 100%)',
                  borderColor: 'var(--color-brand-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Sparkles size={20} color="var(--color-brand-primary)" aria-hidden="true" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-brand-primary)' }}>
                    AI Nutrition Insights
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '20px' }} className="text-pretty">
                  {summary?.meals && summary.meals.length > 0 && summary.meals[0].healthTip
                    ? summary.meals[0].healthTip
                    : 'Hôm nay bạn đang kiểm soát dinh dưỡng rất tốt! Hãy tiếp tục duy trì lượng nước uống đầy đủ (2-2.5L) và phân bổ protein đều qua các bữa ăn chính.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Accessible AI Meal Review Modal */}
      <AiMealReviewModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        imagePreviewUrl={selectedImagePreview}
        onSaveMeal={handleSaveMealFromAi}
      />
    </div>
  );
};
