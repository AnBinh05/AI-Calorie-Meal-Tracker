import axios from 'axios';
import { authStorage } from './authStorage';
import { ApiResponse, DailySummary, HealthProfile, Meal, MealAnalysisResponse, User } from '../types';

// Trong môi trường development với Expo trên Android Emulator thường là 10.0.2.2:8080, iOS Simulator là localhost:8080, thiết bị thật là IP LAN
export const BASE_API_URL = 'http://localhost:8080/api/v1';

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
};
