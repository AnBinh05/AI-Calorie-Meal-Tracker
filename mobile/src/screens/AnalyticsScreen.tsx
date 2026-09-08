import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { api } from '../services/api';
import { DailySummary } from '../types';

export const AnalyticsScreen = () => {
  const [summary, setSummary] = useState<DailySummary | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.getDailySummary();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Thống kê dinh dưỡng</Text>
          <Text style={styles.subtitle}>Theo dõi xu hướng và sự phân bổ các nhóm chất</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Phân bổ Macro hôm nay</Text>
          
          <View style={styles.macroStatRow}>
            <View style={[styles.macroBadge, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Text style={[styles.macroBadgeText, { color: '#38bdf8' }]}>Protein (Đạm)</Text>
              <Text style={styles.macroValue}>{Math.round(summary?.totalProteinConsumed || 0)}g</Text>
              <Text style={styles.macroTarget}>Mục tiêu: {summary?.proteinTargetGrams || 150}g</Text>
            </View>

            <View style={[styles.macroBadge, { backgroundColor: 'rgba(250, 204, 21, 0.15)' }]}>
              <Text style={[styles.macroBadgeText, { color: '#facc15' }]}>Carbohydrate</Text>
              <Text style={styles.macroValue}>{Math.round(summary?.totalCarbsConsumed || 0)}g</Text>
              <Text style={styles.macroTarget}>Mục tiêu: {summary?.carbsTargetGrams || 225}g</Text>
            </View>

            <View style={[styles.macroBadge, { backgroundColor: 'rgba(244, 63, 94, 0.15)' }]}>
              <Text style={[styles.macroBadgeText, { color: '#f43f5e' }]}>Chất béo (Fat)</Text>
              <Text style={styles.macroValue}>{Math.round(summary?.totalFatConsumed || 0)}g</Text>
              <Text style={styles.macroTarget}>Mục tiêu: {summary?.fatTargetGrams || 55}g</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📊 Xem báo cáo chuyên sâu trên Web Dashboard</Text>
          <Text style={styles.infoText}>
            Truy cập giao diện Web Dashboard trên máy tính để xem biểu đồ xu hướng 7 ngày, 30 ngày và xuất báo cáo PDF / CSV hoàn chỉnh!
          </Text>
        </View>
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
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 16,
  },
  macroStatRow: {
    gap: 12,
  },
  macroBadge: {
    padding: 16,
    borderRadius: 14,
  },
  macroBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  macroValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    marginVertical: 4,
  },
  macroTarget: {
    fontSize: 12,
    color: '#94a3b8',
  },
  infoBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
});
