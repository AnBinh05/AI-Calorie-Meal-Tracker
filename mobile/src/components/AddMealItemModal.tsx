import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { MealItem } from '../types';

interface AddMealItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: MealItem) => void;
}

export const AddMealItemModal: React.FC<AddMealItemModalProps> = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('100');
  const [calories, setCalories] = useState('150');
  const [protein, setProtein] = useState('5');
  const [carbs, setCarbs] = useState('20');
  const [fat, setFat] = useState('5');

  const handleReset = () => {
    setName('');
    setWeight('100');
    setCalories('150');
    setProtein('5');
    setCarbs('20');
    setFat('5');
    onClose();
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn');
      return;
    }

    const weightNum = parseFloat(weight) || 100;
    const caloriesNum = parseFloat(calories) || 0;
    const proteinNum = parseFloat(protein) || 0;
    const carbsNum = parseFloat(carbs) || 0;
    const fatNum = parseFloat(fat) || 0;

    onAdd({
      name: name.trim(),
      estimatedWeightGrams: weightNum,
      servingSize: '1 phần',
      calories: caloriesNum,
      protein: proteinNum,
      carbs: carbsNum,
      fat: fatNum,
      fiber: 0,
      confidenceScore: 1.0,
    });

    handleReset();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleReset}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Thêm món ăn bổ sung</Text>
          <Text style={styles.modalSubtitle}>Nhập thông tin món ăn vào danh sách bữa ăn</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên món ăn (*)</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Ví dụ: Dưa leo cắt lát"
              placeholderTextColor="#64748b"
              autoFocus
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Khối lượng (g)</Text>
              <TextInput
                style={styles.textInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor="#64748b"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Calo (kcal)</Text>
              <TextInput
                style={styles.textInput}
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
                placeholder="150"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: '#38bdf8' }]}>Protein (g)</Text>
              <TextInput
                style={styles.textInput}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                placeholder="5"
                placeholderTextColor="#64748b"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: '#facc15' }]}>Carbs (g)</Text>
              <TextInput
                style={styles.textInput}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
                placeholder="20"
                placeholderTextColor="#64748b"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: '#f43f5e' }]}>Fat (g)</Text>
              <TextInput
                style={styles.textInput}
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
                placeholder="5"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleReset}>
              <Text style={styles.cancelText}>Hủy bỏ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
              <Text style={styles.confirmText}>Thêm món</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    color: '#f8fafc',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#1e293b',
  },
  cancelText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#10b981',
  },
  confirmText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
