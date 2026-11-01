import axios from 'axios';
import {
  ApiResponse,
  CreateFavoriteMealRequest,
  CreateMealRequest,
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

export const BASE_API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ai_calorie_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  async analyzeMealImage(file: File): Promise<ApiResponse<MealAnalysisResponse>> {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('ai_calorie_token');
    const res = await axios.post<ApiResponse<MealAnalysisResponse>>(`${BASE_API_URL}/meals/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return res.data;
  },

  async createMeal(mealData: CreateMealRequest): Promise<ApiResponse<Meal>> {
    const res = await apiClient.post<ApiResponse<Meal>>('/meals', mealData);
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

  // Export
  async downloadExport(format: 'csv' | 'pdf', startDate?: string, endDate?: string) {
    const token = localStorage.getItem('ai_calorie_token');
    const response = await axios.get(`${BASE_API_URL}/analytics/export/${format}`, {
      params: { startDate, endDate },
      responseType: 'blob',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    let filename = `meal_report_${startDate || 'start'}_to_${endDate || 'end'}.${format}`;
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  },

  // Favorite Meals (Món ăn yêu thích)
  async getFavoriteMeals(params?: { keyword?: string; mealType?: MealType; page?: number; size?: number }) {
    const res = await apiClient.get<ApiResponse<PageResponse<FavoriteMeal>>>('/meals/favorites', {
      params,
    });
    return res.data;
  },

  async getFavoriteMealById(id: number) {
    const res = await apiClient.get<ApiResponse<FavoriteMeal>>(`/meals/favorites/${id}`);
    return res.data;
  },

  async createFavoriteMeal(payload: CreateFavoriteMealRequest) {
    const res = await apiClient.post<ApiResponse<FavoriteMeal>>('/meals/favorites', payload);
    return res.data;
  },

  async createFavoriteFromMeal(mealId: number, customName?: string) {
    const res = await apiClient.post<ApiResponse<FavoriteMeal>>(`/meals/favorites/from-meal/${mealId}`, null, {
      params: { customName },
    });
    return res.data;
  },

  async updateFavoriteMeal(id: number, payload: Partial<CreateFavoriteMealRequest>) {
    const res = await apiClient.put<ApiResponse<FavoriteMeal>>(`/meals/favorites/${id}`, payload);
    return res.data;
  },

  async deleteFavoriteMeal(id: number) {
    const res = await apiClient.delete<ApiResponse<null>>(`/meals/favorites/${id}`);
    return res.data;
  },

  async quickLogFavoriteMeal(id: number, payload?: QuickLogMealRequest) {
    const res = await apiClient.post<ApiResponse<Meal>>(`/meals/favorites/${id}/log`, payload || {});
    return res.data;
  },
};
