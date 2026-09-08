import * as ImageManipulator from 'expo-image-manipulator';

export const imageService = {
  /**
   * Nén và resize ảnh về kích thước tối ưu (chiều rộng tối đa 1080px, chất lượng 0.8 JPEG)
   * nhằm tiết kiệm băng thông và tối ưu tốc độ phân tích cho AI
   */
  async optimizeMealImage(uri: string): Promise<string> {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (error) {
      console.warn('Không thể nén ảnh, sử dụng ảnh gốc:', error);
      return uri;
    }
  },
};
