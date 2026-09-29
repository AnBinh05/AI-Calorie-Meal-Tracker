---
name: api-designer
description: Use when designing, reviewing, or updating RESTful API contracts, request/response DTOs, OpenAPI specifications, or data schemas across backend, mobile, and web-dashboard.
---

# 📐 API Designer (RESTful & OpenAPI Standards)

Specialized API design skill ensuring strict contract consistency, versioning, and validation between the **NutriAI** backend, mobile app, and web dashboard.

## 📌 Scope & Principles

- **Base Path:** `/api/v1/...`
- **Specification:** OpenAPI 3 / Swagger via SpringDoc (`http://localhost:8080/swagger-ui.html`)
- **Producers & Consumers:**
  - Producer: Spring Boot 3 Backend
  - Consumers: React Native Mobile (`mobile/src/services/api.ts`) & React Web Dashboard (`web-dashboard/src/services/api.ts`)

---

## 🏛️ Standard Endpoints Specification

### 1. Authentication & Profile (`/api/v1/auth`, `/api/v1/profile`)
| Method | Endpoint | Description | Request Body | Response (200/201) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new user | `RegisterRequest` | `AuthResponse` (JWT tokens) |
| `POST` | `/api/v1/auth/login` | Login with email/pass | `LoginRequest` | `AuthResponse` (JWT tokens) |
| `POST` | `/api/v1/auth/google` | OAuth2 Google login | `GoogleAuthRequest` | `AuthResponse` (JWT tokens) |
| `GET` | `/api/v1/profile` | Get user health profile | None | `HealthProfileResponse` |
| `PUT` | `/api/v1/profile` | Update profile / targets | `UpdateProfileRequest` | `HealthProfileResponse` |

### 2. Meal Logging & AI Vision (`/api/v1/meals`)
| Method | Endpoint | Description | Request Body | Response (200/201) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/meals/analyze` | AI Vision analysis | `multipart/form-data` (`image`) | `MealAnalysisDraftResponse` |
| `POST` | `/api/v1/meals` | Save confirmed meal | `CreateMealRequest` | `MealResponse` |
| `GET` | `/api/v1/meals` | List meals by date | Query: `?date=YYYY-MM-DD` | `List<MealResponse>` |
| `GET` | `/api/v1/meals/{id}` | Get single meal detail | None | `MealResponse` |
| `PUT` | `/api/v1/meals/{id}` | Update meal items | `UpdateMealRequest` | `MealResponse` |
| `DELETE` | `/api/v1/meals/{id}` | Delete meal | None | `204 No Content` |

### 3. Analytics & Export (`/api/v1/analytics`)
| Method | Endpoint | Description | Query Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/analytics/summary` | Today summary | `?date=YYYY-MM-DD` | `DailySummaryResponse` |
| `GET` | `/api/v1/analytics/trends` | 7-day or 30-day trend | `?startDate=...&endDate=...` | `TrendAnalyticsResponse` |
| `GET` | `/api/v1/analytics/export/csv` | Export CSV report | `?month=YYYY-MM` | CSV File download |
| `GET` | `/api/v1/analytics/export/pdf` | Export PDF report | `?month=YYYY-MM` | PDF File download |

---

## 📦 Standard Response & Error Schemas

### 1. Success Envelope (Optional wrapper)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### 2. Standardized Error Response (`ErrorResponse`)
All exceptions handled by `@RestControllerAdvice` must conform to this schema:
```json
{
  "timestamp": "2026-09-29T10:15:30Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for field 'weightKg'",
  "path": "/api/v1/profile",
  "fieldErrors": [
    {
      "field": "weightKg",
      "rejectedValue": -5,
      "message": "Weight must be greater than 0"
    }
  ]
}
```

---

## 🔄 Rules for Contract Changes

1. **Simultaneous Sync:** When changing any request/response DTO in `backend/src/main/java/.../dto`, update:
   - TypeScript types in `web-dashboard/src/types/`
   - TypeScript types in `mobile/src/types/`
2. **Backward Compatibility:** Never remove fields without a deprecation window; mark deprecated fields with `@Deprecated` in Java and `@deprecated` in JSDoc/TS.
3. **No Database Entity Leaks:** Never serialize JPA entities or Hibernate proxies directly across API boundaries.
