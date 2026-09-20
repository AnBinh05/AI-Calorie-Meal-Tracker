import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ActivityLevel, Gender, Goal, HealthProfile } from '../types';
import { Calculator, Check } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<Gender>('MALE');
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(65);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(62);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('MODERATELY_ACTIVE');
  const [goal, setGoal] = useState<Goal>('LOSE_WEIGHT');
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
      }
    } catch (e) {
      console.warn('Chưa có hồ sơ');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    try {
      setSaving(true);
      const res = await api.saveProfile({
        age,
        gender,
        heightCm,
        weightKg,
        targetWeightKg,
        activityLevel,
        goal,
        dailyCalorieTarget: 2000,
        dailyProteinTargetGrams: 150,
        dailyCarbsTargetGrams: 225,
        dailyFatTargetGrams: 55,
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
          <p className="page-subtitle">Thiết lập thông số thể trạng để tự động tính toán nhu cầu năng lượng hàng ngày</p>
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

      <div className="dashboard-layout">
        {/* Form Card */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Chỉ số cơ thể</h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="profile-age" className="form-label">Tuổi</label>
                <input
                  id="profile-age"
                  type="number"
                  className="form-input"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="profile-height" className="form-label">Chiều cao (cm)</label>
                <input
                  id="profile-height"
                  type="number"
                  className="form-input"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseFloat(e.target.value) || 160)}
                  min={50}
                  max={250}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-weight" className="form-label">Cân nặng hiện tại (kg)</label>
                <input
                  id="profile-weight"
                  type="number"
                  className="form-input"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 60)}
                  min={20}
                  max={300}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profile-activity" className="form-label">Mức độ vận động</label>
              <select
                id="profile-activity"
                className="form-select"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              >
                <option value="SEDENTARY">Ít vận động (làm việc văn phòng)</option>
                <option value="LIGHTLY_ACTIVE">Vận động nhẹ (tập luyện 1-3 ngày/tuần)</option>
                <option value="MODERATELY_ACTIVE">Vận động vừa (tập luyện 3-5 ngày/tuần)</option>
                <option value="VERY_ACTIVE">Vận động nhiều (tập luyện 6-7 ngày/tuần)</option>
                <option value="EXTRA_ACTIVE">Vận động cực nhiều (vận động viên chuyên nghiệp)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="profile-goal" className="form-label">Mục tiêu thể trạng</label>
              <select
                id="profile-goal"
                className="form-select"
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
              >
                <option value="LOSE_WEIGHT">Giảm mỡ (Thâm hụt calo an toàn -400 kcal/ngày)</option>
                <option value="MAINTAIN">Duy trì vóc dáng (Giữ nguyên mức tiêu hao TDEE)</option>
                <option value="GAIN_WEIGHT">Tăng cơ (Thặng dư năng lượng +300 kcal/ngày)</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
              disabled={saving}
              aria-busy={saving}
            >
              <Calculator size={16} aria-hidden="true" />
              {saving ? 'Đang tính toán...' : 'Tính toán lại BMR, TDEE & Lưu mục tiêu'}
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ background: 'var(--color-bg-surface)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Kết quả tính toán y khoa</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border-default)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Chỉ số BMI</span>
                <span className="tabular-nums" style={{ fontWeight: '800', color: 'var(--color-brand-primary)' }}>
                  {profile?.bmi || '22.5'} ({profile?.bmiCategory || 'Bình thường'})
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border-default)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Năng lượng trao đổi chất (BMR)</span>
                <span className="tabular-nums" style={{ fontWeight: '800' }}>{profile?.bmr || 1550} kcal</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border-default)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Tổng tiêu hao hàng ngày (TDEE)</span>
                <span className="tabular-nums" style={{ fontWeight: '800' }}>{profile?.tdee || 2400} kcal</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--color-brand-tint)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--color-brand-primary)', fontWeight: '700' }}>Mục tiêu Calories khuyến nghị</span>
                <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-brand-primary)' }}>
                  {profile?.dailyCalorieTarget || 1900} kcal
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>Mục tiêu phân bổ Macronutrients</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-macro-protein)', fontWeight: '600' }}>Protein (Đạm - 30%):</span>
                <span className="tabular-nums" style={{ fontWeight: '700' }}>{profile?.dailyProteinTargetGrams || 142}g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-macro-carbs)', fontWeight: '600' }}>Carbohydrates (Đường bột - 45%):</span>
                <span className="tabular-nums" style={{ fontWeight: '700' }}>{profile?.dailyCarbsTargetGrams || 213}g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-macro-fat)', fontWeight: '600' }}>Fat (Chất béo - 25%):</span>
                <span className="tabular-nums" style={{ fontWeight: '700' }}>{profile?.dailyFatTargetGrams || 53}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
