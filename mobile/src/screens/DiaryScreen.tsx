import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { CalorieSummaryCard } from '../components/CalorieSummaryCard';
import { MealCard } from '../components/MealCard';
import { api } from '../services/api';
import { DailySummary, Meal } from '../types';

export const DiaryScreen = ({ navigation }: any) => {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDailyData = useCallback(async () => {
    try {
      const res = await api.getDailySummary();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (e: any) {
      console.warn('Lỗi khi tải dữ liệu nhật ký:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDailyData();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDailyData();
    });
    return unsubscribe;
  }, [navigation, fetchDailyData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDailyData();
  };

  const handleDeleteMeal = async (id: number) => {
    Alert.alert('Xóa bữa ăn', 'Bạn có chắc chắn muốn xóa bữa ăn này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteMeal(id);
            fetchDailyData();
          } catch (e: any) {
            Alert.alert('Lỗi', 'Không thể xóa bữa ăn');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hôm nay</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.scanQuickBtn}
            onPress={() => navigation.navigate('CameraTab')}
          >
            <Text style={styles.scanQuickText}>📸 Chụp bữa ăn</Text>
          </TouchableOpacity>
        </View>

        {summary && (
          <CalorieSummaryCard
            consumedCalories={summary.totalCaloriesConsumed || 0}
            targetCalories={summary.calorieTarget || 2000}
            consumedProtein={summary.totalProteinConsumed || 0}
            targetProtein={summary.proteinTargetGrams || 150}
            consumedCarbs={summary.totalCarbsConsumed || 0}
            targetCarbs={summary.carbsTargetGrams || 225}
            consumedFat={summary.totalFatConsumed || 0}
            targetFat={summary.fatTargetGrams || 55}
          />
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Các bữa ăn đã ghi nhận ({summary?.meals?.length || 0})</Text>
        </View>

        {summary?.meals && summary.meals.length > 0 ? (
          summary.meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() => {
                Alert.alert(
                  meal.name || 'Chi tiết bữa ăn',
                  `Tổng calories: ${Math.round(meal.totalCalories)} kcal\nProtein: ${Math.round(meal.totalProtein)}g\nCarbs: ${Math.round(meal.totalCarbs)}g\nFat: ${Math.round(meal.totalFat)}g\n\nDanh sách món:\n` +
                    meal.items.map((i) => `• ${i.name}: ${Math.round(i.calories)} kcal (${i.estimatedWeightGrams || 0}g)`).join('\n'),
                  [
                    { text: 'Đóng', style: 'cancel' },
                    { text: 'Xóa bữa ăn', style: 'destructive', onPress: () => handleDeleteMeal(meal.id!) },
                  ]
                );
              }}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>Chưa có bữa ăn nào hôm nay</Text>
            <Text style={styles.emptySubtitle}>
              Chụp ảnh đĩa thức ăn của bạn để Gemini AI tự động phân tích calo và macros!
            </Text>
          </View>
        )}
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
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f8fafc',
  },
  dateText: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  scanQuickBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  scanQuickText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  emptyContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    borderStyle: 'dashed',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
