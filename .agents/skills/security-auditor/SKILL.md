---
name: security-auditor
description: Use when auditing code for security vulnerabilities, evaluating JWT/OAuth authentication, checking secret handling, reviewing Spring Security filters, or verifying OWASP compliance.
---

# 🛡️ Security Auditor (AppSec & Infrastructure Security)

Specialized application security skill focused on vulnerability assessment, authentication flows, secrets hygiene, and defense-in-depth for the **NutriAI** system.

## 📌 Working Mode

- **Evidence-Driven Audit:** Identify concrete exploit vectors and insecure configurations with exact line references.
- **Scope:** Spring Boot 3 Backend, React Native Mobile, Web Dashboard, and AWS/Cloud configurations.

---

## 🔒 Security Audit Checklist

### 1. Authentication & JWT Integrity (`backend`)
- [ ] **Secret Strength:** JWT secret key (`jwt.secret`) must be at least 256 bits (32 bytes) for HMAC-SHA256. Never use default or predictable strings in production.
- [ ] **Token Expiration:** JWT Access Token expiration must be bounded (e.g., 24 hours / 86400000 ms).
- [ ] **Password Storage:** Passwords must be hashed with `BCryptPasswordEncoder` (work factor >= 10). Never store plain text or MD5/SHA-1 hashes.
- [ ] **Token Validation:** Validate signature, expiration date, and issuer. Reject tampered or malformed tokens with `401 Unauthorized`.

### 2. Spring Security 6 Filter Chain (`SecurityConfig.java`)
- [ ] **Endpoint Authorization:**
  - Public: `/api/v1/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**`
  - Private: `/api/v1/meals/**`, `/api/v1/profile/**`, `/api/v1/analytics/**` MUST require `.authenticated()`.
- [ ] **Stateless Session:** Session creation policy configured to `SessionCreationPolicy.STATELESS`.
- [ ] **CORS Configuration:** Explicitly restrict allowed origins (e.g., `http://localhost:5173` for web dashboard, production domain). Do not use `allowedOrigins("*")` with `allowCredentials(true)`.

### 3. User Data Isolation & Multi-Tenancy
- [ ] **IDOR Prevention (Insecure Direct Object Reference):** When querying or mutating meals (`/api/v1/meals/{id}`), always verify that the target meal belongs to the currently authenticated user:
  ```java
  // Correct
  Meal meal = mealRepository.findByIdAndUserId(mealId, currentUser.getId())
      .orElseThrow(() -> new ResourceNotFoundException("Meal not found"));
  ```
- [ ] **Tenant Scoping:** Never permit a user to view another user's health profile, daily calorie summary, or uploaded photos.

### 4. Third-Party Integrations & Storage (`Gemini & S3`)
- [ ] **Gemini API Key:** `GEMINI_API_KEY` must strictly reside in environment variables or `.env`. Never commit keys to Git or expose them in client bundles (`mobile` or `web-dashboard`).
- [ ] **AWS S3 / R2 Bucket Permissions:** Buckets must not be publicly writable. Files must be written with UUID prefixes to avoid filename collisions and directory traversal attacks.
- [ ] **File Upload Validation:** Verify MIME types (`image/jpeg`, `image/png`, `image/webp`) and limit maximum file size to 5MB (`spring.servlet.multipart.max-file-size=5MB`) to prevent Denial-of-Service attacks.

### 5. Repository Secret Leakage Prevention
- [ ] Verify `.gitignore` ignores: `.env`, `*.key`, `*.pem`, `credentials.json`, `target/`, `node_modules/`.
- [ ] Check Git history for accidental commits containing API keys before pushing to remote.

---

## 📋 Security Finding Format

Report security findings with high actionable clarity:

```markdown
### 🚨 [SEVERITY: CRITICAL / HIGH / MEDIUM / LOW] Finding Title
- **Vulnerability:** OWASP Category (e.g., Broken Object Level Authorization, A01:2021).
- **Location:** [FilePath:Line](file:///path/to/file#L10)
- **Attack Scenario:** How an attacker could exploit this weakness.
- **Remediation:** Concrete code fix to secure the vulnerability.
```
