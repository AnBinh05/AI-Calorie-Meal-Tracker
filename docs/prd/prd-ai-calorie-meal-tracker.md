# TÀI LIỆU YÊU CẦU SẢN PHẨM (PRODUCT REQUIREMENTS DOCUMENT - PRD)
## DỰ ÁN: AI CALORIE & MEAL TRACKER (HỆ THỐNG THEO DÕI DINH DƯỠNG & CALO THÔNG MINH)

---

## 1. Giới thiệu & Tổng quan (Introduction & Overview)

### 1.1 Tóm tắt sản phẩm
**AI Calorie & Meal Tracker** là hệ thống theo dõi dinh dưỡng đa nền tảng (gồm Mobile App trên React Native/Expo, Backend dịch vụ Spring Boot và Web Dashboard trên React/Vite) giúp người dùng giải quyết triệt để nỗi đau mất thời gian và khó khăn khi nhập liệu nhật ký ăn uống thủ công.

Sản phẩm ứng dụng công nghệ thị giác máy tính **Gemini Flash Vision** để nhận diện tức thì các món ăn, ước lượng khối lượng (gram), phân tách năng lượng (Calories) và 3 nhóm đa lượng chất cốt lõi (**Protein, Carbs, Fat**) chỉ qua 1 bức ảnh chụp từ camera điện thoại. Đồng thời, hệ thống trao toàn quyền kiểm soát số liệu cho người dùng trước khi lưu và đồng bộ dữ liệu theo thời gian thực lên Web Dashboard để theo dõi xu hướng, phân tích nâng cao và xuất báo cáo PDF/CSV.

### 1.2 Bối cảnh & Vấn đề cần giải quyết
- **Nỗi đau 1:** Việc nhập nhật ký calo truyền thống (MyFitnessPal, FatSecret) bắt buộc tra cứu thủ công từng món ăn, mất 5–10 phút mỗi bữa khiến hơn 70% người dùng bỏ cuộc sau tuần đầu tiên.
- **Nỗi đau 2:** Các món ăn phức hợp (đặc biệt là ẩm thực Việt Nam như Cơm tấm, Phở, Bún chả...) rất khó bóc tách thủ công chính xác từng thành phần.
- **Nỗi đau 3:** Thiếu sự kết hợp giữa tính tiện lợi trên thiết bị di động và khả năng tổng hợp dữ liệu chuyên sâu trên máy tính để xuất báo cáo cho Huấn luyện viên thể hình (PT) hoặc chuyên gia dinh dưỡng.

---

## 2. Mục tiêu Sản phẩm (Goals)

- **Tối ưu tốc độ ghi nhận bữa ăn:** Giảm thời gian log 1 bữa ăn từ 5 phút xuống **dưới 8 giây** thông qua quy trình chụp ảnh và phân tích AI tự động.
- **Độ chính xác và tính linh hoạt:** Đạt độ chính xác nhận diện món ăn >= 85%, đồng thời cho phép người dùng điều chỉnh gram, sửa/xóa/thêm món linh hoạt 100%.
- **Cá nhân hóa theo chuẩn khoa học:** Tự động tính toán nhu cầu năng lượng (BMR theo công thức Mifflin-St Jeor và TDEE theo mức độ vận động) và phân bổ Macro chuẩn cho từng mục tiêu (Giảm cân, Tăng cơ, Duy trì).
- **Hệ sinh thái đa nền tảng đồng bộ:** Dữ liệu bữa ăn từ Mobile App lập tức được cập nhật và hiển thị biểu đồ phân tích 7 ngày / 30 ngày trên Web Dashboard, hỗ trợ xuất báo cáo định dạng CSV (UTF-8 BOM) và PDF tiêu chuẩn.

---

## 3. Danh sách User Stories (User Stories & Acceptance Criteria)

### US-001: Đăng ký, Đăng nhập & Xác thực Tài khoản an toàn
**Description:** Là một người dùng mới, tôi muốn đăng ký tài khoản bằng email/mật khẩu và đăng nhập an toàn để dữ liệu dinh dưỡng của tôi được lưu trữ bảo mật và đồng bộ giữa các thiết bị.

