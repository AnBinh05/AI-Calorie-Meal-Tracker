import axios from 'axios';
import { ApiResponse, DailySummary, DateRangeSummary, HealthProfile, Meal, User } from '../types';

export const BASE_API_URL = 'http://localhost:8080/api/v1';

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

  // Meals
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

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `meal_nutrition_report.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
