import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { imageService } from '../services/imageService';
import { api } from '../services/api';

export const CameraScreen = ({ navigation }: any) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần cấp quyền', 'Ứng dụng cần quyền sử dụng Camera để chụp ảnh bữa ăn');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      handleImageSelected(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần cấp quyền', 'Ứng dụng cần quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      handleImageSelected(result.assets[0].uri);
    }
  };

  const handleImageSelected = async (uri: string) => {
    setSelectedImage(uri);
    try {
      setAnalyzing(true);
      // Nén ảnh client-side
      const optimizedUri = await imageService.optimizeMealImage(uri);
      
      // Gửi backend phân tích qua Gemini Vision
      const response = await api.analyzeMealPhoto(optimizedUri);
      
      if (response.success && response.data) {
        navigation.navigate('MealReview', {
          imageUri: optimizedUri,
          analysisResult: response.data,
        });
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể phân tích ảnh món ăn');
      }
    } catch (e: any) {
      Alert.alert('Lỗi phân tích', e.message || 'Đã xảy ra lỗi khi kết nối với máy chủ AI');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quét bữa ăn với AI</Text>
        <Text style={styles.subtitle}>Chụp hoặc tải ảnh đĩa thức ăn để AI nhận diện calories & macros tức thì</Text>
      </View>

      <View style={styles.previewContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderIcon}>📸</Text>
            <Text style={styles.placeholderText}>Đặt toàn bộ đĩa thức ăn trong khung hình với ánh sáng rõ ràng</Text>
          </View>
        )}

        {analyzing && (
          <View style={styles.analyzingOverlay}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.analyzingTitle}>Gemini Vision đang phân tích...</Text>
            <Text style={styles.analyzingSubtitle}>Đang nhận diện thành phần món ăn & tính toán calories</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cameraButton]}
          onPress={takePhoto}
          disabled={analyzing}
        >
          <Text style={styles.cameraButtonText}>📷 Chụp ảnh ngay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.galleryButton]}
          onPress={pickImage}
          disabled={analyzing}
        >
          <Text style={styles.galleryButtonText}>🖼️ Chọn từ thư viện</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  previewContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    marginVertical: 16,
    borderWidth: 1.5,
    borderColor: '#1e293b',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  analyzingTitle: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
  },
  analyzingSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#10b981',
  },
  cameraButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  galleryButton: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  galleryButtonText: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '600',
  },
});
