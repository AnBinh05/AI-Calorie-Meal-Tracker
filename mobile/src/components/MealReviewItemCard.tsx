import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MealItem } from '../types';

interface MealReviewItemCardProps {
  item: MealItem;
  index: number;
  onUpdateWeight: (index: number, gramsStr: string) => void;
  onRemove: (index: number) => void;
}

export const MealReviewItemCard: React.FC<MealReviewItemCardProps> = ({
  item,
  index,
  onUpdateWeight,
  onRemove,
}) => {
  return (
    <View style={styles.itemRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemNutri}>
          {Math.round(item.calories)} kcal • P: {Math.round(item.protein || 0)}g • C: {Math.round(item.carbs || 0)}g • F: {Math.round(item.fat || 0)}g
        </Text>
      </View>

      <View style={styles.weightEditBox}>
        <TextInput
          style={styles.weightInput}
          keyboardType="numeric"
          defaultValue={item.estimatedWeightGrams ? String(item.estimatedWeightGrams) : '100'}
          onEndEditing={(e) => onUpdateWeight(index, e.nativeEvent.text)}
        />
        <Text style={styles.unitText}>g</Text>
      </View>

      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => onRemove(index)}
        accessibilityLabel={`Xóa món ${item.name}`}
        accessibilityRole="button"
      >
        <Text style={styles.removeBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
    marginVertical: 4,
  },
  itemName: {
    color: '#f8fafc',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  itemNutri: {
    color: '#94a3b8',
    fontSize: 11,
  },
  weightEditBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 36,
    marginRight: 8,
  },
  weightInput: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 13,
    width: 45,
    textAlign: 'center',
  },
  unitText: {
    color: '#64748b',
    fontSize: 12,
  },
  removeBtn: {
    padding: 6,
  },
  removeBtnText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
});
