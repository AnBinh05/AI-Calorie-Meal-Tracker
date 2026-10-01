# 🤖 AGENTS.md — AI Coding Guidelines for NutriAI (AI Calorie & Meal Tracker)

Welcome to the **NutriAI (AI Calorie & Meal Tracker)** repository! This document serves as the single source of truth and operating manual for all AI coding agents (Antigravity, Claude Code, Cursor, GitHub Copilot, Codex, etc.) working on this codebase.

Follow these guidelines strictly to ensure code quality, architectural consistency, smooth developer experience (HMR), and adherence to the project's design system.

---

## 📌 1. Project Overview & Architecture

**NutriAI** is an intelligent, multi-platform nutrition and calorie tracking system. Users can take or upload a meal photo; the backend processes the image via **Google Gemini Flash Vision API**, extracts detected foods, estimates portion weights, calculates Calories and Macronutrients (Carbohydrates, Protein, Fat), and provides personalized health tips.

### Repository Architecture (Monorepo Layout)

```text
AI-Calorie-Meal-Tracker/
├── backend/                  # Spring Boot 3.2.5 REST API (Java 17, JPA, PostgreSQL, S3, Gemini)
│   ├── src/main/java/com/calorie/tracker/
│   │   ├── config/           # Security (JWT, OAuth2), S3, Gemini Flash Vision configs
│   │   ├── controller/       # REST endpoints (/api/v1/...)
│   │   ├── dto/              # Request / Response DTOs
│   │   ├── entity/           # JPA Entities (User, Meal, MealItem, HealthProfile)
│   │   ├── repository/       # Spring Data JPA Repositories
│   │   └── service/          # Business logic & AI Vision services
│   └── pom.xml
│
├── mobile/                   # React Native Mobile App (Expo SDK 51, TypeScript)
│   ├── src/
│   │   ├── components/       # Reusable mobile UI components
│   │   ├── navigation/       # React Navigation (AuthStack, AppTabs)
│   │   ├── screens/          # CameraScreen, ReviewScreen, DiaryScreen, ProfileScreen
│   │   └── services/         # API Client, Image compression, Auth storage
│   ├── App.tsx
│   └── package.json
│
├── web-dashboard/            # Web Dashboard (React 18, Vite 5, TypeScript, Vanilla CSS Tokens)
│   ├── src/
│   │   ├── components/       # Donut charts, Macro progress bars, Modals, Shell
│   │   ├── pages/            # Dashboard, AnalyticsPage, MealDiaryPage, Settings
│   │   ├── services/         # Axios API Client & AuthContext
│   │   └── index.css         # Design System CSS Variables & Tokens
│   └── package.json
│
├── docs/                     # Specifications, Figma specs, Guides, PRDs
│   ├── SKILLS_GUIDE.md       # Antigravity Skills guide
│   ├── TEAM_UI_DEVELOPMENT_GUIDE.md # Team execution roadmap
│   └── BACKEND_DEVELOPMENT_GUIDE.md # Spring Boot 3 & Java 17 backend onboarding guide
├── tasks/                    # Task trackers & feature specifications
├── .agents/skills/           # Repository-specific AI Agent Skills
├── DESIGN.md                 # Design tokens, color system, and UI rules
└── AGENTS.md                 # This file (AI agent guidelines & constraints)
```

---

## ⚡ 2. Development Workflow & Commands (Crucial)

### 🔴 Golden Rule: Never Run Production Builds During Iterative Sessions
* **Always run development servers** with Hot Module Replacement (HMR) / Fast Refresh enabled.
* **Do NOT execute `npm run build` or `./mvnw package`** inside interactive agent sessions unless specifically asked to validate production artifacts. Running production builds can overwrite development caches (e.g. `.next`, `dist`, `target`) and disable hot-reloading.

### Working Directory Management (`cwd`)
This is a monorepo without a unified root runner. **Always set `cwd` to the target subproject directory** before executing any commands:

| Subproject | Directory | Start Command | Default URL / Port |
| :--- | :--- | :--- | :--- |
| **Web Dashboard** | `web-dashboard/` | `npm run dev` | `http://localhost:5173` |
| **Mobile App** | `mobile/` | `npx expo start` (or `npm start`) | `http://localhost:8081` |
| **Backend API** | `backend/` | `./mvnw spring-boot:run` (or `mvn.cmd` on Windows) | `http://localhost:8080` |