**Acceptance Criteria:**
- [ ] Cho phép đăng ký với `email`, `password` (tối thiểu 6 ký tự), `fullName`.
- [ ] Kiểm tra trùng lặp email; trả về mã lỗi `400 Bad Request` kèm thông báo rõ ràng nếu email đã tồn tại.
- [ ] Đăng nhập thành công trả về `JWT Token` và thông tin User Profile cơ bản.
- [ ] Token được lưu trữ bảo mật tại Client (`AsyncStorage` trên Mobile, `localStorage`/`state` trên Web).
- [ ] Tự động đính kèm header `Authorization: Bearer <token>` cho mọi request yêu cầu xác thực.
- [ ] Typecheck và linting toàn bộ mã nguồn pass 100%.

---

### US-002: Thiết lập Hồ sơ Thể trạng & Tính toán BMR / TDEE tự động
**Description:** Là một người dùng, tôi muốn nhập thông tin thể trạng (tuổi, giới tính, chiều cao, cân nặng, mức độ vận động, mục tiêu thể hình) để hệ thống tự động tính toán mức Calo mục tiêu và tỷ lệ Macros hàng ngày.

**Acceptance Criteria:**
- [ ] Giao diện Onboarding cho phép nhập: Giới tính (`MALE`/`FEMALE`), Tuổi, Chiều cao (cm), Cân nặng (kg), Mức độ vận động (5 cấp độ từ `SEDENTARY` đến `EXTRA_ACTIVE`), Mục tiêu (`LOSE_WEIGHT`, `MAINTAIN`, `GAIN_WEIGHT`).
- [ ] Backend tính BMR chuẩn xác theo công thức **Mifflin-St Jeor**:
  - Nam: `BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5`
  - Nữ: `BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161`
- [ ] Backend tính TDEE = `BMR × Activity Multiplier` (1.2, 1.375, 1.55, 1.725, 1.9).
- [ ] Tính `dailyCalorieTarget`:
  - `LOSE_WEIGHT`: `TDEE - 500 kcal`
  - `GAIN_WEIGHT`: `TDEE + 400 kcal`
  - `MAINTAIN`: `TDEE`
- [ ] Phân bổ Macros mục tiêu: Protein 30% tổng calo (4 kcal/g), Carbs 45% (4 kcal/g), Fat 25% (9 kcal/g).
- [ ] Typecheck và kiểm tra unit test tính toán BMR/TDEE pass 100%.

---

### US-003: Chụp ảnh & Nhận diện Bữa ăn bằng Gemini Flash Vision
**Description:** Là một người dùng, tôi muốn chụp ảnh bữa ăn từ điện thoại (hoặc chọn ảnh từ thư viện) để AI tự động nhận diện danh sách món ăn, số gram ước tính, lượng calories và macros.

**Acceptance Criteria:**
- [ ] Nút Camera nổi bật trên Mobile App cho phép mở Camera hoặc chọn ảnh từ Gallery.
- [ ] Ứng dụng tự động nén ảnh client-side (dung lượng < 1MB, kích thước chuẩn) trước khi upload.
- [ ] Backend nhận ảnh, lưu trữ vào S3 (hoặc Local Directory lưu tạm nếu không cấu hình S3) và gửi sang Google Gemini Flash API.
- [ ] Prompt AI hướng dẫn Gemini phân tích chi tiết món ăn (kể cả món ăn Việt Nam) và trả về JSON chuẩn: `foodName`, `weightGrams`, `calories`, `proteinGrams`, `carbsGrams`, `fatGrams`, `healthAdvice`.
- [ ] Có bộ xử lý Fallback (`getFallbackAnalysis`) an toàn nếu API Gemini bị lỗi quota hoặc timeout (> 10s).
- [ ] Thời gian trả kết quả phân tích AI trung bình <= 5 giây trên kết nối mạng thông thường.
- [ ] Verify trên Mobile Device / Simulator thành công.

---

### US-004: Màn hình Xem lại & Tinh chỉnh Bữa ăn (Review & Edit Screen)
**Description:** Là một người dùng, tôi muốn xem lại danh sách món ăn AI vừa bóc tách, có quyền sửa số gram, đổi tên món, thêm món mới hoặc xóa món ăn trước khi lưu vào nhật ký.

