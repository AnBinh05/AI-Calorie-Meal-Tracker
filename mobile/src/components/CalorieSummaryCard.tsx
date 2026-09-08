import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MacroProgressBar } from './MacroProgressBar';

interface CalorieSummaryCardProps {
  consumedCalories: number;
  targetCalories: number;
  consumedProtein: number;
  targetProtein: number;
  consumedCarbs: number;
  targetCarbs: number;
  consumedFat: number;
  targetFat: number;
}

export const CalorieSummaryCard: React.FC<CalorieSummaryCardProps> = ({
  consumedCalories,
  targetCalories,
  consumedProtein,
  targetProtein,
  consumedCarbs,
  targetCarbs,
  consumedFat,
  targetFat,
}) => {
  const remaining = Math.max(targetCalories - consumedCalories, 0);
  const caloriePercent = Math.min(Math.round((consumedCalories / (targetCalories || 1)) * 100), 100);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Mục tiêu hôm nay</Text>
      
      <View style={styles.calorieRow}>
        <View style={styles.circleContainer}>
          <Text style={styles.bigCalorie}>{Math.round(consumedCalories)}</Text>
          <Text style={styles.unitText}>kcal đã nạp</Text>
        </View>

        <View style={styles.statsColumn}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Mục tiêu</Text>
            <Text style={styles.statValue}>{targetCalories} kcal</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Còn lại</Text>
            <Text style={[styles.statValue, { color: '#10b981' }]}>{Math.round(remaining)} kcal</Text>
          </View>
        </View>
      </View>

      {/* Main Calorie Progress Bar */}
      <View style={styles.mainProgressTrack}>
        <View style={[styles.mainProgressFill, { width: `${caloriePercent}%` }]} />
      </View>

      {/* Macros Row */}
      <View style={styles.macrosRow}>
        <MacroProgressBar
          label="Đạm (Protein)"
          currentGrams={consumedProtein}
          targetGrams={targetProtein}
          color="#38bdf8"
        />
        <View style={{ width: 12 }} />
        <MacroProgressBar
          label="Đường bột (Carb)"
          currentGrams={consumedCarbs}
          targetGrams={targetCarbs}
          color="#facc15"
        />
        <View style={{ width: 12 }} />
        <MacroProgressBar
          label="Chất béo (Fat)"
          currentGrams={consumedFat}
          targetGrams={targetFat}
          color="#f43f5e"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  circleContainer: {
    alignItems: 'flex-start',
  },
  bigCalorie: {
    fontSize: 36,
    fontWeight: '900',
    color: '#10b981',
  },
  unitText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  statsColumn: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statItem: {
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
  },
  mainProgressTrack: {
    height: 10,
    backgroundColor: '#1e293b',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mainProgressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 5,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
});