### Dependency Management
* **Never mix package managers**: Use `npm` for both `web-dashboard` and `mobile`.
* **Sync lockfiles**: When installing packages, make sure `package.json` and `package-lock.json` remain consistent.
* **Backend Dependencies**: Manage all dependencies in `backend/pom.xml`. Adhere to Spring Boot 3.2.5 dependency management.
* **Do NOT install redundant UI libraries**: `web-dashboard` uses a unified Vanilla CSS variable token system (`DESIGN.md`). Do **NOT** install Tailwind CSS, MUI, or Chakra UI into `web-dashboard` unless explicitly requested.

---

## 🎨 3. Design System & UI Guardrails (Strict Compliance)

All user interfaces must strictly implement the design language specified in [`DESIGN.md`](file:///d:/AI-Calorie-Meal-Tracker/DESIGN.md).

### Standard Color Tokens
* **Brand Primary**: `#10B981` (Emerald Green) — Main interactive accent, primary buttons, target completion.
* **Brand Accent**: `#059669` (Light) / `#34D399` (Dark).
* **AI Action Button**: `#1E293B` (Midnight Navy with sparkle icon prefix `✨ Bắt đầu phân tích Calo`).
* **Macro Nutrient Color System (Never Swap These Colors)**:
  * **Carbohydrates**: Warm Amber (`#F59E0B` in Light / `#FBBF24` in Dark)
  * **Protein**: Vibrant Blue (`#3B82F6` in Light / `#60A5FA` in Dark)
  * **Fat (Chất béo)**: Magenta Pink (`#EC4899` in Light / `#F472B6` in Dark)
* **Status Badges**:
  * **Success**: `#10B981` (Target reached)
  * **Warning**: `#F59E0B` (Approaching budget)
  * **Danger**: `#EF4444` (Exceeded calorie budget)

### Anti-"AI Slop" Guardrails (Mandatory)
* ❌ **NO generic/random purple gradients** or neon glow boxes.
* ❌ **NO hardcoded hex colors** in component styles — always reference CSS variables (e.g., `var(--color-primary)`, `var(--macro-carbs)`).
* ❌ **NO `h-screen` on mobile/web-dashboard**: Use `h-dvh` or `min-h-dvh` to prevent scroll issues with browser URL bars.
* ✅ **Always use `tabular-nums`** for calorie counts, gram measurements, and countdowns so numbers do not jump during animation.
* ✅ **Always provide `aria-label`** for icon-only action buttons (e.g., delete meal item, edit calorie target, close modal).
* ✅ **Always distinguish meal item sources**: Use badges for `✨ AI Scan` vs `✍️ Thủ công` (Manual).
* ✅ **Respect Dual Themes**: Verify both Light Mode and Dark Mode contrast (WCAG 2.1 AA >= 4.5:1 for body copy).

---

## 🤖 4. AI Vision & Meal Data Pipeline Guidelines

When modifying or implementing features around food image scanning:

1. **Client-Side Image Compression**: Always compress and resize photos on the client (`mobile` or `web-dashboard`) before sending to `POST /api/v1/meals/analyze`. Max file size: 2MB; recommended dimensions: 1080p.
2. **Draft & Review Flow (Never Direct-Commit)**:
   * The AI analysis endpoint returns a **draft payload** (detected food list, estimated grams, calories, carbs, protein, fat, health tips).
   * The user must always see the **AI Review Modal/Screen** to adjust grams, remove false detections, or add side dishes before saving.
   * Only user confirmation triggers `POST /api/v1/meals` to persist into the database.
3. **Structured JSON Output**: Keep the Gemini Flash Vision prompt strictly requesting JSON adhering to the backend DTO schema. Never alter JSON keys without updating `backend`, `mobile`, and `web-dashboard` simultaneously.

---

## 🧰 5. Built-in Agent Skills (`.agents/skills/`)

This repository contains specialized skill guides in [`.agents/skills/`](file:///d:/AI-Calorie-Meal-Tracker/.agents/skills/). Before performing specific tasks, consult or activate the corresponding skill:

| Skill | Activation | When to Use |
| :--- | :--- | :--- |
| **`prd`** | `/prd` | Planning new features, drafting requirements, generating user stories in `tasks/`. |
| **`baseline-ui`** | `/baseline-ui` | Writing frontend UI code, enforcing layout hierarchy, typography, and spacing tokens. |
| **`improve-ui`** | `/improve-ui` | Auditing and refining existing UI components without altering underlying logic. |
| **`fixing-accessibility`** | `/fixing-accessibility` | Ensuring WCAG 2.1 AA compliance, keyboard navigation (Tab/Esc), focus traps, and ARIA labels. |
| **`fixing-motion-performance`** | `/fixing-motion-performance` | Optimizing animations to 60fps (compositor properties `transform`, `opacity`, `prefers-reduced-motion`). |
| **`fixing-metadata`** | `/fixing-metadata` | Optimizing SEO, Open Graph tags, social previews, and page metadata. |
| **`create-design-md`** | `/create-design-md` | Extracting and synchronizing Figma design specifications into `DESIGN.md`. |
| **`backend-developer`** | `/backend-developer` | Spring Boot 3, Java 17, JPA, PostgreSQL, Gemini Flash Vision & AWS S3. |
| **`mobile-developer`** | `/mobile-developer` | React Native (Expo SDK 51), Camera flow, client image compression, Diary. |
| **`api-designer`** | `/api-designer` | RESTful API contract modeling, DTO schemas, and OpenAPI/Swagger specs. |
| **`code-reviewer`** | `/code-reviewer` | PR-style fullstack code reviews, anti-AI slop audit, and regression prevention. |
| **`security-auditor`** | `/security-auditor` | Security audit, JWT verification, Spring Security 6 filters, IDOR and OWASP. |
| **`ui-fixer`** | `/ui-fixer` | Precision UI fixes and small-scale bug patches without collateral refactoring. |
| **`agy-customizations`** | `/agy-customizations` | Configuring Antigravity rules, skills, plugins, and MCP connections. |

Refer to [`docs/SKILLS_GUIDE.md`](file:///d:/AI-Calorie-Meal-Tracker/docs/SKILLS_GUIDE.md) for detailed workflows.

---

## 🛡️ 6. Code Style & Quality Standards

### General Rules
* **Preserve Documentation Integrity**: Retain all existing comments, docstrings, and license headers.
* **Do not use placeholders**: Provide complete, working implementations. Never output `// TODO: implement later` or placeholder dummy functions for core features.
* **Clickable File Links**: When communicating file paths, always format as clickable Markdown links (e.g. `[App.tsx](file:///d:/AI-Calorie-Meal-Tracker/web-dashboard/src/App.tsx)`).

### Frontend (React & React Native / TypeScript)
* Use explicit TypeScript types and interfaces; avoid `any`.
* Keep components modular: extract subcomponents when a file exceeds 250 lines.
* State management: Use React Context for authentication and daily targets; keep local state close to components.
* Ensure all interactive elements have unique, descriptive `id` or `data-testid` attributes for automated browser testing.

### Backend (Java & Spring Boot 3)
* Follow layered architecture: `Controller` ➔ `Service` ➔ `Repository` ➔ `Entity`.
* Use DTOs for all request bodies and responses; never expose JPA entities directly to controllers.
* Handle exceptions via `@RestControllerAdvice` returning structured `ErrorResponse`.
* Enforce validation using Jakarta Validation annotations (`@NotNull`, `@Positive`, `@NotBlank`).
* Secure all private endpoints with Spring Security filter chain and JWT validation.

---

## 🧪 7. Verification & Safety Guidelines

Before declaring any task complete:
1. **Lint & Types**: Verify TypeScript builds without errors (`npm run build` in a test shell or `tsc --noEmit`).
2. **Backend Compilation**: Ensure Maven compiles cleanly (`./mvnw clean compile -DskipTests`).
3. **🔴 Zero-Tolerance Secret Leakage Rule (Strictly Enforced)**:
   - **Never hardcode or commit secrets**: API keys (`GEMINI_API_KEY`), cloud credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`), auth secrets (`JWT_SECRET`), database passwords, or private keys into ANY tracked file (Java, TypeScript, YAML, JSON, Markdown, Docs).
   - **Configuration Hygiene**: In `application.yml`, always use `${VARIABLE:}` with empty defaults (e.g. `${JWT_SECRET:}`). Never supply default fallback strings that look like valid keys. For local dev without env vars, services must generate ephemeral in-memory keys or fallback safely.
   - **Environment Isolation**: Real credentials must reside exclusively in `.env` (gitignored) or system environment variables. Reference [`.env.example`](file:///d:/AI-Calorie-Meal-Tracker/.env.example) strictly with placeholders.
   - **Pre-Commit Diff Audit**: Always inspect diffs before committing to verify zero credential tokens (e.g., `AIzaSy...`, `AKIA...`, private keys, hex secrets) are leaked.
4. **Git Hygiene**: Create descriptive commits (e.g., `feat(web): add macro donut chart component`, `fix(ai): handle null portion size in gemini parser`).