**Acceptance Criteria:**
- [ ] Hiển thị hình ảnh bữa ăn đã chụp cùng danh sách các món thành phần.
- [ ] Mỗi item món ăn hiển thị: Tên món, số gram (cho phép sửa trực tiếp), Calo, Protein, Carbs, Fat.
- [ ] Cho phép chọn phân loại bữa ăn: Sáng (`BREAKFAST`), Trưa (`LUNCH`), Tối (`DINNER`), Phụ (`SNACK`).
- [ ] Tự động tính toán lại tổng Calo và Macros toàn bữa ăn ngay khi người dùng thay đổi số gram hoặc thêm/xóa món.
- [ ] Nút "Thêm món thủ công" cho phép nhập thêm nguyên liệu/món ăn ngoài ảnh.
- [ ] Nút "Lưu bữa ăn" gửi dữ liệu hoàn chỉnh về API `POST /api/meals` và chuyển hướng về màn hình Nhật ký.
- [ ] Verify UI flows trên Mobile App hoàn chỉnh không có độ trễ.

---

### US-005: Quản lý Nhật ký Dinh dưỡng Hàng ngày (Daily Meal Diary)
**Description:** Là một người dùng, tôi muốn xem toàn bộ các bữa ăn đã ghi nhận trong ngày (phân theo Sáng, Trưa, Tối, Phụ) để theo dõi tổng thể lượng dinh dưỡng đã nạp.

**Acceptance Criteria:**
- [ ] Màn hình Diary hiển thị danh sách 4 nhóm bữa ăn: Sáng, Trưa, Tối, Phụ.
- [ ] Mỗi thẻ bữa ăn hiển thị thumbnail ảnh, tên các món ăn, tổng calo và tổng macros của bữa đó.
- [ ] Cho phép người dùng nhấn vào từng bữa ăn để xem chi tiết hoặc nhấn Xóa (`DELETE /api/meals/{id}`).
- [ ] Cho phép chuyển đổi linh hoạt giữa các ngày (Hôm nay, Hôm qua, chọn ngày qua DatePicker).
- [ ] Trạng thái Empty State thân thiện khi một bữa hoặc một ngày chưa có dữ liệu ghi chép.
- [ ] Verify logic Diary trên Mobile Screen thành công.

---

### US-006: Thanh Đo Tiến độ Tiêu thụ Dinh dưỡng (Daily Progress Bar)
**Description:** Là một người dùng, tôi muốn nhìn thấy ngay thanh tiến độ Calo và các thanh đo Macros (Protein, Carbs, Fat) so với mục tiêu hàng ngày để biết mình còn được nạp bao nhiêu năng lượng.

**Acceptance Criteria:**
- [ ] Hiển thị vòng tròn hoặc thanh tiến độ Calo: `Consumed Calo / Target Calo` kèm số calo còn lại (`Remaining = Target - Consumed`).
- [ ] Đổi màu cảnh báo trực quan khi calo nạp vào vượt quá 100% mục tiêu (chuyển sang màu đỏ cảnh báo).
- [ ] 3 thanh đo thành phần macros riêng biệt với mã màu đặc trưng:
  - **Protein:** Màu xanh dương (Blue)
  - **Carbs:** Màu vàng/cam (Amber)
  - **Fat:** Màu hồng/đỏ (Rose)
- [ ] Tự động cập nhật real-time ngay sau khi có bất kỳ thao tác thêm/sửa/xóa bữa ăn nào.
- [ ] Verify UI components hiển thị chuẩn trên cả Mobile và Web Dashboard.

---

### US-007: Web Dashboard Phân tích Xu hướng Dinh dưỡng (Analytics)
**Description:** Là một người dùng hoặc huấn luyện viên, tôi muốn truy cập Web Dashboard trên trình duyệt để xem biểu đồ xu hướng tiêu thụ Calo và phân bổ tỷ lệ Macros trong 7 ngày và 30 ngày.

