import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Meal } from '../types';

interface MealCardProps {
  meal: Meal;
  onPress?: () => void;
  onDelete?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onPress, onDelete }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{meal.mealTypeDisplayName || meal.mealType}</Text>
        </View>
        <Text style={styles.calorieText}>{Math.round(meal.totalCalories)} kcal</Text>
      </View>

      <View style={styles.contentRow}>
        {meal.imageUrl ? (
          <Image source={{ uri: meal.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderEmoji}>🥗</Text>
          </View>
        )}

        <View style={styles.details}>
          <Text style={styles.mealName} numberOfLines={1}>{meal.name}</Text>
          <Text style={styles.itemCount}>
            {meal.items?.length || 0} món • P: {Math.round(meal.totalProtein)}g • C: {Math.round(meal.totalCarbs)}g • F: {Math.round(meal.totalFat)}g
          </Text>
          {meal.healthTip ? (
            <Text style={styles.tipText} numberOfLines={2}>
              💡 {meal.healthTip}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  calorieText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10b981',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#0f172a',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 28,
  },
  details: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 11,
    color: '#a7f3d0',
    fontStyle: 'italic',
  },
});
