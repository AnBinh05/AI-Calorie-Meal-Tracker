import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { ActivityLevel, Gender, Goal, HealthProfile } from '../types';
import { Calculator, Check, RotateCcw } from 'lucide-react';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTRA_ACTIVE: 1.9,
};

const GOAL_OPTIONS: { value: Goal; title: string; badge: string; adjustment: number; desc: string }[] = [
  { value: 'LOSE_WEIGHT', title: 'Giảm mỡ', badge: '-500 kcal/ngày', adjustment: -500, desc: 'Thâm hụt an toàn ~0.5kg/tuần' },
  { value: 'MAINTAIN', title: 'Duy trì', badge: '0 kcal', adjustment: 0, desc: 'Cân bằng năng lượng TDEE' },
  { value: 'GAIN_WEIGHT', title: 'Tăng cơ', badge: '+500 kcal/ngày', adjustment: 500, desc: 'Thặng dư hỗ trợ phát triển cơ' },
];

function computeRecommendedMetrics(
  age: number,
  gender: Gender,
  heightCm: number,
  weightKg: number,
  activityLevel: ActivityLevel,
  goal: Goal
) {
  const safeHeightM = Math.max(heightCm, 50) / 100;
  const bmi = Math.round((weightKg / (safeHeightM * safeHeightM)) * 10) / 10;
  let bmiCategory = 'Bình thường';
  if (bmi < 18.5) bmiCategory = 'Thiếu cân';
  else if (bmi >= 25 && bmi < 30) bmiCategory = 'Thừa cân';
  else if (bmi >= 30) bmiCategory = 'Béo phì';

  const baseBmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = Math.round(gender === 'MALE' ? baseBmr + 5 : gender === 'FEMALE' ? baseBmr - 161 : baseBmr - 78);
  const tdee = Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.55));
  const adj = GOAL_OPTIONS.find((g) => g.value === goal)?.adjustment ?? 0;
  const recommendedCalories = Math.max(tdee + adj, 1200);
  return { bmi, bmiCategory, bmr, tdee, recommendedCalories };
}

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<Gender>('MALE');
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(65);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(62);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('MODERATELY_ACTIVE');
  const [goal, setGoal] = useState<Goal>('LOSE_WEIGHT');
  const [customCalories, setCustomCalories] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.getProfile();
      if (res.success && res.data) {
        const p = res.data;
        setProfile(p);
        if (p.age) setAge(p.age);
        if (p.gender) setGender(p.gender);
        if (p.heightCm) setHeightCm(p.heightCm);
        if (p.weightKg) setWeightKg(p.weightKg);
        if (p.targetWeightKg) setTargetWeightKg(p.targetWeightKg);
        if (p.activityLevel) setActivityLevel(p.activityLevel);
        if (p.goal) setGoal(p.goal);
        const loaded = computeRecommendedMetrics(
          p.age || 25,
          p.gender || 'MALE',
          p.heightCm || 170,
          p.weightKg || 65,
          p.activityLevel || 'MODERATELY_ACTIVE',
          p.goal || 'LOSE_WEIGHT'
        );
        setCustomCalories(p.dailyCalorieTarget && p.dailyCalorieTarget !== loaded.recommendedCalories ? p.dailyCalorieTarget : null);
      }
    } catch (e) {
      console.warn('Chưa có hồ sơ');
    }
  };

  const liveMetrics = useMemo(() => {
    const base = computeRecommendedMetrics(age, gender, heightCm, weightKg, activityLevel, goal);
    const effectiveCalories = customCalories !== null ? customCalories : base.recommendedCalories;

    return {
      ...base,
      effectiveCalories,
      proteinGrams: Math.round((effectiveCalories * 0.30) / 4),
      carbsGrams: Math.round((effectiveCalories * 0.45) / 4),
      fatGrams: Math.round((effectiveCalories * 0.25) / 9),
    };
  }, [age, gender, heightCm, weightKg, activityLevel, goal, customCalories]);

  const handleGoalSelect = (newGoal: Goal) => {
    setGoal(newGoal);
    setCustomCalories(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    try {
      setSaving(true);
      const targetCal = customCalories !== null ? customCalories : liveMetrics.recommendedCalories;
      const res = await api.saveProfile({
        age,
        gender,
        heightCm,
        weightKg,
        targetWeightKg,
        activityLevel,
        goal,
        customDailyCalorieTarget: customCalories !== null ? customCalories : undefined,
        dailyCalorieTarget: targetCal,
        dailyProteinTargetGrams: Math.round((targetCal * 0.30) / 4),
        dailyCarbsTargetGrams: Math.round((targetCal * 0.45) / 4),
        dailyFatTargetGrams: Math.round((targetCal * 0.25) / 9),
      });

      if (res.success && res.data) {
        setProfile(res.data);
        setSuccessMessage('Cập nhật hồ sơ sức khỏe và tính toán BMR / TDEE thành công!');
      }
    } catch (e) {
      alert('Không thể cập nhật hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Hồ sơ sức khỏe & BMR / TDEE</h2>
          <p className="page-subtitle">Thiết lập thông số thể trạng và mục tiêu dinh dưỡng theo công thức Mifflin-St Jeor</p>
        </div>
      </div>

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-brand-tint)',
            border: '1px solid var(--color-brand-primary)',
            color: 'var(--color-brand-primary)',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: 'var(--spacing-6)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={18} aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Goal Preset Cards */}
      <div
        role="radiogroup"
        aria-label="Chọn chiến lược mục tiêu thể trạng"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        {GOAL_OPTIONS.map((opt) => {
          const isSelected = goal === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleGoalSelect(opt.value)}
              className="card"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                padding: '16px',
                border: isSelected ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border-default)',
                backgroundColor: isSelected ? 'var(--color-brand-tint)' : 'var(--color-bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{opt.title}</span>
                <span className="badge badge-ai tabular-nums">{opt.badge}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{opt.desc}</span>
            </button>
          );
        })}
      </div>

      <div className="dashboard-layout">
        {/* Form Card */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Chỉ số cơ thể & Tùy chỉnh Calo</h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="profile-age" className="form-label">Tuổi</label>
                <input
                  id="profile-age"
                  type="number"
                  className="form-input tabular-nums"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                  min={10}
                  max={120}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-gender" className="form-label">Giới tính</label>
                <select
                  id="profile-gender"
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="form-group">
                <label htmlFor="profile-height" className="form-label">Chiều cao (cm)</label>
                <input
                  id="profile-height"
                  type="number"
                  className="form-input tabular-nums"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseFloat(e.target.value) || 160)}
                  min={50}
                  max={250}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-weight" className="form-label">Cân nặng (kg)</label>
                <input
                  id="profile-weight"
                  type="number"
                  className="form-input tabular-nums"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 60)}
                  min={20}
                  max={300}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-target-weight" className="form-label">Mục tiêu (kg)</label>
                <input
                  id="profile-target-weight"
                  type="number"
                  className="form-input tabular-nums"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(parseFloat(e.target.value) || 60)}
                  min={20}
                  max={300}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profile-activity" className="form-label">Mức độ vận động</label>
              <select
                id="profile-activity"
                className="form-select"
                value={activityLevel}
                onChange={(e) => {
                  setActivityLevel(e.target.value as ActivityLevel);
                  setCustomCalories(null);
                }}
              >
                <option value="SEDENTARY">Ít vận động (làm việc văn phòng — x1.2)</option>
                <option value="LIGHTLY_ACTIVE">Vận động nhẹ (tập luyện 1-3 ngày/tuần — x1.375)</option>
                <option value="MODERATELY_ACTIVE">Vận động vừa (tập luyện 3-5 ngày/tuần — x1.55)</option>
                <option value="VERY_ACTIVE">Vận động nhiều (tập luyện 6-7 ngày/tuần — x1.725)</option>
                <option value="EXTRA_ACTIVE">Vận động cực nhiều (vận động viên — x1.9)</option>
              </select>
            </div>

            {/* Interactive Calorie Slider */}
            <div className="form-group" style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-surface-subtle)', border: '1px solid var(--color-border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label htmlFor="calorie-target-slider" className="form-label" style={{ marginBottom: 0 }}>
                  Thanh điều chỉnh Calo mục tiêu
                </label>
                <span className="tabular-nums" style={{ fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                  {liveMetrics.effectiveCalories.toLocaleString()} kcal/ngày
                </span>
              </div>
              <input
                id="calorie-target-slider"
                type="range"
                min={1200}
                max={4000}
                step={50}
                value={liveMetrics.effectiveCalories}
                onChange={(e) => setCustomCalories(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-brand-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                <span>1,200 kcal</span>
                {customCalories !== null && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: '2px 8px', fontSize: '11px', color: 'var(--color-brand-primary)' }}
                    onClick={() => setCustomCalories(null)}
                  >
                    <RotateCcw size={12} aria-hidden="true" />
                    Khôi phục chuẩn ({liveMetrics.recommendedCalories.toLocaleString()} kcal)
                  </button>
                )}
                <span>4,000 kcal</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
              disabled={saving}
              aria-busy={saving}
            >
              <Calculator size={16} aria-hidden="true" />
              {saving ? 'Đang tính toán...' : 'Lưu mục tiêu & Cập nhật hồ sơ'}
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ background: 'var(--color-bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Kết quả tính toán y khoa (Xem trước)</h3>
              {profile?.updatedAt && (
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Đã lưu: {new Date(profile.updatedAt).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border-default)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Chỉ số BMI</span>
                <span className="tabular-nums" style={{ fontWeight: '800', color: 'var(--color-brand-primary)' }}>
                  {liveMetrics.bmi} ({liveMetrics.bmiCategory})
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border-default)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Năng lượng trao đổi chất (BMR)</span>
                <span className="tabular-nums" style={{ fontWeight: '800' }}>{liveMetrics.bmr} kcal</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border-default)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Tổng tiêu hao hàng ngày (TDEE)</span>
                <span className="tabular-nums" style={{ fontWeight: '800' }}>{liveMetrics.tdee} kcal</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-brand-tint)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--color-brand-primary)', fontWeight: '700' }}>Mục tiêu Calories áp dụng</span>
                <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-brand-primary)' }}>
                  {liveMetrics.effectiveCalories} kcal
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>Mục tiêu phân bổ Macronutrients</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-macro-protein)', fontWeight: '600' }}>Protein (Đạm - 30%):</span>
                <span className="tabular-nums" style={{ fontWeight: '700' }}>{liveMetrics.proteinGrams}g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-macro-carbs)', fontWeight: '600' }}>Carbohydrates (Đường bột - 45%):</span>
                <span className="tabular-nums" style={{ fontWeight: '700' }}>{liveMetrics.carbsGrams}g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-macro-fat)', fontWeight: '600' }}>Fat (Chất béo - 25%):</span>
                <span className="tabular-nums" style={{ fontWeight: '700' }}>{liveMetrics.fatGrams}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