**Acceptance Criteria:**
- [ ] Đăng nhập Web Dashboard bằng cùng tài khoản trên Mobile.
- [ ] Tích hợp biểu đồ trực quan (Recharts / Chart.js):
  - Biểu đồ cột/đường: Lượng Calo tiêu thụ mỗi ngày so sánh với đường Calo Target chuẩn.
  - Biểu đồ tròn/miền: Tỷ lệ phần trăm phân bổ trung bình giữa Protein - Carbs - Fat.
- [ ] Bộ lọc linh hoạt: 7 ngày gần nhất (Week) / 30 ngày gần nhất (Month).
- [ ] Hiển thị các chỉ số tổng kết: Trung bình Calo/ngày, Tỷ lệ hoàn thành mục tiêu (%), Số ngày đạt chuẩn.
- [ ] Giao diện Web Dashboard chuẩn Glassmorphism/Dark Mode hiện đại, responsive trên cả Laptop và Tablet.
- [ ] Verify trên trình duyệt (Browser test) không có console error và layout hiển thị sắc nét.

---

### US-008: Xuất Báo cáo Nhật ký Dinh dưỡng ra tệp CSV & PDF
**Description:** Là một người dùng, tôi muốn xuất toàn bộ dữ liệu nhật ký ăn uống trong khoảng thời gian tùy chọn ra tệp CSV hoặc PDF để lưu trữ hoặc gửi qua Zalo/Email cho Huấn luyện viên thể hình (PT).

**Acceptance Criteria:**
- [ ] Nút "Xuất báo cáo" (Export Report) trên Web Dashboard với 2 tùy chọn định dạng: **CSV** và **PDF**.
- [ ] Bộ chọn khoảng thời gian xuất dữ liệu (Từ ngày - Đến ngày).
- [ ] **Định dạng CSV:**
  - File mã hóa chuẩn `UTF-8 with BOM` để mở trực tiếp trên Microsoft Excel tiếng Việt không bị lỗi font chữ.
  - Cột dữ liệu đầy đủ: Ngày, Bữa ăn, Tên món, Khối lượng (g), Calo (kcal), Protein (g), Carbs (g), Fat (g).
- [ ] **Định dạng PDF:**
  - Bố cục chuyên nghiệp gồm: Thông tin người dùng, Chỉ số BMR/TDEE, Bảng chi tiết bữa ăn và Lời khuyên tổng kết từ AI.
- [ ] Verify tải file CSV/PDF trên trình duyệt thành công, nội dung chính xác và định dạng đẹp mắt.

---

## 4. Yêu cầu Chức năng (Functional Requirements - FR)

- **FR-1 [Xác thực]:** Hệ thống phải cung cấp REST API `POST /api/auth/register` và `POST /api/auth/login` với mã hóa mật khẩu `BCrypt` và cấp phát JWT token có thời hạn hợp lệ.
- **FR-2 [Hồ sơ thể trạng]:** Hệ thống phải cung cấp API `GET /api/profile` và `PUT /api/profile` để lưu trữ thể trạng và tự động tính toán các chỉ số BMR, TDEE, Calorie Target, Macro Targets.
- **FR-3 [Phân tích hình ảnh AI]:** Hệ thống phải cung cấp API `POST /api/meals/analyze-image` nhận file `multipart/form-data`, lưu trữ ảnh và gửi dữ liệu sang Google Gemini Flash Vision API, trả về cấu trúc danh sách món ăn kèm macros.
- **FR-4 [Lưu trữ bữa ăn]:** Hệ thống phải cung cấp API `POST /api/meals` để lưu bữa ăn hoàn chỉnh gồm danh sách món con (`MealItem`) và liên kết với tài khoản người dùng hiện tại.
- **FR-5 [Truy vấn nhật ký]:** Hệ thống phải cung cấp API `GET /api/meals?date=YYYY-MM-DD` để lấy toàn bộ các bữa ăn theo ngày.
- **FR-6 [Thao tác bữa ăn]:** Hệ thống phải cung cấp API `GET /api/meals/{id}`, `PUT /api/meals/{id}`, `DELETE /api/meals/{id}` cho phép chỉnh sửa hoặc xóa bữa ăn.
- **FR-7 [Tổng kết ngày]:** Hệ thống phải cung cấp API `GET /api/analytics/daily-summary?date=YYYY-MM-DD` tính toán tổng calo đã nạp, calo mục tiêu, calo còn lại và tổng grams 3 nhóm chất.
- **FR-8 [Phân tích xu hướng]:** Hệ thống phải cung cấp API `GET /api/analytics/trends?range=7days|30days` trả về dữ liệu chuỗi thời gian cho biểu đồ.
- **FR-9 [Xuất dữ liệu]:** Hệ thống phải cung cấp API `GET /api/analytics/export/csv` và `GET /api/analytics/export/pdf` theo khoảng thời gian tùy chọn.

