import axios from 'axios';
import { Platform } from 'react-native';
import { authStorage } from './authStorage';
import {
  ApiResponse,
  DailySummary,
  DateRangeSummary,
  FavoriteMeal,
  HealthProfile,
  Meal,
  MealAnalysisResponse,
  MealType,
  PageResponse,
  QuickLogMealRequest,
  User,
} from '../types';

const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, '');
const defaultBaseUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/v1' : 'http://localhost:8080/api/v1';

// Android Emulator trỏ localhost qua 10.0.2.2; thiết bị thật có thể đặt EXPO_PUBLIC_API_BASE_URL trong .env
export const BASE_API_URL = envBaseUrl
  ? envBaseUrl.endsWith('/api/v1')
    ? envBaseUrl
    : `${envBaseUrl}/api/v1`
  : defaultBaseUrl;

let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

const apiClient = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await authStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await authStorage.clearAuth();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    const res = await apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/login', credentials);
    return res.data;
  },

  async register(userData: { fullName: string; email: string; password: string }) {
    const res = await apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/register', userData);
    return res.data;
  },

  async getMe() {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },

  // Health Profile
  async getProfile() {
    const res = await apiClient.get<ApiResponse<HealthProfile>>('/profile');
    return res.data;
  },

  async saveProfile(profile: HealthProfile) {
    const res = await apiClient.post<ApiResponse<HealthProfile>>('/profile', profile);
    return res.data;
  },

  // Meals & AI Analysis
  async analyzeMealPhoto(imageUri: string): Promise<ApiResponse<MealAnalysisResponse>> {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'meal_photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // @ts-ignore
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    });

    const token = await authStorage.getToken();
    const res = await axios.post<ApiResponse<MealAnalysisResponse>>(`${BASE_API_URL}/meals/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return res.data;
  },

  async saveMeal(meal: Partial<Meal>) {
    const res = await apiClient.post<ApiResponse<Meal>>('/meals', meal);
    return res.data;
  },

  async updateMeal(id: number, meal: Partial<Meal>) {
    const res = await apiClient.put<ApiResponse<Meal>>(`/meals/${id}`, meal);
    return res.data;
  },

  async getDailyMeals(dateStr?: string) {
    const res = await apiClient.get<ApiResponse<Meal[]>>('/meals/daily', {
      params: { date: dateStr },
    });
    return res.data;
  },

  async deleteMeal(id: number) {
    const res = await apiClient.delete<ApiResponse<null>>(`/meals/${id}`);
    return res.data;
  },

  // Analytics
  async getDailySummary(dateStr?: string) {
    const res = await apiClient.get<ApiResponse<DailySummary>>('/analytics/daily-summary', {
      params: { date: dateStr },
    });
    return res.data;
  },

  async getRangeSummary(startDate?: string, endDate?: string) {
    const res = await apiClient.get<ApiResponse<DateRangeSummary>>('/analytics/range', {
      params: { startDate, endDate },
    });
    return res.data;
  },

  // Favorite Meals
  async getFavoriteMeals(params?: { keyword?: string; mealType?: MealType; page?: number; size?: number }) {
    const res = await apiClient.get<ApiResponse<PageResponse<FavoriteMeal>>>('/meals/favorites', {
      params,
    });
    return res.data;
  },

  async createFavoriteFromMeal(mealId: number, customName?: string) {
    const res = await apiClient.post<ApiResponse<FavoriteMeal>>(`/meals/favorites/from-meal/${mealId}`, null, {
      params: { customName },
    });
    return res.data;
  },

  async quickLogFavoriteMeal(id: number, payload?: QuickLogMealRequest) {
    const res = await apiClient.post<ApiResponse<Meal>>(`/meals/favorites/${id}/log`, payload || {});
    return res.data;
  },

  async deleteFavoriteMeal(id: number) {
    const res = await apiClient.delete<ApiResponse<null>>(`/meals/favorites/${id}`);
    return res.data;
  },
};
