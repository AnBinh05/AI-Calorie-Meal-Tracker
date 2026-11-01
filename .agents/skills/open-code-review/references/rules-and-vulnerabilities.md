# 📖 Alibaba Open Code Review (OCR) — Rules & Vulnerabilities Reference

Tài liệu tham chiếu chi tiết các mẫu vi phạm (Anti-patterns), lỗ hổng bảo mật và quy tắc kiểm tra tiêu chuẩn từ **Alibaba Open Code Review**.

---

## 1. 🛡️ Null Pointer Exceptions (NPE) & Nil Safety

### Java & Spring Boot
* **Chaining Dereference:** `a.getB().getC()` khi `getB()` có khả năng trả về `null`.
* **Unboxing Null Wrapper:** `Double val = map.get("key"); double primitive = val;` nếu key không tồn tại sẽ gây `NullPointerException` tại runtime.
* **Optional Anti-pattern:** Gọi trực tiếp `optional.get()` mà không qua `isPresent()`, `orElse()`, hoặc `orElseThrow()`.
* **Stream Operations:** Các phép toán `mapToDouble(DTO::getValue)` khi trường `getValue()` cho phép `null`. Bắt buộc phải có toán tử ternary hoặc filter:
  ```java
  // ❌ NGUY HIỂM:
  items.stream().mapToDouble(Item::getCalories).sum();

  // ✅ AN TOÀN:
  items.stream().mapToDouble(i -> i.getCalories() != null ? i.getCalories() : 0.0).sum();
  ```

### TypeScript / React
* **Optional Chaining:** Thiếu `?.` khi đọc mảng hoặc object từ API response:
  ```ts
  // ❌ data.items.map(...)
  // ✅ data?.items?.map(...) ?? []
  ```

---

## 2. ⚡ Concurrency & Thread Safety

* **Non-Thread-Safe Objects dùng chung:** Khai báo `SimpleDateFormat`, `DecimalFormat`, hoặc `StringBuilder` làm `static` hoặc trường dùng chung giữa các luồng.
* **Race Condition trong Counter:** Dùng `int count = count + 1` thay vì `AtomicInteger` hoặc cập nhật DB nguyên tử (`UPDATE table SET count = count + 1`).
* **Unsafe Collection Sharing:** Dùng `HashMap` hoặc `ArrayList` trong Bean Singleton phục vụ đa luồng đồng thời mà không có đồng bộ hóa (nên dùng `ConcurrentHashMap`).

---

## 3. 🔒 Bảo Mật (Security & OWASP)

* **IDOR (Insecure Direct Object Reference):** Truy vấn tài nguyên dựa trên ID người dùng truyền lên mà không so sánh với ID người dùng đang đăng nhập:
  ```java
  // ❌ LỖ HỔNG IDOR:
  mealRepository.findById(mealId);

  // ✅ ĐÃ BẢO VỆ:
  mealRepository.findByIdAndUserId(mealId, currentUser.getId());
  ```
* **SQL / HQL Injection:** Ghép chuỗi trực tiếp trong JPQL/Native Query thay vì bind parameters (`:param`).
* **Path Traversal:** Nhận tên file trực tiếp từ client khi lưu file lên đĩa. Bắt buộc sinh tên ngẫu nhiên qua `UUID.randomUUID()` và validate extension.
* **Lộ Bí Mật (Credential Leakage):** Hardcode `GEMINI_API_KEY`, `JWT_SECRET`, password database trong code hoặc file config được track trên Git.

---

## 4. 🚰 Rò Rỉ Tài Nguyên (Resource Leaks)

* **Unclosed Streams:** `FileInputStream`, `BufferedReader`, `ByteArrayOutputStream` không bọc trong `try-with-resources`.
* **Database Connection Leaks:** Mở connection trực tiếp mà không giải phóng trong khối `finally`.
* **Frontend Event Listeners:** Gọi `addEventListener`, `setInterval`, hoặc WebSocket subscription trong `useEffect` mà quên hàm dọn dẹp `return () => ...`.

---

## 5. 🗄️ Hiệu Năng & ORM (Database & N+1 Queries)

* **N+1 Query trong JPA:** Truy vấn một danh sách cha (`Meal`), sau đó khi duyệt danh sách con (`MealItem`) lại phát sinh thêm N câu query phụ do quan hệ `OneToMany` dạng `LAZY`.
  * **Giải pháp:** Sử dụng `@EntityGraph`, `join fetch`, hoặc `@BatchSize(size = 20)`.
* **Missing Index / Full Table Scan:** Truy vấn lọc trên trường tìm kiếm thường xuyên (`user_id`, `created_at`) mà chưa đánh index tương ứng.
* **Pagination:** Trả về toàn bộ bản ghi bằng `findAll()` thay vì nhận `Pageable`.

---

## 6. ⚠️ Xử Lý Ngoại Lệ (Exception Handling)

* **Silent Catching (Nuốt lỗi):**
  ```java
  // ❌ TỐI KỴ:
  try {
      doSomething();
  } catch (Exception e) {
      // bỏ qua không làm gì hoặc chỉ in e.printStackTrace()
  }
  ```
* **Bắt buộc:** Phải log lỗi rõ ràng kèm ngữ cảnh `log.error("Lỗi khi...", e)` và ném `CustomException` phù hợp để GlobalExceptionHandler trả về mã lỗi HTTP chuẩn (400, 404, 500).
