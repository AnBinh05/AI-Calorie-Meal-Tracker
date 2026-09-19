# TÀI LIỆU YÊU CẦU SẢN PHẨM (PRD)
# THIẾT KẾ GIAO DIỆN WEB DASHBOARD TRÊN FIGMA (UI/UX DESIGN SPECIFICATIONS)
## DỰ ÁN: NUTRIAI – AI CALORIE & MEAL TRACKER

> **Phiên bản:** 1.0.0  
> **Trạng thái:** Sẵn sàng thiết kế (Ready for Figma Design)  
> **Tài liệu liên quan:** 
> - [Figma Design Document](file:///d:/AI-Calorie-Meal-Tracker/docs/designs/figma-design.md)
> - [Master Project PRD](file:///d:/AI-Calorie-Meal-Tracker/docs/prd/prd-ai-calorie-meal-tracker.md)
> - **Figma Canvas URL:** [Figma Design Canvas](https://www.figma.com/design/9EWSQ8wvef3FiUdsTeDv7P/AI-Calorie-Meal-Tracker?node-id=0-1)

---

## 1. Giới thiệu & Tổng quan (Introduction / Overview)

Tài liệu PRD này định nghĩa toàn diện các yêu cầu chức năng, giao diện, luồng trải nghiệm người dùng (User Flows), quy chuẩn thành phần (Component Library) và thông số kỹ thuật (Design Tokens & Handoff Specs) nhằm phục vụ việc thiết kế trọn bộ giao diện **Web Dashboard** trên Figma cho sản phẩm **NutriAI – AI Calorie & Meal Tracker**.

Web Dashboard đóng vai trò là trung tâm tổng hợp, quản lý nhật ký dinh dưỡng và phân tích chuyên sâu cho người dùng trên trình duyệt máy tính, máy tính bảng và mobile web, đồng bộ trực tiếp với Mobile App và dịch vụ Backend Spring Boot.

---

## 2. Mục tiêu Thiết kế (Goals)

- **Trọn vẹn 6 phân hệ màn hình cốt lõi:** Thiết kế đầy đủ toàn bộ các màn hình người dùng: (1) Xác thực Auth, (2) Dashboard Tổng quan, (3) Nhật ký bữa ăn theo ngày, (4) Báo cáo & Xu hướng phân tích, (5) Thiết lập mục tiêu thể trạng, (6) Cài đặt hệ thống & AI.
- **Hệ thống Đa giao diện (Dual Theme - Light & Dark Mode):** 100% các màn hình và components được cấu hình Figma Color Variables hỗ trợ chuyển đổi tức thì giữa Light Mode và Dark Mode chuẩn công nghệ cao.
- **Đa kích thước Responsive (Multi-device Breakpoints):** Cung cấp layout và hành vi co giãn trực quan trên 3 độ phân giải tiêu chuẩn:
  - **Desktop:** 1440 × 900 px (Màn hình chính chuẩn Sidebar + Main Content)
  - **Tablet:** 1024 × 768 px & 768 × 1024 px (Sidebar thu gọn icon hoặc dạng Drawer)
  - **Mobile Web:** 375 × 812 px (Bottom Navigation Bar / Off-canvas Menu)
- **High-Fidelity Interactive Prototype & Dev Specs:** Tạo các luồng click qua lại mượt mà giữa các tab, modal phân tích ảnh AI, dropdown filter, popover chỉnh sửa gram; đồng thời gắn sẵn Auto-Layout, Spacing Token và Handoff Redlines cho Frontend Developer.

---

## 3. Danh sách User Stories & Tiêu chí Chấp nhận (User Stories)

### US-001: Bộ màn hình Xác thực Đăng ký & Đăng nhập (Auth Screens)
**Description:** Là một người dùng, tôi muốn xem giao diện Đăng ký và Đăng nhập chuyên nghiệp, hiện đại với minh họa trực quan về AI bóc tách món ăn để tôi tin tưởng và dễ dàng tạo tài khoản.

**Acceptance Criteria:**
- [ ] Thiết kế 2 màn hình riêng biệt: `Sign In` (Đăng nhập) và `Sign Up` (Đăng ký) trên cả 3 breakpoints (Desktop, Tablet, Mobile Web).
- [ ] Bố cục Desktop chia 2 cột: Cột trái (Form nhập liệu) và Cột phải (Showcase card đồ họa Forest Green `#064E3B` kèm ảnh đĩa ăn Cơm tấm sườn bì chả bóc tách macro).
- [ ] Form Đăng ký gồm: Họ và tên, Email, Mật khẩu có **Thanh đo độ mạnh mật khẩu trực quan (Live Password Strength Meter)** 4 cấp độ (Yếu - Trung bình - Khỏe - Rất mạnh).
- [ ] Selector chọn nhanh mục tiêu thể hình ban đầu (Giảm mỡ, Giữ cân, Tăng cơ) dạng Segmented Cards có icon minh họa.
- [ ] Nút mạng xã hội `🔴 Tiếp tục với Google` chuẩn nhận diện Google OAuth.
- [ ] Có đầy đủ các trạng thái tương tác: `Default`, `Focus Input`, `Error Validation`, `Loading Button`.
- [ ] Hỗ trợ cả 2 theme: Light Mode và Dark Mode.
- [ ] **[UI stories only]** Verify in browser using dev-browser skill.

---

### US-002: Màn hình Tổng quan Dashboard (Overview Dashboard)
**Description:** Là một người dùng, tôi muốn nhìn thấy ngay bảng điều khiển tổng quan lượng calo trong ngày, 3 thanh đo đa lượng chất (Carbs, Protein, Fat), khung quét ảnh AI và nhật ký hôm nay để nắm bắt dinh dưỡng tức thì.

**Acceptance Criteria:**
- [ ] Thiết kế Desktop 1440px có Sidebar cố định bên trái (Logo NutriAI, 5 mục menu, User Profile mini ở chân trang).
- [ ] Top App Bar chứa: Ô tìm kiếm nhanh với placeholder gợi ý, Widget hiển thị ngày tháng hiện tại kèm nút chuyển ngày hôm qua/hôm nay/ngày mai, Icon chuông thông báo và Avatar người dùng có dropdown menu.
- [ ] **Widget Tiến trình Calo Trung tâm (Daily Calorie Progress)**:
  - Biểu đồ tròn Donut Chart lớn thể hiện: Lượng đã nạp (`1,450 kcal`), Mục tiêu (`2,000 kcal`) và Calo còn lại (`550 kcal`).
  - Đổi màu viền sang Đỏ san hô `#EF4444` khi vượt mức 100%.
  - 3 thanh Progress bar ngang cho Macros: **Carbs** (Cam `#F59E0B`), **Protein** (Xanh dương `#3B82F6`), **Fat** (Hồng `#EC4899`) kèm số gram thực tế / mục tiêu.
- [ ] **Khu vực Quét món ăn bằng AI (AI Quick Scan Dropzone)**:
  - Khung viền nét đứt hiện đại hỗ trợ Drag & Drop ảnh đĩa ăn từ máy tính.
  - Nút CTA nổi bật `✨ Bắt đầu phân tích Calo` (Nền Dark Navy `#1E293B` hoặc Emerald `#10B981`).
- [ ] **Danh sách Bữa ăn hôm nay**:
  - Phân chia 4 thẻ Accordion/Card: Bữa sáng, Bữa trưa, Bữa tối, Bữa phụ.
  - Thẻ bữa đã có món: Danh sách món ăn, thumbnail ảnh, macro từng món, nút Xóa/Sửa.
  - Thẻ bữa chưa có món: Dạng Empty State nét đứt kèm nút `+ Thêm món nhanh`.
- [ ] **Mini Chart Xu hướng 7 ngày**: Biểu đồ cột mini ở góc phải thể hiện calo 7 ngày trong tuần với đường mục tiêu chấm nét.
- [ ] **[UI stories only]** Verify in browser using dev-browser skill.

---

### US-003: Modal Tương tác Phân tích & Tinh chỉnh Bữa ăn AI (AI Meal Review Modal)
**Description:** Là một người dùng, tôi muốn có một cửa sổ modal mở lên sau khi tải ảnh để xem kết quả AI bóc tách từng món ăn, sửa số gram, thêm gia vị/dầu mỡ và xác nhận lưu.

**Acceptance Criteria:**
- [ ] Cửa sổ Modal thiết kế tỉ lệ vàng nổi bật giữa màn hình với nền Overlay làm mờ (Backdrop Blur).
- [ ] Cột trái hiển thị ảnh chụp đĩa ăn gốc có gắn các đốm định vị (Bounding/Pin labels) đánh dấu từng món trên đĩa.
- [ ] Cột phải hiển thị danh sách thành phần được AI bóc tách:
  - Tên món ăn (Ví dụ: *Sườn nướng, Cơm tấm, Trứng ốp la, Chả bì*).
  - Ô chỉnh sửa khối lượng gram trực tiếp (Input number kèm nút tăng giảm `+` `-`).
  - Badge nhãn Calo và 3 chỉ số Macro (Carb, Pro, Fat) tự động nhảy số theo thời gian thực khi sửa gram.
  - Checkbox tùy chọn: *"Bổ sung calo dầu mỡ/gia vị xào nấu (+10-15%)"*.
- [ ] Nút bấm hành động: `+ Thêm món khác thủ công`, `Hủy bỏ`, và nút chính `💾 Lưu vào Nhật ký bữa ăn`.
- [ ] Có animation state: `Skeleton Loading Shimmer` khi AI đang phân tích ảnh.
- [ ] **[UI stories only]** Verify in browser using dev-browser skill.

---

### US-004: Màn hình Chi tiết Nhật ký Bữa ăn (Meal Diary Detailed View)
**Description:** Là một người dùng, tôi muốn xem lại toàn bộ lịch sử ăn uống theo từng ngày cụ thể, lọc theo tuần/tháng và nhận diện rõ món nào do AI phân tích hay nhập thủ công.

**Acceptance Criteria:**
- [ ] Bộ chọn thời gian (Calendar Strip / Datepicker): Cho phép chọn tháng/năm và dải ngày 7 ngày trong tuần dạng nút bấm tab trực quan (Thứ 2 đến Chủ nhật) kèm badge chấm xanh cho các ngày đã ghi nhật ký đủ.
- [ ] Danh sách chi tiết phân cụm 4 bữa (Sáng, Trưa, Tối, Phụ):
  - Mỗi món ăn có **Source Badge**: `✨ AI Scan` (Màu tím/xanh nhạt) hoặc `✍️ Thủ công` (Màu xám/slate).
  - Hiển thị đầy đủ cột số liệu: Khối lượng (g), Năng lượng (kcal), Carbs (g), Protein (g), Fat (g).
- [ ] Thao tác nhanh trên từng hàng món: Nút chỉnh sửa bút chì, nút xóa thùng rác.
- [ ] Nút bấm `+ Thêm bữa ăn` cố định trên góc phải header.
- [ ] Thanh tổng kết dinh dưỡng cuối trang: Tổng nạp trong ngày vs Mục tiêu đề ra.
- [ ] **[UI stories only]** Verify in browser using dev-browser skill.

---

### US-005: Màn hình Báo cáo & Phân tích Xu hướng (Analytics & Trends)
**Description:** Là một người dùng hoặc PT, tôi muốn xem các biểu đồ phân tích chuyên sâu về lượng Calo nạp qua các ngày, tỷ lệ cân đối Macros và các phân tích khuyến nghị từ AI.

**Acceptance Criteria:**
- [ ] Bộ lọc khoảng thời gian trên Header: Dropdown chọn `7 Ngày qua`, `30 Ngày qua`, `3 Tháng qua`, `Tùy chọn khoảng ngày`.
- [ ] Nút bấm `📥 Xuất báo cáo` mở ra Dropdown xuất file **CSV (Excel)** và **PDF**.
- [ ] **Biểu đồ Cột Calo Hàng ngày (Daily Calorie Bar Chart)**:
  - Cột màu xanh lá biểu thị ngày trong mức mục tiêu (+/- 10%).
  - Cột màu vàng/đỏ biểu thị ngày vượt mức hoặc quá thấp so với mục tiêu.
  - Đường tham chiếu mục tiêu (Target Line 2,000 kcal) đứt nét màu xám đậm.
  - Hover Tooltip hiển thị chi tiết: Ngày, Calo nạp, Mức chênh lệch, Số bữa đã ăn.
- [ ] **Biểu đồ Phân bổ Macro (Macro Distribution Chart)**:
  - Biểu đồ Donut/Pie thể hiện tỷ lệ % thực tế (Ví dụ: Carbs 45%, Protein 30%, Fat 25%) so sánh với tỷ lệ khuyến nghị.
- [ ] **Hộp Khuyến nghị Thông minh từ AI (AI Insight Callout Box)**:
  - Khung viền phát sáng nhẹ, icon bóng đèn `💡`.
  - Văn bản phân tích tóm tắt: Đánh giá độ đều đặn thâm hụt calo, chất lượng nguồn đạm, khuyến nghị nước uống và lời khuyên bữa tối.
- [ ] **[UI stories only]** Verify in browser using dev-browser skill.

---

### US-006: Màn hình Thiết lập Mục tiêu Dinh dưỡng (Nutrition Goals)
**Description:** Là một người dùng, tôi muốn tùy chỉnh mục tiêu cân nặng (Giảm mỡ, Giữ cân, Tăng cơ) và kéo các thanh trượt điều chỉnh Calo và Macros theo ý muốn.

**Acceptance Criteria:**
- [ ] **3 Thẻ Chiến lược Mục tiêu Lớn (Goal Preset Cards)**:
  - `Giảm mỡ (Fat Loss)`: Badge thâm hụt `-400 kcal/ngày`.
  - `Giữ cân (Maintenance)`: Badge cân bằng `0 kcal`.
  - `Tăng cơ (Lean Bulk)`: Badge thặng dư `+300 kcal/ngày`.
- [ ] **Bộ công cụ Tính toán BMR & TDEE tương tác**:
  - Hiển thị công thức và kết quả tính toán tự động từ chiều cao, cân nặng, tuổi, mức độ vận động.
- [ ] **Thanh trượt điều chỉnh Mục tiêu (Interactive Sliders)**:
  - Slider Calo mục tiêu tổng (từ 1,200 đến 4,000 kcal).
  - 3 Sliders liên kết tỷ lệ % Protein, Carbs, Fat (Tổng tự động khóa ở 100%).
  - Hiển thị song song số gram quy đổi tương ứng (Ví dụ: `150g Protein = 600 kcal`).
- [ ] Nút `Lưu thay đổi` và nút `Khôi phục chuẩn khoa học khuyến nghị`.
- [ ] **[UI stories only]** Verify in browser using dev-browser skill.

---

### US-007: Màn hình Cài đặt Hệ thống (Settings & Preferences)
**Description:** Là một người dùng, tôi muốn cấu hình tham số bóc tách AI, kết nối đồng bộ dữ liệu và chuyển đổi giao diện Light/Dark mode.

**Acceptance Criteria:**
- [ ] **Cấu hình AI Dinh dưỡng (AI Preferences)**:
  - Toggle Switch: *Tự động ước tính thêm dầu mỡ & sốt gia vị (+10–15%)*.
  - Toggle Switch: *Ưu tiên nhận diện ẩm thực Việt Nam*.
  - Dropdown: *Độ phân giải và mô hình phân tích (Nhanh / Tiêu chuẩn / Chuyên sâu)*.
- [ ] **Giao diện & Ngôn ngữ (Appearance & Localization)**:
  - Bộ chọn Theme: `Sáng (Light)`, `Tối (Dark)`, `Tự động theo hệ thống (System)`.
  - Bộ chọn Ngôn ngữ: `Tiếng Việt`, `English`.
- [ ] **Tích hợp Sức khỏe (Integrations)**:
  - Thẻ kết nối với `Apple Health`, `Google Fit`, `Garmin Connect` (Trạng thái Connected / Disconnected).
- [ ] **Quản lý Dữ liệu & Tài khoản (Data Management)**:
  - Nút Xóa toàn bộ nhật ký (có modal xác nhận 2 bước chống xóa nhầm).
  - Nút Đăng xuất và Xóa tài khoản vĩnh viễn.
- [ ] **[UI stories only]** Verify in browser using dev-browser skill.

---

## 4. Yêu cầu Chức năng Thiết kế (Functional Design Requirements - FR)

- **FR-1 [Sidebar Navigation Component]:** Thành phần Sidebar bên trái phải hỗ trợ 3 trạng thái Responsive:
  - *Desktop (>= 1200px):* Chiều rộng 260px, hiển thị đầy đủ Icon + Text + Badge + User Card.
  - *Tablet (768px - 1199px):* Chiều rộng 80px (Collapsed Icon-only with Tooltip on Hover).
  - *Mobile (< 768px):* Ẩn Sidebar, chuyển thành Bottom Navigation Bar (4 icons) + Hamburger Menu.
- **FR-2 [Top App Bar Component]:** Cố định trên cùng (Sticky Header), chiều cao 72px trên Desktop và 56px trên Mobile, chứa Title/Breadcrumb, Date Widget, Quick Search và Profile Pill.
- **FR-3 [Design Tokens & Variables]:** Toàn bộ Color, Spacing, Radius, Typography và Shadows trên Figma phải được lưu dưới dạng **Figma Local Variables** (hoặc Tokens Studio) hỗ trợ Mode switching (Light / Dark).
- **FR-4 [Macro Badges & Progress Bars]:** Xây dựng component Macro tái sử dụng với 3 biến thể màu chuẩn:
  - Carbs: `#F59E0B` (Light) / `#FBBF24` (Dark)
  - Protein: `#3B82F6` (Light) / `#60A5FA` (Dark)
  - Fat: `#EC4899` (Light) / `#F472B6` (Dark)
- **FR-5 [Interactive State Variants]:** Tất cả các Buttons, Form Inputs, Dropdown Selectors, Checkboxes, Switches phải có đầy đủ ít nhất 5 states: `Default`, `Hover`, `Active/Pressed`, `Disabled`, `Focused/Error`.
- **FR-6 [Modal & Toast Notification System]:** Thiết kế khung Modal chuẩn (Small: 400px, Medium: 600px, Large: 900px) và hệ thống thông báo Toast (Success, Error, Warning, Info) góc trên bên phải màn hình.
- **FR-7 [Empty State & Error Fallbacks]:** Mỗi màn hình danh sách (Nhật ký, Báo cáo, Bữa ăn) phải có bản vẽ Empty State với minh họa vector dễ thương và nút CTA khuyến khích hành động.

---

## 5. Danh mục Ngoài phạm vi Thiết kế (Non-Goals / Out of Scope)

- **Không** thiết kế màn hình quản trị hệ thống đa cấp bậc (Super Admin CMS) trong phạm vi tài liệu này.
- **Không** thiết kế giao diện thanh toán cổng Payment Gateway (do giai đoạn MVP áp dụng miễn phí 100%).
- **Không** vẽ các màn hình mạng xã hội cộng đồng (Social Feed, Chat giữa người dùng).

---

## 6. Đặc tả Thiết kế & Hệ thống Design System (Design Specifications)

### 6.1 Bảng Màu Chuẩn (Dual-Theme Color Tokens)

| Token Name | Vai trò / Áp dụng | Light Mode HEX | Dark Mode HEX |
| :--- | :--- | :--- | :--- |
| `color-brand-primary` | Màu thương hiệu chính, nút CTA | `#10B981` (Emerald) | `#059669` |
| `color-brand-accent` | Điểm nhấn thương hiệu, badge | `#059669` | `#34D399` |
| `color-bg-app` | Nền tổng thể toàn bộ trang | `#F8FAFC` (Slate 50) | `#0F172A` (Slate 900) |
| `color-bg-surface` | Nền thẻ Card, Modal, Sidebar | `#FFFFFF` | `#1E293B` (Slate 800) |
| `color-bg-surface-subtle` | Nền ô input, bảng header | `#F1F5F9` (Slate 100) | `#334155` (Slate 700) |
| `color-text-primary` | Tiêu đề, số liệu chính, text đậm | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) |
| `color-text-secondary` | Nhãn phụ, đơn vị đo (kcal, g) | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) |
| `color-text-muted` | Placeholder, thời gian mờ | `#94A3B8` (Slate 400) | `#64748B` (Slate 500) |
| `color-border-default` | Đường viền thẻ card, divider | `#E2E8F0` (Slate 200) | `#334155` (Slate 700) |
| `color-macro-carbs` | Thanh đo & nhãn Carbohydrates | `#F59E0B` (Amber 500) | `#FBBF24` (Amber 400) |
| `color-macro-protein` | Thanh đo & nhãn Protein | `#3B82F6` (Blue 500) | `#60A5FA` (Blue 400) |
| `color-macro-fat` | Thanh đo & nhãn Chất béo (Fat) | `#EC4899` (Pink 500) | `#F472B6` (Pink 400) |
| `color-status-success` | Trạng thái hoàn thành, đạt chỉ tiêu | `#10B981` | `#34D399` |
| `color-status-warning` | Cảnh báo gần chạm ngưỡng | `#F59E0B` | `#FBBF24` |
| `color-status-danger` | Cảnh báo vượt mức calo | `#EF4444` (Red 500) | `#F87171` (Red 400) |

---

### 6.2 Hệ thống Typography (Kiểu chữ)

- **Font Family:** `Inter` hoặc `Plus Jakarta Sans` (Google Fonts, hỗ trợ Tiếng Việt sắc nét).
- **Hệ thống cấp bậc chữ (Type Scale):**
  - **Display 1 (Calo lớn):** 36px / Line Height: 44px / Bold (700)
  - **Heading 1 (Tên màn hình):** 24px / Line Height: 32px / Bold (700)
  - **Heading 2 (Tên thẻ Card/Nhóm bữa):** 18px / Line Height: 26px / SemiBold (600)
  - **Heading 3 (Tiêu đề món ăn, widget):** 16px / Line Height: 24px / SemiBold (600)
  - **Body Regular (Nội dung thông thường):** 14px / Line Height: 20px / Regular (400)
  - **Body Medium (Nút bấm, nhãn input):** 14px / Line Height: 20px / Medium (500)
  - **Caption / Badge (Đơn vị đo, ngày giờ):** 12px / Line Height: 16px / Medium (500)

---

### 6.3 Quy chuẩn Khoảng cách, Bo góc & Đổ bóng (Spacing, Radius & Shadows)

- **Spacing Grid:** 4px Base Grid (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `48px`).
- **Corner Radius:**
  - `radius-sm`: `6px` (Badges, tags nhỏ, input fields)
  - `radius-md`: `10px` (Buttons, dropdowns)
  - `radius-lg`: `16px` (Cards, Container widgets)
  - `radius-xl`: `24px` (Modals lớn, Dropzone quét ảnh)
  - `radius-full`: `9999px` (Pills, Avatar, Status dots)
- **Elevation / Shadows:**
  - `shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` (Thẻ card nhẹ)
  - `shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)` (Hover card, Dropdown)
  - `shadow-xl`: `0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` (Modal, Dialog)

---

### 6.4 Quy chuẩn Responsive Breakpoints & Lưới (Grid Systems)

1. **Desktop Frame (1440 × 900 px):**
   - Sidebar: `260px` cố định bên trái.
   - Main Content: 12 Columns, Gutter: `24px`, Margin: `32px`.
2. **Tablet Frame (1024 × 768 px & 768 × 1024 px):**
   - Sidebar: `80px` Icon-only (hoặc Overlay Drawer khi nhấn Menu icon).
   - Main Content: 8 Columns, Gutter: `16px`, Margin: `20px`.
3. **Mobile Web Frame (375 × 812 px):**
   - Top Header: `56px` + Bottom Nav Bar: `64px`.
   - Main Content: 4 Columns, Gutter: `12px`, Margin: `16px` (Bố cục 1 cột cuộn dọc).

---

## 7. Cân nhắc Kỹ thuật & Bàn giao Lập trình (Technical Handoff Specs)

- **Figma Auto-Layout 100%:** Mọi frames, cards, buttons và components danh sách bắt buộc sử dụng Figma Auto-Layout với các quy tắc `Fill Container` (chiều ngang) và `Hug Contents` (chiều dọc) để phục vụ lập trình CSS Flexbox/Grid chuẩn xác.
- **Quy chuẩn Đặt tên Layer & Frame:** Đặt tên rõ ràng theo quy tắc BEM / Functional naming (ví dụ: `Sidebar/NavItem/Active`, `Card/MealSummary/Dinner`, `Modal/AIReview/Default`).
- **Icons Standard:** Sử dụng bộ icon vector đồng nhất **Lucide Icons** hoặc **Phosphor Icons** dạng 24x24px vector outline.
- **Tương thích CSS & Framework:** Toàn bộ thiết kế được tối ưu sẵn cho việc triển khai trên Frontend:
  - **Framework:** React 18 + Vite + TypeScript.
  - **Styling:** Vanilla CSS Modules / CSS Variables tương ứng 1:1 với Figma Tokens.
  - **Charts:** Tương thích trực tiếp với thư viện `Recharts` hoặc `Chart.js`.
- **Chuẩn bị Tài nguyên Xuất khẩu (Export Assets):** Đánh dấu sẵn Export (`SVG`, `PNG @2x`, `@3x`) cho toàn bộ Logos, Icons và Minh họa Empty State.

---

## 8. Kịch bản Luồng Tương tác Prototyping (Figma Interactive Prototype Scenarios)

1. **Luồng Xác thực:** `Sign In Screen` ➔ Bấm "Đăng ký ngay" ➔ Chuyển `Sign Up Screen` ➔ Điền form & chọn mục tiêu ➔ Bấm "Tạo tài khoản" ➔ Chuyển vào `Overview Dashboard`.
2. **Luồng Quét món AI & Lưu nhật ký:** Tại `Overview Dashboard` ➔ Kéo thả ảnh vào `AI Quick Scan Dropzone` (hoặc bấm nút "✨ Bắt đầu phân tích Calo") ➔ Hiện Shimmer Loading trong 2 giây ➔ Bật `AI Meal Review Modal` với danh sách món bóc tách ➔ Sửa số gram sườn nướng từ 150g lên 200g (calo tự cập nhật) ➔ Bấm "💾 Lưu vào Nhật ký" ➔ Đóng Modal và hiển thị Toast Success ➔ Thẻ Bữa trưa trên Dashboard tăng calo.
3. **Luồng Xem báo cáo & Xuất file:** Bấm tab `Báo cáo & Xu hướng` trên Sidebar ➔ Đổi bộ lọc từ "7 Ngày qua" sang "30 Ngày qua" (biểu đồ re-render) ➔ Bấm nút "Xuất báo cáo" ➔ Mở menu chọn CSV / PDF ➔ Trigger hiệu ứng tải xuống giả lập.
4. **Luồng Chuyển đổi Theme:** Bấm icon Mặt trời/Mặt trăng trên Top Bar hoặc vào `Cài đặt` ➔ Đổi sang Dark Mode ➔ Toàn bộ giao diện chuyển sang tông nền Forest/Slate tối sang trọng.

---

## 9. Chỉ số Đo lường Thành công Thiết kế (Design Success Metrics)

- **Tính rõ ràng & Khả dụng (Usability & SUS Score):** Đạt điểm System Usability Scale (SUS) >= 85 điểm khi thực hiện kiểm thử trên Figma Prototype với người dùng thử nghiệm.
- **Hiệu quả Bàn giao (Dev Handoff Efficiency):** Giảm 100% các câu hỏi mơ hồ về khoảng cách, màu sắc và responsive giữa Designer và Developer nhờ Figma Variables và Auto-Layout.
- **Độ tương phản chuẩn WCAG 2.1 AA:** Tất cả các cấp độ văn bản và biểu đồ đạt tỷ lệ tương phản tối thiểu `4.5:1` đối với văn bản thường và `3:1` đối với tiêu đề/đồ họa trên cả 2 giao diện Sáng & Tối.
- **Thời gian hoàn thành tác vụ (Task Completion Time):** Người dùng hoàn thành việc xem biểu đồ và log 1 bữa ăn trong vòng dưới 3 lượt click trên prototype.

---

## 10. Câu hỏi Mở & Kế hoạch Thực hiện (Open Questions & Next Steps)

1. **Minh họa Trạng thái AI:** Có cần thiết kế thêm một màn hình hướng dẫn người dùng "Cách chụp đĩa ăn chuẩn góc 45 độ" trước khi tải ảnh không?
2. **Kế hoạch Thực hiện Thiết kế trên Figma:**
   - **Giai đoạn 1:** Thiết lập Figma Local Variables (Colors Light/Dark, Typography, Radius, Shadows, Spacing).
   - **Giai đoạn 2:** Xây dựng Component Library (Buttons, Forms, Sidebar, TopBar, Macro Badges, Chart Containers).
   - **Giai đoạn 3:** Thiết kế 6 màn hình chính Desktop (1440px) cho Light Mode & Dark Mode.
   - **Giai đoạn 4:** Thiết kế các biến thể Responsive (Tablet 1024px/768px và Mobile Web 375px).
   - **Giai đoạn 5:** Tạo liên kết Prototyping tương tác, Micro-animations và tổ chức Dev Handoff Section.

---

## 11. Bảng Kiểm Tra PRD Hoàn Tất (PRD Verification Checklist)

- [x] Đã phỏng vấn và nhận đủ câu trả lời làm rõ từ người dùng (`1A, 2B, 3C, 4C`).
- [x] Bao quát đầy đủ 6 phân hệ màn hình của Web Dashboard NutriAI.
- [x] Quy định chi tiết hệ thống Dual Theme (Light Mode & Dark Mode) với bảng mã HEX chuẩn.
- [x] Quy định rõ 3 kích thước khung thiết kế Responsive (Desktop 1440px, Tablet 1024px/768px, Mobile Web 375px).
- [x] Có kịch bản High-Fidelity Prototype và thông số kỹ thuật Handoff cho Developer.
- [x] Đánh số thứ tự các yêu cầu chức năng (FR) và tiêu chí chấp nhận (AC) rõ ràng.
- [x] Đã lưu file chuẩn Markdown vào `tasks/prd-web-figma-ui-design.md`.
