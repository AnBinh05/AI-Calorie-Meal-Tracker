import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { AddMealItemModal } from '../components/AddMealItemModal';
import { MealReviewItemCard } from '../components/MealReviewItemCard';
import { api } from '../services/api';
import { MealAnalysisResponse, MealItem, MealType } from '../types';

export const MealReviewScreen = ({ route, navigation }: any) => {
  const { imageUri, analysisResult } = route.params as {
    imageUri: string;
    analysisResult: MealAnalysisResponse;
  };

  const [mealName, setMealName] = useState(analysisResult.suggestedMealName || 'Bữa ăn mới');
  const [mealType, setMealType] = useState<MealType>('LUNCH');
  const [items, setItems] = useState<MealItem[]>(analysisResult.recognizedItems || []);
  const [healthTip, setHealthTip] = useState(analysisResult.healthTip || '');
  const [saving, setSaving] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const mealTypes: { type: MealType; label: string }[] = [
    { type: 'BREAKFAST', label: 'Sáng' },
    { type: 'LUNCH', label: 'Trưa' },
    { type: 'DINNER', label: 'Tối' },
    { type: 'SNACK', label: 'Phụ' },
  ];

  const handleUpdateItemWeight = (index: number, gramsStr: string) => {
    const newItems = [...items];
    const item = newItems[index];
    const oldWeight = item.estimatedWeightGrams || 100;
    const newWeight = parseFloat(gramsStr) || 0;

    if (oldWeight > 0 && newWeight > 0) {
      const ratio = newWeight / oldWeight;
      item.estimatedWeightGrams = newWeight;
      item.calories = Math.round(item.calories * ratio * 10) / 10;
      if (item.protein) item.protein = Math.round(item.protein * ratio * 10) / 10;
      if (item.carbs) item.carbs = Math.round(item.carbs * ratio * 10) / 10;
      if (item.fat) item.fat = Math.round(item.fat * ratio * 10) / 10;
    }
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = (newItem: MealItem) => {
    setItems([...items, newItem]);
  };

  const totalCalories = items.reduce((sum, i) => sum + (i.calories || 0), 0);
  const totalProtein = items.reduce((sum, i) => sum + (i.protein || 0), 0);
  const totalCarbs = items.reduce((sum, i) => sum + (i.carbs || 0), 0);
  const totalFat = items.reduce((sum, i) => sum + (i.fat || 0), 0);

  const handleSaveMeal = async () => {
    if (items.length === 0) {
      Alert.alert('Lỗi', 'Bữa ăn phải có ít nhất 1 món');
      return;
    }

    try {
      setSaving(true);
      const res = await api.saveMeal({
        mealDate: new Date().toISOString().split('T')[0],
        mealType,
        name: mealName,
        imageUrl: analysisResult.imageUrl || imageUri,
        healthTip,
        items,
      });

      if (res.success) {
        Alert.alert('Thành công', 'Đã lưu bữa ăn vào nhật ký dinh dưỡng!', [
          { text: 'OK', onPress: () => navigation.navigate('DiaryTab') },
        ]);
      } else {
        Alert.alert('Lỗi', res.message || 'Không thể lưu bữa ăn');
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e.message || 'Đã xảy ra lỗi khi lưu bữa ăn');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Kiểm tra kết quả AI</Text>
          <Text style={styles.subtitle}>Kiểm tra và tinh chỉnh số liệu trước khi lưu vào nhật ký</Text>
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.mealPreview} resizeMode="cover" />
        ) : null}

        {/* Meal Type Selector */}
        <View style={styles.typeSelector}>
          {mealTypes.map((t) => (
            <TouchableOpacity
              key={t.type}
              style={[styles.typeButton, mealType === t.type && styles.typeButtonActive]}
              onPress={() => setMealType(t.type)}
            >
              <Text style={[styles.typeText, mealType === t.type && styles.typeTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meal Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tên bữa ăn</Text>
          <TextInput
            style={styles.textInput}
            value={mealName}
            onChangeText={setMealName}
            placeholder="Ví dụ: Cơm gà xối mỡ"
            placeholderTextColor="#64748b"
          />
        </View>

        {/* Nutrition Summary Box */}
        <View style={styles.summaryBox}>
          <View style={styles.macroCol}>
            <Text style={styles.summaryValue}>{Math.round(totalCalories)}</Text>
            <Text style={styles.summaryLabel}>Calories (kcal)</Text>
          </View>
          <View style={styles.macroCol}>
            <Text style={[styles.summaryValue, { color: '#38bdf8' }]}>{Math.round(totalProtein)}g</Text>
            <Text style={styles.summaryLabel}>Protein</Text>
          </View>
          <View style={styles.macroCol}>
            <Text style={[styles.summaryValue, { color: '#facc15' }]}>{Math.round(totalCarbs)}g</Text>
            <Text style={styles.summaryLabel}>Carbs</Text>
          </View>
          <View style={styles.macroCol}>
            <Text style={[styles.summaryValue, { color: '#f43f5e' }]}>{Math.round(totalFat)}g</Text>
            <Text style={styles.summaryLabel}>Fat</Text>
          </View>
        </View>

        {/* Health Tip */}
        {healthTip ? (
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>💡 Lời khuyên dinh dưỡng từ AI</Text>
            <Text style={styles.tipText}>{healthTip}</Text>
          </View>
        ) : null}

        {/* Item List Header */}
        <View style={styles.itemsHeader}>
          <Text style={styles.sectionTitle}>Món ăn nhận diện ({items.length})</Text>
          <TouchableOpacity onPress={() => setIsAddModalVisible(true)}>
            <Text style={styles.addItemBtn}>+ Thêm món</Text>
          </TouchableOpacity>
        </View>

        {/* Modular Item Cards */}
        {items.map((item, index) => (
          <MealReviewItemCard
            key={index}
            item={item}
            index={index}
            onUpdateWeight={handleUpdateItemWeight}
            onRemove={handleRemoveItem}
          />
        ))}

        <CustomButton
          title="💾 Lưu vào nhật ký dinh dưỡng"
          onPress={handleSaveMeal}
          loading={saving}
          style={{ marginTop: 24, marginBottom: 40 }}
        />
      </ScrollView>

      {/* Cross-platform Modal for adding custom items */}
      <AddMealItemModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={handleAddItem}
      />
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  mealPreview: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  typeButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  typeText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 13,
  },
  typeTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    color: '#f8fafc',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  macroCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  tipBox: {
    backgroundColor: '#064e3b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  tipTitle: {
    color: '#a7f3d0',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  tipText: {
    color: '#d1fae5',
    fontSize: 12,
    lineHeight: 18,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  addItemBtn: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 13,
  },
});
