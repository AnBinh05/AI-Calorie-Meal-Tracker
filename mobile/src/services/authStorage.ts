import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_jwt_token';
const USER_KEY = '@auth_user_data';

export const authStorage = {
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error('Lỗi khi lưu token:', e);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (e) {
      console.error('Lỗi khi đọc token:', e);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Lỗi khi xóa token:', e);
    }
  },

  async setUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Lỗi khi lưu user:', e);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Lỗi khi đọc user:', e);
      return null;
    }
  },

  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (e) {
      console.error('Lỗi khi xóa phiên đăng nhập:', e);
    }
  }
};
