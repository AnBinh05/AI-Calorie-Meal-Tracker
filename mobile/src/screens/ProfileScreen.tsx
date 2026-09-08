import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ActivityLevel, Gender, Goal, HealthProfile } from '../types';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [age, setAge] = useState('25');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('65');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        if (res.data.age) setAge(String(res.data.age));
        if (res.data.heightCm) setHeight(String(res.data.heightCm));
        if (res.data.weightKg) setWeight(String(res.data.weightKg));
      }
    } catch (e) {
      console.warn('Chưa có hồ sơ sức khỏe');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await api.saveProfile({
        age: parseInt(age) || 25,
        gender: 'MALE' as Gender,
        heightCm: parseFloat(height) || 170,
        weightKg: parseFloat(weight) || 65,
        activityLevel: 'MODERATELY_ACTIVE' as ActivityLevel,
        goal: 'MAINTAIN' as Goal,
        dailyCalorieTarget: 2000,
        dailyProteinTargetGrams: 150,
        dailyCarbsTargetGrams: 225,
        dailyFatTargetGrams: 55,
      });

      if (res.success && res.data) {
        setProfile(res.data);
        Alert.alert('Thành công', 'Đã cập nhật chỉ số thể trạng và tính toán lại BMR/TDEE!');
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e.message || 'Không thể lưu hồ sơ');
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
          <View style={styles.metricsBox}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{profile.bmr} kcal</Text>
              <Text style={styles.metricLbl}>Chỉ số BMR</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{profile.tdee} kcal</Text>
              <Text style={styles.metricLbl}>Chỉ số TDEE</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: '#10b981' }]}>{profile.dailyCalorieTarget} kcal</Text>
              <Text style={styles.metricLbl}>Mục tiêu ngày</Text>
            </View>
          </View>
        )}

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Chỉ số thể trạng</Text>
          
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

          <CustomButton
            title="Tính toán & Cập nhật BMR/TDEE"
            onPress={handleSaveProfile}
            loading={saving}
            style={{ marginTop: 12 }}
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
  metricsBox: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  metricLbl: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
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
});