---

## 5. Yêu cầu Phi Chức năng (Non-Functional Requirements - NFR)

- **NFR-1 [Hiệu năng - Performance]:**
  - Thời gian phản hồi các REST API CRUD thông thường < 300ms.
  - Thời gian xử lý nén ảnh client-side < 500ms.
  - Thời gian toàn trình phân tích ảnh AI (bao gồm upload và nhận phản hồi từ Gemini) < 5s.
- **NFR-2 [Khả năng chịu lỗi & Độ tin cậy - Reliability]:**
  - Tỷ lệ khả dụng hệ thống (Uptime) đạt 99.5%.
  - Cơ chế Fallback tự động kích hoạt khi Gemini API gặp sự cố, đảm bảo luồng trải nghiệm của người dùng không bị gián đoạn (User luôn có thể chỉnh sửa thủ công).
- **NFR-3 [Bảo mật - Security]:**
  - Toàn bộ giao tiếp Client - Server qua giao thức HTTPS / TLS mã hóa.
  - Mật khẩu người dùng được băm 1 chiều bằng thuật toán `BCrypt` với salt rounds >= 10.
  - JWT Token được kiểm tra tính hợp lệ trên từng request thông qua Spring Security Filter.
- **NFR-4 [Tính tương thích & Giao diện - Compatibility & UX]:**
  - Mobile App hoạt động mượt mà trên cả iOS (>= 15.0) và Android (>= 10.0).
  - Web Dashboard hiển thị chuẩn xác trên các trình duyệt hiện đại (Chrome, Edge, Safari, Firefox).
  - Giao diện thân thiện, tương phản cao, hỗ trợ tiếng Việt có dấu chuẩn Unicode.

---

## 6. Các Hạng mục Ngoài Phạm vi (Non-Goals / Out of Scope cho bản MVP)

- **Không** xây dựng tính năng đồng bộ phần cứng đo lường thông minh (Apple Watch, Garmin, Fitbit, Apple HealthKit, Google Fit) trong phiên bản MVP này.
- **Không** xây dựng mạng xã hội nội bộ, bảng xếp hạng hay tính năng chia sẻ bài viết công khai giữa người dùng.
- **Không** tích hợp cổng thanh toán trực tuyến trong giai đoạn MVP (toàn bộ tính năng mở miễn phí để thu hút người dùng thử nghiệm).
- **Không** chèn quảng cáo bên thứ ba gây gián đoạn luồng trải nghiệm cốt lõi của người dùng.

---

## 7. Cân nhắc Thiết kế & Trải nghiệm Người dùng (Design Considerations)

- **Nguyên tắc "1-Tap to Capture":** Nút chụp ảnh luôn ở vị trí trung tâm thanh điều hướng dưới (Bottom Tab Bar) trên Mobile App.
- **Quy chuẩn Màu sắc Dinh dưỡng Đồng nhất:**
  - **Calo nạp vào:** Xanh lá cây (Emerald Green) -> Chuyển Đỏ (Coral Red) khi vượt ngưỡng mục tiêu.
  - **Protein (Đạm):** Xanh dương sáng (Sky Blue / Cobalt).
  - **Carbs (Đường bột):** Vàng cam (Amber / Gold).
  - **Fat (Chất béo):** Hồng san hô / Tím nhẹ (Rose / Magenta).
- **Phản hồi tức thì (Micro-interactions):** Sử dụng skeleton loading và animation xoay nhẹ nhàng trong khi chờ AI phân tích ảnh để giảm cảm giác chờ đợi của người dùng.

---

## 8. Cân nhắc Kỹ thuật & Kiến trúc (Technical Considerations)

