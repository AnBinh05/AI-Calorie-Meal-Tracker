---
name: code-reviewer
description: Use when conducting PR-style code reviews, auditing changes for regressions, checking anti-AI-slop UI compliance, or verifying architecture standards across backend, mobile, or web-dashboard.
---

# 🔍 Code Reviewer (Full-Stack & Quality Assurance)

Specialized, evidence-driven code review skill focused on correctness, maintainability, architectural integrity, and strict adherence to the **NutriAI** design system.

## 📌 Working Mode

- **Read-Only Inspection:** By default, analyze and provide findings without directly modifying files unless explicitly requested.
- **Evidence-Driven:** Separate observed facts from assumptions. Quote exact lines and explain the concrete failure risk.
- **Severity Tiers:**
  - 🛑 `BLOCKER`: Security hole, runtime crash, data corruption, hardcoded secret, or severe UI/token violation.
  - ⚠️ `WARNING`: Performance bottleneck, missing validation, accessibility gap, or design token drift.
  - 💡 `SUGGESTION`: Code readability, minor refactoring, or documentation polish.

---

## 📋 Review Checklist by Subproject

### 1. Web Dashboard & Mobile UI Guardrails (Anti-"AI Slop")
- [ ] **No Hardcoded Hex Colors:** Component styles must reference CSS variables (`var(--color-primary)`, `var(--macro-carbs)`) or standard design tokens from [`DESIGN.md`](file:///d:/AI-Calorie-Meal-Tracker/DESIGN.md).
- [ ] **Macro Nutrient Colors:** Confirm Carbs (`#F59E0B`), Protein (`#3B82F6`), Fat (`#EC4899`) are NEVER swapped.
- [ ] **No `h-screen`:** Must use `h-dvh` or `min-h-dvh` to avoid mobile browser address bar clipping.
- [ ] **Tabular Nums:** All numeric counters (calories, grams, macros, countdowns) MUST use `tabular-nums` / `fontVariant: ['tabular-nums']`.
- [ ] **Accessibility (A11y):** All icon-only buttons (`<button>`, `Pressable`) have an explicit `aria-label` or `accessibilityLabel`.
- [ ] **Component Size:** Files exceeding 250 lines should have subcomponents extracted.
- [ ] **No `any` in TypeScript:** API payloads and state objects must use explicit interfaces.

### 2. Spring Boot Backend
- [ ] **Layered Architecture:** Controller ➔ Service ➔ Repository ➔ Entity. No repository calls directly inside controllers.
- [ ] **DTO Isolation:** No JPA entities exposed directly in REST controller methods or returned to clients.
- [ ] **Transaction Boundaries:** Read operations have `@Transactional(readOnly = true)`, mutations have `@Transactional`.
- [ ] **Input Validation:** Incoming request DTOs have `@Valid` and Jakarta validation annotations (`@NotNull`, `@Size`, `@Positive`).
- [ ] **Error Handling:** Unhandled exceptions caught via `@RestControllerAdvice` returning structured `ErrorResponse`.

### 3. AI Vision & Data Pipeline
- [ ] Client compresses image before sending to `POST /api/v1/meals/analyze` (max 2MB, ~1080p).
- [ ] AI analysis returns a **draft payload**; saving to database only occurs on explicit user confirmation via `POST /api/v1/meals`.
- [ ] Gemini Vision API prompt requests strictly formatted JSON.

---

## 📝 Review Feedback Template

When providing code review feedback, format using this structure:

```markdown
### 🛑 [BLOCKER] Title of Issue
- **File:** [filename.ts:L45-L52](file:///path/to/filename.ts#L45-L52)
- **Problem:** Explanation of the defect or rule violation.
- **Risk:** What happens in production or to the user experience if unaddressed.
- **Recommended Fix:**
```ts
// corrected snippet
```
```
