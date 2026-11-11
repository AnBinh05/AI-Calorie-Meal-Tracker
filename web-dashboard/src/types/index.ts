export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type ActivityLevel = 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE';
export type Goal = 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_WEIGHT';

export interface User {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  hasHealthProfile: boolean;
  createdAt: string;
}

export interface HealthProfile {
  id?: number;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  bmi?: number;
  bmiCategory?: string;
  activityLevel: ActivityLevel;
  goal: Goal;
  bmr?: number;
  tdee?: number;
  dailyCalorieTarget: number;
  dailyProteinTargetGrams: number;
  dailyCarbsTargetGrams: number;
  dailyFatTargetGrams: number;
  customDailyCalorieTarget?: number;
  updatedAt?: string;
}

export interface MealItem {
  id?: number;
  name: string;
  estimatedWeightGrams?: number;
  servingSize?: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  confidenceScore?: number;
}

export interface Meal {
  id?: number;
  mealDate: string;
  mealType: MealType;
  mealTypeDisplayName?: string;
  name?: string;
  imageUrl?: string;
  healthTip?: string;
  notes?: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  items: MealItem[];
  createdAt?: string;
}

export interface DailySummary {
  date: string;
  totalCaloriesConsumed: number;
  calorieTarget: number;
  remainingCalories: number;
  totalProteinConsumed: number;
  proteinTargetGrams: number;
  totalCarbsConsumed: number;
  carbsTargetGrams: number;
  totalFatConsumed: number;
  fatTargetGrams: number;
  mealCount: number;
  meals: Meal[];
}

export interface DateRangeSummary {
  startDate: string;
  endDate: string;
  averageDailyCalories: number;
  averageDailyProtein: number;
  averageDailyCarbs: number;
  averageDailyFat: number;
  dailyCalorieTarget: number;
  dailySummaries: DailySummary[];
  macroDistributionPercent: {
    proteinPercent: number;
    carbsPercent: number;
    fatPercent: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface MealAnalysisResponse {
  suggestedMealName?: string;
  imageUrl?: string;
  estimatedTotalCalories?: number;
  estimatedTotalProtein?: number;
  estimatedTotalCarbs?: number;
  estimatedTotalFat?: number;
  healthTip?: string;
  recognizedItems: MealItem[];
  rawAiResponse?: string;
}

export interface CreateMealRequest {
  mealDate: string;
  mealType: MealType;
  name?: string;
  imageUrl?: string;
  healthTip?: string;
  notes?: string;
  items: {
    name: string;
    estimatedWeightGrams?: number;
    servingSize?: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    confidenceScore?: number;
  }[];
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface FavoriteMeal {
  id: number;
  name: string;
  mealType: MealType;
  mealTypeDisplayName?: string;
  imageUrl?: string;
  notes?: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  usageCount: number;
  itemsCount: number;
  items: MealItem[];
  createdAt: string;
}

export interface CreateFavoriteMealRequest {
  name: string;
  mealType: MealType;
  imageUrl?: string;
  notes?: string;
  items: {
    name: string;
    estimatedWeightGrams?: number;
    servingSize?: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  }[];
}

export interface QuickLogMealRequest {
  mealDate?: string;
  mealType?: MealType;
  notes?: string;
}

