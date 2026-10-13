---
name: open-code-review
description: >-
  Conduct enterprise-grade, hybrid-architecture AI code reviews, vulnerability scans, and git diff audits based on Alibaba Open Code Review (ocr). Triggers on: open-code-review, ocr, review pr, review diff, scan codebase, alibaba code review.
---

# 🛡️ Alibaba Open Code Review (`open-code-review` / `ocr`)

Specialized code review skill implementing the **Alibaba Open Code Review (OCR)** hybrid architecture. It combines **deterministic engineering pipelines** (file filtering, rule mapping, context pruning, exact line positioning) with **AI reasoning agents** to uncover high-impact defects, security vulnerabilities, and code quality regressions.

---

## 📌 1. Triết Lý & Kiến Trúc Hybrid Của Alibaba OCR

Khác với các công cụ review thông thường (chỉ gửi nguyên `git diff` vào prompt chung), Alibaba OCR hoạt động qua 2 lớp phối hợp:

1. **Deterministic Pipeline (Định chuẩn kỹ thuật):**
   - Lọc bỏ file sinh tự động (`node_modules`, lockfiles, compiled binaries, generated DTOs).
   - Phân đoạn code thông minh (Smart chunking) theo phạm vi hàm/lớp thay vì cắt dòng tùy tiện.
   - Định tuyến tập luật (Rule Routing): Khớp các rule chuyên biệt theo ngôn ngữ (Java, TypeScript, React, Go, Python).
   - Định vị chính xác số dòng (Exact Line-level Comment Positioning).

2. **LLM Reasoning Agent (Phân tích ngữ cảnh sâu):**
   - Đọc ngược lại luồng gọi hàm (Call hierarchy) qua codebase search và file reading.
   - Xác minh giả định: kiểm tra xem null check đã được xử lý ở tầng trên chưa trước khi báo lỗi.
   - Đưa ra bản vá (patch) cụ thể thay vì chỉ nhận xét chung chung.

---

## 🎯 2. Bộ Quy Chuẩn Kiểm Tra Trọng Tâm (Core Rule Templates)

Tham khảo chi tiết tại [`references/rules-and-vulnerabilities.md`](./references/rules-and-vulnerabilities.md).

### 🛑 Tier 1: Lỗi Nghiêm Trọng (Blocker / Critical)
* **Null Pointer Exception (NPE):** Truy cập thuộc tính mà không kiểm tra `null`/`undefined`, thiếu kiểm tra `Optional.isPresent()`, bỏ sót `null` khi map dữ liệu từ bên thứ 3.
* **Concurrency & Race Conditions:** Dùng `SimpleDateFormat` hoặc các collection không thread-safe trong môi trường đa luồng, race conditions trong async functions, state mutations không nguyên tử.
* **Security & OWASP:** SQL Injection, IDOR (bỏ sót user check), Path Traversal trong upload file, Hardcoded secrets/tokens/API keys, XSS trong render HTML.
* **Resource Leaks:** Mở stream I/O, database connection, file handle mà không đóng qua `try-with-resources` hoặc `finally`.

### ⚠️ Tier 2: Hiệu Năng & Ổn Định (Warning)
* **Database & ORM:** Lỗi N+1 Query trong JPA / Hibernate, thiếu pagination khi query danh sách lớn, truy vấn không dùng index.
* **Error Handling:** Nuốt ngoại lệ (silent catch), log thiếu stack trace, ném generic `Exception` thay vì domain exception.
* **Memory & Performance:** Vòng lặp tính toán nặng không cần thiết, leak listeners/subscriptions trong frontend hooks (`useEffect`).

### 💡 Tier 3: Kiến Trúc & Thiết Kế (Suggestion)
* **Vi phạm Layer:** Gọi trực tiếp Repository trong Controller, để lộ JPA Entity ra client.
* **Code Smells:** Hàm quá dài (> 50 dòng), duplicate logic, đặt tên biến mơ hồ.

---

## 🚀 3. Hai Chế Độ Vận Hành Của Skill

### Chế độ A: Agent-Native Review (Khuyên dùng trong phiên làm việc)
Antigravity tự đóng vai trò là Open Code Review Engine, tự động duyệt qua git status/diff hoặc file mục tiêu và áp dụng bộ luật Alibaba OCR.

#### Lệnh kích hoạt:
* `/open-code-review` hoặc `/ocr` — Review toàn bộ thay đổi chưa commit trong workspace.
* `/open-code-review backend/` — Quét chuyên sâu một module cụ thể.
* `/open-code-review commit <hash>` — Phân tích chi tiết một commit cụ thể.
* `/open-code-review --from main --to develop` — So sánh và audit một branch PR.

---

### Chế độ B: Sử Dụng Công Cụ CLI (`ocr`)
Nếu máy chủ hoặc môi trường đã cài đặt công cụ dòng lệnh `ocr` của Alibaba (`github.com/alibaba/open-code-review`):

```powershell
# Review toàn bộ thay đổi trong workspace
ocr review

# Review so sánh nhánh
ocr review --from main --to develop

# Quét bảo mật toàn bộ thư mục chỉ định
ocr scan --path backend/src/main/java

# Xuất kết quả định dạng JSON cho pipeline CI/CD
ocr review --format json --output review-result.json

# Bật giao diện trực quan Web Viewer để xem báo cáo
ocr viewer
```

> 💡 *Xem script cài đặt nhanh tại [`scripts/install-ocr.ps1`](./scripts/install-ocr.ps1).*

---

## 📋 4. Mẫu Định Dạng Phản Hồi Chuẩn (Review Feedback Template)

Mọi nhận xét review đều phải tuân thủ cấu trúc bằng chứng (Evidence-driven):

```markdown
### 🛑 [BLOCKER] Tiêu đề ngắn gọn về lỗi
- **Vị trí:** [TênFile.java:L45-L52](file:///path/to/TênFile.java#L45-L52)
- **Danh mục:** [NPE | Concurrency | Security | Resource Leak | N+1 Query]
- **Bằng chứng:** Trích dẫn chính xác dòng code và luồng dữ liệu dẫn đến lỗi.
- **Rủi ro thực tế:** Hậu quả cụ thể khi chạy production (crash server, rò rỉ dữ liệu, chậm DB...).
- **Đề xuất khắc phục (Code Fix):**
```java
// Mã nguồn đã sửa chuẩn xác
```
```

---

## ⚡ 5. Quy Trình Review Tiêu Chuẩn Cho Agent

1. **Khảo sát Diff:** Chạy `git diff` hoặc đọc file để xác định danh sách tệp thay đổi.
2. **Deterministic Filter:** Loại bỏ file cấu hình lockfile, media, file build generated.
3. **Deep Investigation:** Với các phương thức có thay đổi, lần ngược các lời gọi để kiểm tra null safety và concurrency.
4. **Viết Báo Cáo:** Đưa ra bảng tổng kết số lượng phát hiện theo cấp độ (Blocker / Warning / Suggestion).
5. **Cung cấp Patch:** Sẵn sàng hỗ trợ người dùng áp dụng bản vá ngay khi được yêu cầu.
