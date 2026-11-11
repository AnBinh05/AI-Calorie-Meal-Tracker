import React, { useState, useEffect, useRef } from 'react';
import { StatCard } from '../components/StatCard';
import { DailyCalorieProgressCard } from '../components/DailyCalorieProgressCard';
import { AiScanDropzone } from '../components/AiScanDropzone';
import { AiMealReviewModal } from '../components/AiMealReviewModal';
import { WeeklyCalorieMiniChart, DayCalorieData } from '../components/WeeklyCalorieMiniChart';
import { MacroBadge } from '../components/MacroBadge';
import { FavoriteMealsQuickWidget } from '../components/FavoriteMealsQuickWidget';
import { api } from '../services/api';
import { DailySummary, Meal, MealType, MealAnalysisResponse, CreateMealRequest, MealItem } from '../types';
import { toLocalISODate, shiftISODate } from '../utils/formatters';
import { Sparkles, Utensils, Plus, Trash2, Calendar, Heart, ChevronLeft, ChevronRight, RefreshCw, Pencil } from 'lucide-react';

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

interface DashboardPageProps {
  onNavigateToFavorites?: () => void;
}

const SHORT_WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const FULL_WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function mapDailySummariesToWeeklyChart(summaries: DailySummary[], referenceDate: string): DayCalorieData[] {
  const todayStr = toLocalISODate();
  return summaries.map((item) => {
    const [y, m, d] = item.date.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    const dow = dt.getDay();
    const isToday = item.date === todayStr;
    const isSelected = item.date === referenceDate;
    return {
      day: SHORT_WEEKDAYS[dow],
      fullDayName: isToday ? `${FULL_WEEKDAYS[dow]} (Hôm nay)` : FULL_WEEKDAYS[dow],
      date: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`,
      calories: Math.round(item.totalCaloriesConsumed || 0),
      isToday: isSelected,
    };
  });
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateToFavorites }) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => toLocalISODate());
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [weeklyData, setWeeklyData] = useState<DayCalorieData[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ai' | 'manual' | 'edit'>('ai');
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSavingMeal, setIsSavingMeal] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<MealAnalysisResponse | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string>('');
  const [targetMealTypeForScan, setTargetMealTypeForScan] = useState<MealType>('LUNCH');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDashboardData(selectedDate);
  }, [selectedDate]);

  const fetchDashboardData = async (dateStr: string = selectedDate) => {
    try {
      setLoading(true);
      setLoadError(null);
      const startDate = shiftISODate(dateStr, -6);
      const [dailyRes, rangeRes] = await Promise.all([
        api.getDailySummary(dateStr),
        api.getRangeSummary(startDate, dateStr).catch(() => null),
      ]);

      if (dailyRes.success && dailyRes.data) {
        setSummary(dailyRes.data);
      } else {
        throw new Error(dailyRes.message || 'Không thể tải dữ liệu ngày');
      }

      if (rangeRes?.success && rangeRes.data?.dailySummaries?.length) {
        setWeeklyData(mapDailySummariesToWeeklyChart(rangeRes.data.dailySummaries, dateStr));
      }
    } catch (e: any) {
      const isOfflineDemo = localStorage.getItem('ai_calorie_token') === 'mock_jwt_token_demo_nutriai';
      if (isOfflineDemo) {
        // Fallback realistic Figma spec mock data for offline Demo mode only
        setSummary({
          date: dateStr,
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
              mealDate: dateStr,
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
              mealDate: dateStr,
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
              mealDate: dateStr,
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
        setWeeklyData(undefined);
      } else {
        setLoadError(e?.response?.data?.message || e?.message || 'Không thể kết nối máy chủ Backend để tải dữ liệu.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelected = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setSelectedImagePreview(localUrl);
    setIsAnalyzing(true);

    try {
      const res = await api.analyzeMealImage(file);
      if (res.success && res.data) {
        setEditingMeal(null);
        setModalMode('ai');
        setAiAnalysisResult(res.data);
        if (res.data.imageUrl) {
          setSelectedImagePreview(res.data.imageUrl);
        }
        setIsAiModalOpen(true);
      } else {
        alert(res.message || 'Không thể phân tích ảnh món ăn');
      }
    } catch (err: any) {
      console.error('Lỗi khi phân tích ảnh AI:', err);
      const errMsg = err.response?.data?.message || err.message || 'Lỗi kết nối máy chủ AI';
      alert('Lỗi phân tích AI: ' + errMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenManualModal = (mealType: MealType) => {
    setEditingMeal(null);
    setModalMode('manual');
    setTargetMealTypeForScan(mealType);
    setSelectedImagePreview('');
    setAiAnalysisResult(null);
    setIsAiModalOpen(true);
  };

  const handleOpenEditModal = (meal: Meal) => {
    setEditingMeal(meal);
    setModalMode('edit');
    setTargetMealTypeForScan(meal.mealType);
    setSelectedImagePreview(meal.imageUrl || '');
    setAiAnalysisResult(null);
    setIsAiModalOpen(true);
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

  const handleSaveMealFromAi = async (mealData: {
    name: string;
    mealType: MealType;
    healthTip?: string;
    items: MealItem[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }) => {
    try {
      setIsSavingMeal(true);
      const payload: CreateMealRequest = {
        mealDate: editingMeal?.mealDate || selectedDate,
        mealType: mealData.mealType,
        name: mealData.name,
        imageUrl: editingMeal ? editingMeal.imageUrl : (aiAnalysisResult?.imageUrl || selectedImagePreview || undefined),
        healthTip: mealData.healthTip || aiAnalysisResult?.healthTip || editingMeal?.healthTip,
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
        setIsAiModalOpen(false);
        setEditingMeal(null);
        // Tải lại dữ liệu tổng quan thật từ CSDL backend
        await fetchDashboardData(selectedDate);
      } else {
        alert(res.message || 'Không thể lưu bữa ăn');
      }
    } catch (err: any) {
      console.error('Lỗi khi lưu bữa ăn:', err);
      const errMsg = err.response?.data?.message || err.message || 'Lỗi lưu bữa ăn';
      alert('Không thể lưu bữa ăn: ' + errMsg);
    } finally {
      setIsSavingMeal(false);
    }
  };

  const handleDeleteMeal = async (mealId?: number) => {
    if (!summary || !mealId) return;
    if (confirm('Bạn có chắc chắn muốn xóa bữa ăn này khỏi nhật ký?')) {
      try {
        await api.deleteMeal(mealId);
        await fetchDashboardData();
      } catch (err: any) {
        console.error('Lỗi khi xóa bữa ăn:', err);
        // Fallback cập nhật state nếu là dữ liệu mock
        const mealToDelete = summary.meals.find((m) => m.id === mealId);
        if (!mealToDelete) return;

        const updatedMeals = summary.meals.filter((m) => m.id !== mealId);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '6px 10px' }}
            onClick={() => setSelectedDate((prev) => shiftISODate(prev, -1))}
            aria-label="Xem ngày trước"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>

          <label htmlFor="dashboard-date-picker" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
            Chọn ngày xem nhật ký
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--color-brand-primary)" aria-hidden="true" />
            <input
              id="dashboard-date-picker"
              type="date"
              className="form-input"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
            />
          </div>

          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '6px 10px' }}
            onClick={() => setSelectedDate((prev) => shiftISODate(prev, 1))}
            aria-label="Xem ngày tiếp theo"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>

          {selectedDate !== toLocalISODate() && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={() => setSelectedDate(toLocalISODate())}
            >
              Hôm nay
            </button>
          )}
        </div>
      </div>

      {loadError && (
        <div
          role="alert"
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--color-status-danger)',
            color: 'var(--color-status-danger)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-5)',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{loadError}</span>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => fetchDashboardData(selectedDate)}
          >
            <RefreshCw size={14} aria-hidden="true" />
            Thử lại
          </button>
        </div>
      )}

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

                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span className={`badge ${meal.imageUrl ? 'badge-ai' : 'badge-manual'}`} style={{ marginRight: '4px' }}>
                                  {meal.imageUrl ? '✨ AI Scan' : '✍️ Thủ công'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(meal)}
                                  className="btn-icon"
                                  title="Chỉnh sửa bữa ăn"
                                  aria-label={`Chỉnh sửa bữa ăn ${meal.name}`}
                                  style={{
                                    padding: '6px',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--color-text-muted)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Pencil size={15} aria-hidden="true" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleBookmarkFavorite(meal.id, meal.name)}
                                  className="btn-icon"
                                  title="Lưu thành món ăn yêu thích"
                                  aria-label={`Lưu món "${meal.name}" vào danh sách yêu thích`}
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
                                    e.currentTarget.style.color = '#ec4899';
                                    e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--color-text-muted)';
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <Heart size={16} />
                                </button>
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
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => handleQuickAddClick(category.type)}
                            className="btn btn-outline"
                            style={{
                              fontSize: '12px',
                              padding: '8px 14px',
                              borderRadius: 'var(--radius-md)'
                            }}
                          >
                            <Plus size={14} />
                            <span>Quét AI vào {category.title}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenManualModal(category.type)}
                            className="btn btn-ghost"
                            style={{
                              fontSize: '12px',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-md)'
                            }}
                          >
                            <span>✍️ Nhập thủ công</span>
                          </button>
                        </div>
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
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
                            <span>Quét AI</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenManualModal(category.type)}
                            className="btn btn-outline"
                            style={{
                              fontSize: '12px',
                              padding: '7px 14px',
                              borderRadius: 'var(--radius-md)',
                            }}
                          >
                            <span>✍️ Nhập thủ công</span>
                          </button>
                        </div>
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
                  isLoading={isAnalyzing}
                />
              </div>

              {/* Quick Log Favorite Meals Widget */}
              <FavoriteMealsQuickWidget
                selectedDate={selectedDate}
                onMealLogged={() => fetchDashboardData(selectedDate)}
                onNavigateToFavorites={onNavigateToFavorites}
              />

              {/* Weekly Calorie Mini Bar Chart (US-002) */}
              <WeeklyCalorieMiniChart
                targetCalories={calorieTarget}
                data={weeklyData}
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

      {/* Accessible AI Meal Review / Edit / Manual Modal */}
      <AiMealReviewModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setEditingMeal(null);
        }}
        mode={modalMode}
        imagePreviewUrl={selectedImagePreview}
        initialMealName={editingMeal ? editingMeal.name : aiAnalysisResult?.suggestedMealName}
        initialMealType={editingMeal ? editingMeal.mealType : targetMealTypeForScan}
        initialItems={editingMeal ? editingMeal.items : aiAnalysisResult?.recognizedItems}
        healthTip={editingMeal ? editingMeal.healthTip : aiAnalysisResult?.healthTip}
        onSaveMeal={handleSaveMealFromAi}
        isSaving={isSavingMeal}
      />
    </div>
  );
};
