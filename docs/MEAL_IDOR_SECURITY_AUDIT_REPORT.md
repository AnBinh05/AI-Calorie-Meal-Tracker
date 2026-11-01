# 🛡️ BÁO CÁO AUDIT BẢO MẬT: PHÒNG CHỐNG LỖ HỔNG IDOR TRONG `MealController` & `MealService`

> **Dự án:** NutriAI – AI Calorie & Meal Tracker  
> **Chuyên mục:** Application Security Audit (OWASP Top 10 - A01:2021 Broken Access Control / IDOR)  
> **Đối tượng Audit:**  
> - [`MealController.java`](file:///d:/AI-Calorie-Meal-Tracker/backend/src/main/java/com/calorie/tracker/controller/MealController.java)  
> - [`MealService.java`](file:///d:/AI-Calorie-Meal-Tracker/backend/src/main/java/com/calorie/tracker/service/MealService.java)  
> - [`MealRepository.java`](file:///d:/AI-Calorie-Meal-Tracker/backend/src/main/java/com/calorie/tracker/repository/MealRepository.java)  
> **Trạng thái:** ✅ **PASS — KHÔNG CÓ LỖ HỔNG IDOR (Secure by Design)**  

---

## 📌 1. Tóm tắt kết quả kiểm định (Executive Summary)

Sau khi rà soát từng dòng mã nguồn, luồng xử lý dữ liệu và các truy vấn CSDL, phân hệ quản lý bữa ăn (`Meals`) đã **triển khai hoàn hảo cơ chế phòng chống IDOR (Insecure Direct Object Reference)**. 

Người dùng A **hoàn toàn KHÔNG THỂ xem, chỉnh sửa hoặc xóa** bữa ăn của Người dùng B dù biết chính xác `id` của bữa ăn đó trên URL.

### 📊 Bảng ma trận kiểm tra quyền truy cập (Access Control Matrix)

| Endpoint | HTTP Method | Tham số nhận diện | Cơ chế xác thực & Phân quyền | Nguy cơ IDOR | Kết luận |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/meals` | `POST` | `CreateMealRequest` | User lấy từ JWT Token qua `userService.getCurrentAuthenticatedUser()`. Request DTO **không** chứa trường `userId`. | ❌ Không thể giả mạo `userId` | ✅ **SECURE** |
| `/api/v1/meals/daily` | `GET` | `?date=yyyy-MM-dd` | Lọc dữ liệu qua `findByUserIdAndMealDateOrderByCreatedAtDesc(user.getId(), ...)`. | ❌ Không thể xem ngày ăn của user khác | ✅ **SECURE** |
| `/api/v1/meals/{id}` | `GET` | `id` (Path Variable) | Truy vấn qua `findByIdAndUserId(id, user.getId())`. | ❌ Đổi `id` trên URL không xem được dữ liệu | ✅ **SECURE** |
| `/api/v1/meals/{id}` | `PUT` | `id` (Path Variable) | Truy vấn kiểm tra quyền sở hữu qua `findByIdAndUserId(id, user.getId())` trước khi update. | ❌ Đổi `id` trên URL không sửa được dữ liệu | ✅ **SECURE** |
| `/api/v1/meals/{id}` | `DELETE` | `id` (Path Variable) | Truy vấn kiểm tra quyền sở hữu qua `findByIdAndUserId(id, user.getId())` trước khi delete. | ❌ Đổi `id` trên URL không xóa được dữ liệu | ✅ **SECURE** |
| `/api/v1/meals/analyze`| `POST` | `image` (Multipart) | Endpoint yêu cầu JWT. Trả về Draft DTO, chưa ghi trực tiếp vào DB. File lưu với UUID ngẫu nhiên. | ❌ Không có object reference ID | ✅ **SECURE** |

---

## 🔍 2. Phân tích chi tiết từng tầng phòng thủ (In-Depth Analysis)

### 2.1. Nguồn danh tính người dùng (Identity Source of Truth)
* **Thực trạng mã nguồn:**
  Tại `MealService.java`:
  ```java
  User user = userService.getCurrentAuthenticatedUser();
  ```
  Thông tin `user` được bóc tách trực tiếp từ **Spring Security Context** (`SecurityContextHolder.getContext().getAuthentication().getName()`) đã được giải mã và kiểm tra chữ ký số từ JWT Bearer Token.
* **Đánh giá an ninh:**
  * ✅ **Không nhận `userId` từ Client:** Cả Controller và DTOs tuyệt đối không cho phép client truyền `userId` qua `@RequestParam`, `@PathVariable` hay `@RequestBody`. Kẻ tấn công không thể đổi tham số để gán bữa ăn cho tài khoản khác.

---

### 2.2. Kỹ thuật truy vấn kết hợp (Compound Querying `findByIdAndUserId`)
* **Thực trạng mã nguồn:**
  Tại `MealService.java` cho các hàm get/update/delete:
  ```java
  Meal meal = mealRepository.findByIdAndUserId(id, user.getId())
          .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bữa ăn với ID: " + id));
  ```
* **Kịch bản tấn công thử nghiệm (Attack Scenario):**
  1. User B có bữa ăn bí mật với `id = 100`.
  2. Kẻ tấn công là User A đăng nhập hợp lệ và nhận Token A.
  3. Kẻ tấn công gửi request: `GET /api/v1/meals/100` hoặc `DELETE /api/v1/meals/100` với Header `Authorization: Bearer <Token_A>`.
  4. Repository thực thi câu lệnh SQL:
     ```sql
     SELECT * FROM meals WHERE id = 100 AND user_id = <User_A_Id>;
     ```
  5. Vì bản ghi `id = 100` có `user_id = <User_B_Id>`, câu lệnh trả về kết quả rỗng (`Optional.empty()`).
  6. Service ném ra `ResourceNotFoundException`.
* **Đánh giá an ninh:**
  * ✅ **Phòng thủ triệt để:** Bất kỳ thao tác đọc, cập nhật hay xóa đều bị chặn đứng ngay tại tầng SQL nếu không khớp `user_id`.

---

### 2.3. Chống rò rỉ thông tin qua mã lỗi (Defense against Resource Enumeration)
* **Thực trạng mã nguồn:**
  Khi `findByIdAndUserId` trả về rỗng, hệ thống ném ra `ResourceNotFoundException` và trả về mã lỗi **`404 Not Found`** thay vì `403 Forbidden`.
* **Đánh giá an ninh theo chuẩn OWASP:**
  * ✅ **Tuyệt vời:** Nếu trả về `403 Forbidden`, kẻ tấn công có thể thực hiện tấn công dò quét (Enumeration/Oracle Attack) để biết được những ID nào thực sự tồn tại trong hệ thống. Việc trả về đồng nhất `404 Not Found` khiến kẻ tấn công không thể phân biệt được giữa việc "bữa ăn không tồn tại" và "bữa ăn thuộc về người khác".

---

### 2.4. Tính toàn vẹn của các món thành phần (`MealItem`)
* **Thực trạng mã nguồn:**
  Khi cập nhật bữa ăn (`updateMeal`), danh sách món con cũ được xóa sạch (`meal.getItems().clear()`) và tạo lại từ danh sách DTO mới gửi lên thông qua quan hệ `cascade = CascadeType.ALL, orphanRemoval = true`.
* **Đánh giá an ninh:**
  * ✅ Hệ thống không cung cấp endpoint độc lập sửa xóa trực tiếp món con như `/api/v1/meal-items/{itemId}`. Mọi thao tác đều phải đi qua `Meal` cha đã được kiểm tra quyền sở hữu. Do đó, không có lỗ hổng IDOR trên các món ăn thành phần.

---

## 💡 3. Các cải tiến bảo mật & tối ưu đã áp dụng (Hardened Implementations)

Dựa trên kết quả audit, 3 cải tiến bảo mật và tối ưu hiệu năng đã được áp dụng trực tiếp vào mã nguồn:

1. **Tối ưu N+1 Query DoS Prevention (`MealRepository.java` & `FavoriteMealRepository.java`):**
   * Bổ sung `@EntityGraph(attributePaths = {"items"})` để tải eager các món con trong 1 câu lệnh SQL duy nhất thay vì N truy vấn phụ.
2. **Xác thực tham số `@PathVariable @Positive` (`MealController.java` & `FavoriteMealController.java`):**
   * Gắn `@Validated` tại mức class và `@Positive` cho tham số `{id}` để loại bỏ các ID âm hoặc không hợp lệ ngay tại tầng Controller.
3. **Quản lý Transaction an toàn (`MealService.java`):**
   * Bổ sung `@Transactional(readOnly = true)` tại mức Class để các thao tác đọc chạy ở chế độ tối ưu hóa bộ nhớ và bảo vệ session.
