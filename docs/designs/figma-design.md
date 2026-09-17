# 🎨 NutriAI - Tài Liệu Thiết Kế Figma (UI/UX Design Specifications)

> **Dự án:** NutriAI – AI Calorie & Meal Tracker  
> **Figma Design URL:** [Figma Design Canvas](https://www.figma.com/design/9EWSQ8wvef3FiUdsTeDv7P/AI-Calorie-Meal-Tracker?node-id=0-1)  
> **Interactive Prototype URL:** [Figma Prototype Player (Node 11-20)](https://www.figma.com/proto/9EWSQ8wvef3FiUdsTeDv7P/AI-Calorie-Meal-Tracker?node-id=11-20&t=svMPikBiSviLB8xj-0)  
> **Slogan:** *"Ăn uống khoa học mà không cần cân đo phức tạp"*  
> **Cập nhật lần cuối:** 2026-09-17

---

## 📌 1. Tổng quan Bộ Thiết Kế (Design System Overview)

### 1.1. Bảng màu chuẩn (Color Palette)

| Phân loại | Tên màu | Mã HEX | Vai trò trong giao diện |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | Emerald Green | `#10B981` / `#059669` | Nút hành động chính, viền active, tiến trình calo chuẩn |
| **Background Tint** | Mint Light | `#E8F7F0` | Nền menu active, badge trạng thái tích cực |
| **Dark Showcase** | Forest Green | `#064E3B` / `#022C22` | Khung nổi bật trang Auth (Sign In / Sign Up) |
| **AI Action Button** | Midnight Navy | `#1E293B` | Nút kích hoạt AI phân tích ảnh (`✨ Bắt đầu phân tích Calo`) |
| **Carbohydrates** | Warm Amber | `#F59E0B` | Thanh đo & nhãn biểu thị Carb |
| **Protein** | Vibrant Blue | `#3B82F6` | Thanh đo & nhãn biểu thị Protein |
| **Fat (Chất béo)** | Magenta Pink | `#EC4899` | Thanh đo & nhãn biểu thị Fat |
| **Surface / Card** | Pure White | `#FFFFFF` | Thẻ card món ăn, container nội dung |
| **Base Background** | Soft Slate | `#F8FAFC` | Nền tổng thể Dashboard |
| **Text Primary** | Dark Slate | `#0F172A` | Tiêu đề, số calo lớn |
| **Text Secondary** | Muted Slate | `#64748B` | Đơn vị đo (kcal, g), nhãn phụ |

---

## 🖥️ 2. Danh Sách Màn Hình & Trải Nghiệm Chi Tiết (Screen Breakdown)

### 🟢 1. Đăng ký & Đăng nhập (Auth Flows)
* **Trang Đăng ký (`Bắt đầu hành trình mới`)**:
  * Form đăng ký: Họ và tên, Email, Mật khẩu (kèm thanh đo độ mạnh mật khẩu Live Strength Meter).
  * Bộ chọn nhanh mục tiêu thể hình: **Giảm mỡ**, **Giữ cân**, **Tăng cơ**.
  * Cột Showcase màu xanh rừng đậm (`#064E3B`) giới thiệu tính năng nhận diện món Việt tự động, tính BMR/TDEE và biểu đồ xu hướng.
* **Trang Đăng nhập (`Chào mừng trở lại!`)**:
  * Hỗ trợ nút đăng nhập nhanh **Google OAuth** (`🔴 Tiếp tục với Google`).
  * Form Email & Mật khẩu, checkbox "Ghi nhớ đăng nhập", liên kết "Quên mật khẩu".
  * Thẻ minh họa bóc tách món ăn AI thực tế (*Cơm tấm sườn bì chả - 650 kcal*) kèm đánh giá của người dùng.

---

### 🟢 2. Màn hình Tổng quan (`Tổng quan` - Dashboard Overview)
* **Sidebar Menu bên trái**:
  * Logo thương hiệu `NutriAI`.
  * Menu điều hướng: `Tổng quan`, `Nhật ký bữa ăn`, `Báo cáo & Xu hướng`, `Mục tiêu dinh dưỡng`, `Cài đặt`.
* **Top App Bar**:
  * Ô tìm kiếm nhanh: *"Nhập tên món ăn hoặc calories..."*.
  * Widget ngày: *"Hôm nay, 17 Th09"*.
  * Avatar hồ sơ người dùng (`AB`).
* **Widget Tiến trình Calo (`Tiến trình Calo hôm nay`)**:
  * Biểu đồ tròn Donut đo lượng Calo đã nạp (`1,450 kcal / 2,000 kcal`) và ngân sách còn lại (`còn 550 kcal`).
  * 3 thanh Macro ngang chi tiết:
    * **Carbs**: `140g / 220g` (Màu Cam `#F59E0B`)
    * **Protein**: `95g / 130g` (Màu Xanh dương `#3B82F6`)
    * **Fat**: `42g / 60g` (Màu Hồng `#EC4899`)
* **Khu vực tải ảnh AI (`Quét món ăn bằng AI`)**:
  * Khung kéo thả trực quan: *"Kéo thả ảnh đĩa ăn vào đây - Hỗ trợ JPG, PNG • AI tự bóc tách"*.
  * Nút CTA nổi bật: `✨ Bắt đầu phân tích Calo` (Nền xanh đen Navy).
* **Nhật ký món ăn trong ngày (`Nhật ký món ăn`)**:
  * **Bữa sáng (420 kcal)**: Phở bò tái (1 bát), Trà đào ít đường.
  * **Bữa trưa (650 kcal)**: Cơm sườn nướng, Canh cải ngọt.
  * **Bữa tối**: Thẻ placeholder nét đứt kèm nút `+ Thêm món` màu xanh lá.
* **Biểu đồ cột 7 ngày qua (`Calo 7 ngày qua`)**: Thể hiện xu hướng calo cả tuần.

---

### 🟢 3. Chi tiết Nhật ký Bữa ăn (`Nhật ký bữa ăn`)
* Bộ lọc thời gian theo tháng (`Tháng 9, 2026`) và dải ngày trong tuần trực quan (Thứ 2 14 -> Thứ 7 19).
* Phân loại từng món ăn theo bữa (Sáng, Trưa, Tối, Phụ).
* **Nhãn nguồn gốc dữ liệu (Source Badges)**:
  * Badge `AI Scan` cho các món được nhận diện từ camera/ảnh.
  * Badge `Thủ công` cho các món nhập tay.
* Chi tiết từng chất đa lượng trên từng món (ví dụ: *Phở bò chín: Carb 54g • Pro 22g • Fat 8g → 370 kcal*).

---

### 🟢 4. Báo cáo & Xu hướng (`Báo cáo & Xu hướng`)
* Bộ lọc khoảng thời gian: `30 Ngày qua ▾`.
* **Biểu đồ Cột Calo Hàng Ngày (`Lượng Calo Nạp Hàng Ngày`)**:
  * Chỉ số Calo trung bình: *1,890 kcal/ngày (Mục tiêu: 2,000 kcal)*.
  * Đường gióng mục tiêu 2,000 kcal để so sánh độ thâm hụt / dư thừa.
  * Cột màu xanh lá cho các ngày đạt chuẩn, cột vàng cam cho các ngày lệch mục tiêu.
* **Biểu đồ Tròn Tỉ lệ Macro (`Tỉ Lệ Đa Lượng (Macro)`)**:
  * Phân bổ thực tế: **45% Carb**, **30% Protein**, **25% Fat**.
* **Hộp Lời khuyên Thông minh từ AI (`💡 Đánh Giá Của AI Cho Chu Kỳ Vừa Qua`)**:
  * Gợi ý tự động: Duy trì thâm hụt calo đều đặn 5/7 ngày, Protein đạt 92% kỳ vọng, khuyến nghị tăng cường 500ml nước vào buổi chiều.

---

### 🟢 5. Thiết lập Mục tiêu Thể trạng (`Mục tiêu dinh dưỡng`)
* **3 Thẻ Chiến lược Mục tiêu**:
  1. **Giảm mỡ (Fat Loss)**: Thâm hụt 400 kcal/ngày để giảm cân an toàn.
  2. **Giữ cân (Maintenance)**: Cân bằng năng lượng nạp và tiêu hao.
  3. **Tăng cơ (Lean Bulk)**: Thặng dư calo nhẹ và tăng cường hàm lượng protein.
* **Thanh trượt điều chỉnh**:
  * Calo mục tiêu: `2,000 kcal`
  * Tỉ lệ % & gram chính xác cho Protein, Carbs, Fat.

---

### 🟢 6. Cài đặt Hệ thống (`Cài đặt`)
* **Cấu hình AI Phân tích hình ảnh**:
  * *Tự động tính thêm dầu mỡ & gia vị (+10–15% calo cho món xào, chiên)* → Bật.
  * *Mô hình nhận diện đa tầng độ chính xác cao* → Tùy chỉnh.
* **Tích hợp Dữ liệu Sức khỏe**: Kết nối Apple Health & Google Fit.
* **Quyền riêng tư**: Nút xóa toàn bộ dữ liệu nhật ký & macro khi cần làm mới.
