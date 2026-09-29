---
name: mobile-developer
description: Use when a task requires mobile app development, bug fixes, camera/image manipulation, React Navigation, or Expo configuration for NutriAI mobile.
---

# 📱 Mobile Developer (React Native & Expo SDK 51)

Specialized mobile engineering skill tailored for the **NutriAI** React Native / Expo mobile application.

## 📌 Working Directory & Environment

- **Root Directory:** [`mobile/`](file:///d:/AI-Calorie-Meal-Tracker/mobile)
- **Always set `cwd` to `mobile/`** before running commands.
- **Run dev server:** `npx expo start` (or `npm start`)
- **Typecheck & Validate:** `npx tsc --noEmit`
- **Port:** `http://localhost:8081`

---

## 🏗️ Architecture & Core Responsibilities

```text
mobile/src/
├── components/   # Reusable UI widgets (ProgressBar, MacroDonut, MealCard)
├── context/      # AuthContext, TargetContext
├── navigation/   # AuthStack, AppTabs, RootNavigator
├── screens/      # CameraScreen, ReviewScreen, DiaryScreen, ProfileScreen
├── services/     # api.ts (Axios), imageCompressor.ts, storage.ts
└── types/        # meal.types.ts, user.types.ts, navigation.types.ts
```

### 1. Camera & Client-Side Image Optimization
- Use `expo-camera` or `expo-image-picker` to capture/select food photos.
- **Mandatory Client Compression:** Never send uncompressed 10MB camera photos to the backend. Use `expo-image-manipulator` to:
  - Resize max width/height to `1080px`.
  - Compress to JPEG quality `0.7 - 0.8` (resulting in ~300KB - 800KB file).
  - Convert to `FormData` (`image/jpeg`) for upload to `POST /api/v1/meals/analyze`.

### 2. The Core 4-Step Meal Flow
1. **CameraScreen:** Camera viewfinder with alignment guide and flash/gallery controls.
2. **Analysis Loading:** Skeleton or pulsing lottie while Gemini Flash Vision processes.
3. **ReviewScreen (Draft State):**
   - Display preview photo thumbnail.
   - List detected food items with grams, calories, and macros.
   - Allow user to adjust grams (+/- 10g or direct numeric input), delete misdetected items, or add manual side dishes.
   - Real-time recalculation of total calories & macros as items are modified.
4. **Confirm & DiaryScreen:**
   - Tap "Lưu vào nhật ký" ➔ `POST /api/v1/meals`.
   - Update daily progress bar and navigate to Diary tab.

### 3. Design Tokens & UI Guardrails (from DESIGN.md)
- **Primary Brand:** `#10B981` (Emerald Green).
- **Macro Nutrient Colors (Never Swap):**
  - Carbs: Warm Amber (`#F59E0B`)
  - Protein: Vibrant Blue (`#3B82F6`)
  - Fat: Magenta Pink (`#EC4899`)
- **Typography & Layout:**
  - Always use `fontVariant: ['tabular-nums']` for calories and weight measurements so numbers don't jump during state updates.
  - Use `SafeAreaView` from `react-native-safe-area-context`.
  - Provide `accessibilityLabel` for all icon-only buttons.
  - Distinguish item sources: Badge `✨ AI Scan` vs `✍️ Thủ công`.

---

## ✅ Quality Checklist

- [ ] All API requests use Axios client with JWT interceptor from `services/api.ts`.
- [ ] Handles offline or slow network states gracefully with timeout and retry prompt.
- [ ] No hardcoded dimension assumptions: use responsive dimensions and safe area insets.
- [ ] TypeScript passes without errors: `npx tsc --noEmit`.