### 8.1 Kiến trúc Hệ thống (Architecture Overview)
- **Mobile Client:** React Native (Expo) + TypeScript + Axios + Lucide Icons / Vector Icons.
- **Web Dashboard:** React 18 + Vite + TypeScript + Tailwind CSS / Vanilla CSS Module + Recharts / Lucide Icons.
- **Backend Service:** Java 21 / Spring Boot 3.x + Spring Data JPA + Spring Security + JWT + Gradle/Maven.
- **Cơ sở dữ liệu:** PostgreSQL / MySQL (sử dụng H2 Database cho môi trường dev/testing).
- **Bộ máy AI Vision:** Google Gemini 1.5 Flash Vision API.
- **Lưu trữ tệp:** AWS S3 Bucket (hỗ trợ chuyển đổi tự động sang Local Static Directory khi chạy môi trường Offline/Dev).

### 8.2 Sơ đồ Luồng Dữ liệu Bữa ăn (Data Flow)

```
[Camera Mobile App]
       │
       ▼ (Nén ảnh Client < 1MB)
[Upload Service] ──> [AWS S3 / Local Storage]
       │
       ▼ (Gửi Base64 / URL)
[Gemini Flash API] ──> (Phân tích dinh dưỡng & JSON Extraction)
       │
       ▼ (Trả JSON Món ăn + Macros)
[Review Screen Mobile] ──> (User tinh chỉnh số gram, sửa món)
       │
       ▼ (POST /api/meals)
[Backend Spring Boot] ──> [Database Tables: meals, meal_items]
       │
       ▼ (Đồng bộ theo thời gian thực)
[Web Dashboard Analytics] & [Daily Progress Bar]
```

---

## 9. Chỉ số Đo lường Thành công (Success Metrics & KPIs)

- **Thời gian hoàn thành tác vụ (Time-to-Log):** Thời gian trung bình để chụp, phân tích và lưu 1 bữa ăn đạt **< 8 giây**.
- **Tỷ lệ giữ chân người dùng (D30 Retention):** >= 35% người dùng duy trì thói quen ghi nhật ký sau 30 ngày.
- **Tỷ lệ kích hoạt thành công (Activation Rate):** >= 75% người dùng đăng ký thực hiện ít nhất 1 lần chụp ảnh bữa ăn trong 24 giờ đầu.
- **Độ hài lòng của người dùng (CSAT / NPS):** Điểm đánh giá mức độ hài lòng đạt >= 4.5/5 sao.
- **Chi phí vận hành AI (AI Cost Efficiency):** Chi phí gọi Gemini API trên mỗi người dùng tích cực hàng tháng (MAU) < 0.05 USD.

---

## 10. Câu hỏi Mở & Kế hoạch Tiếp theo (Open Questions)

1. **Cơ sở dữ liệu món ăn Việt:** Có nên bổ sung thêm bảng tra cứu món ăn Việt Nam chuẩn của Viện Dinh Dưỡng Quốc Gia vào cơ chế Fallback của Backend không?
2. **Offline Mode:** Trong trường hợp mất kết nối mạng hoàn toàn, có cần lưu ảnh tạm tại Mobile App để tự động gửi lại khi có mạng trở lại không?
3. **Mã vạch sản phẩm (Barcode):** Kế hoạch tích hợp thư viện quét Barcode thực phẩm đóng gói sẽ được ưu tiên ở Sprint nào trong Giai đoạn 2?

---

## 11. Bảng Kiểm Tra Hoàn Tất (PRD Checklist)

- [x] Đã đặt câu hỏi làm rõ với các lựa chọn chữ cái và ghi nhận câu trả lời của người dùng.
- [x] Phản ánh đúng toàn bộ phạm vi hệ thống MVP (Mobile, Backend, Web Dashboard, AI Vision).
- [x] Tất cả User Stories đều nhỏ gọn, có cấu trúc chuẩn và kèm Acceptance Criteria kiểm chứng được.
- [x] Các yêu cầu chức năng (FR) được đánh số thứ tự rõ ràng, không mập mờ.
- [x] Mục Non-Goals xác định rõ ranh giới phát triển của giai đoạn hiện tại.
- [x] Đã lưu file đúng định dạng và vị trí `docs/prd/prd-ai-calorie-meal-tracker.md`.
