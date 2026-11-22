import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ActivityLevel, Gender, Goal, HealthProfile } from '../types';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' },
];

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; factor: string }[] = [
  { value: 'SEDENTARY', label: 'Ít vận động', factor: 'x1.2' },
  { value: 'LIGHTLY_ACTIVE', label: 'Nhẹ (1-3b/tuần)', factor: 'x1.375' },
  { value: 'MODERATELY_ACTIVE', label: 'Vừa (3-5b/tuần)', factor: 'x1.55' },
  { value: 'VERY_ACTIVE', label: 'Nhiều (6-7b/tuần)', factor: 'x1.725' },
  { value: 'EXTRA_ACTIVE', label: 'Cường độ cao', factor: 'x1.9' },
];

const GOAL_OPTIONS: { value: Goal; label: string; badge: string }[] = [
  { value: 'LOSE_WEIGHT', label: 'Giảm mỡ', badge: '-500 kcal' },
  { value: 'MAINTAIN', label: 'Giữ cân', badge: '0 kcal' },
  { value: 'GAIN_WEIGHT', label: 'Tăng cơ', badge: '+500 kcal' },
];

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState<Gender>('MALE');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('65');
  const [targetWeight, setTargetWeight] = useState('62');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('MODERATELY_ACTIVE');
  const [goal, setGoal] = useState<Goal>('MAINTAIN');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.getProfile();
      if (res.success && res.data) {
        const p = res.data;
        setProfile(p);
        if (p.age) setAge(String(p.age));
        if (p.gender) setGender(p.gender);
        if (p.heightCm) setHeight(String(p.heightCm));
        if (p.weightKg) setWeight(String(p.weightKg));
        if (p.targetWeightKg) setTargetWeight(String(p.targetWeightKg));
        if (p.activityLevel) setActivityLevel(p.activityLevel);
        if (p.goal) setGoal(p.goal);
      }
    } catch (e) {
      console.warn('Chưa có hồ sơ sức khỏe');
    }
  };

  const handleSaveProfile = async () => {
    const parsedAge = parseInt(age, 10);
    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);
    const parsedTargetWeight = parseFloat(targetWeight);

    if (!parsedAge || parsedAge < 10 || parsedAge > 120) {
      Alert.alert('Lỗi', 'Tuổi phải nằm trong khoảng 10 - 120');
      return;
    }
    if (!parsedHeight || parsedHeight < 50 || parsedHeight > 250) {
      Alert.alert('Lỗi', 'Chiều cao phải nằm trong khoảng 50 - 250 cm');
      return;
    }
    if (!parsedWeight || parsedWeight < 20 || parsedWeight > 300) {
      Alert.alert('Lỗi', 'Cân nặng phải nằm trong khoảng 20 - 300 kg');
      return;
    }

    try {
      setSaving(true);
      const res = await api.saveProfile({
        age: parsedAge,
        gender,
        heightCm: parsedHeight,
        weightKg: parsedWeight,
        targetWeightKg: parsedTargetWeight || undefined,
        activityLevel,
        goal,
        dailyCalorieTarget: profile?.dailyCalorieTarget || 2000,
        dailyProteinTargetGrams: profile?.dailyProteinTargetGrams || 150,
        dailyCarbsTargetGrams: profile?.dailyCarbsTargetGrams || 225,
        dailyFatTargetGrams: profile?.dailyFatTargetGrams || 55,
      });

      if (res.success && res.data) {
        setProfile(res.data);
        Alert.alert('Thành công', 'Đã cập nhật chỉ số thể trạng và tính toán lại BMR/TDEE!');
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e.response?.data?.message || e.message || 'Không thể lưu hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {profile && profile.tdee && (
          <View style={styles.metricsWrapper}>
            <View style={styles.metricsBox}>
              <View style={styles.metricItem}>
                <Text style={styles.metricVal}>{profile.bmi ?? '--'}</Text>
                <Text style={styles.metricLbl}>BMI</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricVal}>{profile.bmr}</Text>
                <Text style={styles.metricLbl}>BMR (kcal)</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricVal}>{profile.tdee}</Text>
                <Text style={styles.metricLbl}>TDEE (kcal)</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricVal, { color: '#10b981' }]}>{profile.dailyCalorieTarget}</Text>
                <Text style={styles.metricLbl}>Mục tiêu</Text>
              </View>
            </View>
            <View style={styles.macroTargetsRow}>
              <Text style={[styles.macroTargetPill, { color: '#3b82f6' }]}>
                Protein: {profile.dailyProteinTargetGrams}g
              </Text>
              <Text style={[styles.macroTargetPill, { color: '#f59e0b' }]}>
                Carbs: {profile.dailyCarbsTargetGrams}g
              </Text>
              <Text style={[styles.macroTargetPill, { color: '#ec4899' }]}>
                Fat: {profile.dailyFatTargetGrams}g
              </Text>
            </View>
          </View>
        )}

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Chỉ số thể trạng & Mục tiêu</Text>

          <Text style={styles.sectionLabel}>Giới tính</Text>
          <View style={styles.chipRow}>
            {GENDER_OPTIONS.map((opt) => {
              const active = gender === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setGender(opt.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <CustomInput
            label="Tuổi"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          <CustomInput
            label="Chiều cao (cm)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />

          <CustomInput
            label="Cân nặng hiện tại (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />

          <CustomInput
            label="Cân nặng mục tiêu (kg)"
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="numeric"
          />

          <Text style={styles.sectionLabel}>Mức độ vận động</Text>
          <View style={styles.chipWrap}>
            {ACTIVITY_OPTIONS.map((opt) => {
              const active = activityLevel === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.activityChip, active && styles.chipActive]}
                  onPress={() => setActivityLevel(opt.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {opt.label} ({opt.factor})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Mục tiêu thể hình</Text>
          <View style={styles.chipRow}>
            {GOAL_OPTIONS.map((opt) => {
              const active = goal === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setGoal(opt.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
                  <Text style={[styles.goalBadge, active && styles.chipTextActive]}>{opt.badge}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <CustomButton
            title="Tính toán & Cập nhật BMR/TDEE"
            onPress={handleSaveProfile}
            loading={saving}
            style={{ marginTop: 14 }}
          />
        </View>

        <CustomButton
          title="Đăng xuất"
          variant="outline"
          onPress={logout}
          style={{ marginTop: 16, borderColor: '#ef4444' }}
          textStyle={{ color: '#ef4444' }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  userCard: {
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  userEmail: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  metricsWrapper: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
    gap: 12,
  },
  metricsBox: {
    flexDirection: 'row',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
    fontVariant: ['tabular-nums'],
  },
  metricLbl: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  macroTargetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  macroTargetPill: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  formCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 12,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  activityChip: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipActive: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  chipTextActive: {
    color: '#34d399',
    fontWeight: '700',
  },
  goalBadge: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
});
