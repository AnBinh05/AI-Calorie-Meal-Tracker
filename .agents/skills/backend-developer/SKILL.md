---
name: backend-developer
description: Use when a task involves backend development, bug fixes, database schema changes, AI Vision integration, or API logic in the Spring Boot service.
---

# ☕ Backend Developer (Spring Boot & Java 17)

Specialized backend engineering skill tailored for the **NutriAI** Spring Boot 3.2.5 backend service.

## 📌 Working Directory & Environment

- **Root Directory:** [`backend/`](file:///d:/AI-Calorie-Meal-Tracker/backend)
- **Always set `cwd` to `backend/`** before executing Maven commands.
- **Run dev server:** `./mvnw spring-boot:run` (or `mvn.cmd` on Windows)
- **Compile & Validate:** `./mvnw clean compile -DskipTests`
- **Port:** `http://localhost:8080` (API base: `/api/v1/...`)

---

## 🏗️ Architecture & Conventions

Follow strict layered architecture:
```text
Controller ──> Service ──> Repository ──> Entity
     │              │
     ▼              ▼
  RequestDTO     ResponseDTO
```

### 1. Controllers (`com.calorie.tracker.controller`)
- Use `@RestController` and `@RequestMapping("/api/v1/<resource>")`.
- Validate all incoming bodies with `@Valid`.
- Never return JPA entities directly; always return `ResponseEntity<ResponseDTO>` or `ApiResponse<T>`.
- Use correct HTTP status codes (`201 CREATED` on POST, `204 NO_CONTENT` on DELETE, `200 OK` on GET/PUT).

### 2. Services (`com.calorie.tracker.service`)
- Annotate with `@Service` and `@Transactional(readOnly = true)` by default.
- Annotate modifying methods with `@Transactional`.
- Business exceptions must inherit from custom runtime exceptions handled by `@RestControllerAdvice`.

### 3. Entities & Repositories (`com.calorie.tracker.entity` & `repository`)
- Primary entities: `User`, `HealthProfile`, `Meal`, `MealItem`.
- Cascade types: `Meal` owns `MealItem` with `CascadeType.ALL` and `orphanRemoval = true`.
- Use Spring Data JPA interface methods (`findByUserIdAndDateBetween`). Avoid raw native queries unless necessary for complex analytics aggregation.

### 4. AI Vision Pipeline (`GeminiVisionService`)
- Image input: `MultipartFile` uploaded from Mobile/Web.
- Always validate image MIME type (`image/jpeg`, `image/png`, `image/webp`) and size (max 5MB).
- Upload raw image to AWS S3 / Cloudflare R2 bucket first to obtain public/pre-signed URL.
- Send prompt to **Gemini Flash Vision** requesting structured JSON matching `MealAnalysisResponse` DTO:
  ```json
  {
    "detectedFoods": [
      {
        "name": "Cơm trắng",
        "estimatedGrams": 150,
        "calories": 195,
        "carbs": 42.0,
        "protein": 4.0,
        "fat": 0.5
      }
    ],
    "totalCalories": 550,
    "totalCarbs": 60.0,
    "totalProtein": 35.0,
    "totalFat": 15.0,
    "healthTip": "Bữa ăn giàu đạm, nên bổ sung thêm rau xanh."
  }
  ```
- **Draft & Review Flow:** Do NOT auto-save to database during `analyze`. Only return draft DTO to client. Save happens when user confirms via `POST /api/v1/meals`.

---

## ✅ Quality & Security Checklist

- [ ] Jakarta Validation annotations applied (`@NotNull`, `@NotBlank`, `@Positive`, `@Min`).
- [ ] No database secrets or API keys hardcoded in `application.yml` (use environment variables: `${GEMINI_API_KEY}`, `${JWT_SECRET}`).
- [ ] Centralized error handling returns structured `ErrorResponse(timestamp, status, error, message, path)`.
- [ ] All private endpoints verify JWT token via Spring Security filter chain.
- [ ] Code compiles without errors: `./mvnw clean compile -DskipTests`.
