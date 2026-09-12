# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SOFTWARE REQUIREMENTS SPECIFICATION)

---

## 1. Thông tin tài liệu

* **Tên dự án:** AI Calorie & Meal Tracker
* **Tên tài liệu:** Tài liệu Đặc tả Yêu cầu Phần mềm (Software Requirements Specification - SRS)
* **Mã tài liệu:** SRS-AICM-001
* **Phiên bản:** 1.0
* **Trạng thái:** Đã xác nhận (Dựa trên tài liệu dự án và hiện trạng triển khai)
* **Ngày tạo:** 12/09/2026
* **Ngày cập nhật:** 12/09/2026
* **Người thực hiện:** Senior Requirements & System Analyst

### Lịch sử thay đổi tài liệu

| Phiên bản | Ngày | Tác giả | Nội dung thay đổi |
| :--- | :--- | :--- | :--- |
| **1.0** | 12/09/2026 | Ban phân tích yêu cầu | Khởi tạo tài liệu đặc tả yêu cầu phần mềm hoàn chỉnh dựa trên README và hiện trạng mã nguồn hệ thống. |

---

## 2. Giới thiệu

### 2.1 Mục đích tài liệu
Tài liệu này xác định chi tiết toàn bộ các yêu cầu nghiệp vụ, yêu cầu chức năng, yêu cầu phi chức năng, yêu cầu trí tuệ nhân tạo (AI), yêu cầu bảo mật và dữ liệu cho hệ thống **AI Calorie & Meal Tracker**. Tài liệu này đóng vai trò là "Nguồn sự thật" (Source of Truth) cho đội ngũ phát triển, kiểm thử, quản lý dự án và các bên liên quan nhằm đảm bảo hệ thống đáp ứng chính xác kỳ vọng vận hành.

### 2.2 Bối cảnh dự án
Ghi chép và kiểm soát dinh dưỡng hàng ngày là một phần thiết yếu đối với người tập luyện thể thao, người có nhu cầu giảm cân/tăng cơ hoặc duy trì lối sống lành mạnh. Tuy nhiên, các phương pháp ghi chép nhật ký ăn uống truyền thống (nhập liệu thủ công, tra cứu calo từng món) thường tốn nhiều công sức, phức tạp và thiếu tính trực quan, dẫn đến tỷ lệ bỏ dở cao. Dự án **AI Calorie & Meal Tracker** ứng dụng công nghệ thị giác máy tính AI để tự động hóa quy trình nhận diện món ăn và định lượng dinh dưỡng chỉ qua một bức ảnh.

### 2.3 Mục tiêu hệ thống
* Giảm thiểu tối đa thời gian và rào cản thao tác khi ghi nhận nhật ký ăn uống của người dùng.
* Cung cấp khả năng phân tích dinh dưỡng tức thì (Calories, Protein, Carbohydrate, Fat) và đưa ra lời khuyên sức khỏe phù hợp từ ảnh chụp món ăn.
* Tự động cá nhân hóa chỉ số chuyển hóa năng lượng (BMR, TDEE) và mục tiêu dinh dưỡng hàng ngày theo từng cá nhân.
* Hỗ trợ đồng bộ đa nền tảng (Mobile App và Web Dashboard) và cung cấp công cụ xuất báo cáo dữ liệu dinh dưỡng chuyên sâu dạng PDF/CSV.

### 2.4 Đối tượng sử dụng tài liệu
* **Đội ngũ phát triển (Developers):** Nắm bắt chính xác hành vi hệ thống cần xây dựng.
* **Đội ngũ kiểm thử (QA/QC Engineers):** Căn cứ xây dựng Test Plan, Test Case và kiểm tra tiêu chí chấp nhận (Acceptance Criteria).
* **Quản trị sản phẩm & Phân tích nghiệp vụ (Product Owner / Business Analyst):** Quản lý phạm vi, backlog và tiến độ dự án.
* **Các bên liên quan (Stakeholders):** Đánh giá mức độ hoàn thiện của sản phẩm.

### 2.5 Thuật ngữ và từ viết tắt

| Thuật ngữ / Viết tắt | Tên tiếng Anh đầy đủ | Giải thích nghĩa tiếng Việt |
| :--- | :--- | :--- |
| **SRS** | Software Requirements Specification | Tài liệu đặc tả yêu cầu phần mềm. |
| **BMR** | Basal Metabolic Rate | Tỷ lệ trao đổi chất cơ bản (năng lượng tiêu hao tối thiểu ở trạng thái nghỉ ngơi). |
| **TDEE** | Total Daily Energy Expenditure | Tổng năng lượng tiêu thụ hàng ngày (bao gồm cả vận động và tập luyện). |
| **Macros** | Macronutrients | Các chất dinh dưỡng đa lượng chính sinh năng lượng: Chất đạm (Protein), Chất bột đường (Carbohydrate), Chất béo (Fat). |
| **JWT** | JSON Web Token | Chuỗi mã thông báo dùng để xác thực và ủy quyền trong giao tiếp API không lưu trạng thái (Stateless). |
| **API** | Application Programming Interface | Giao diện lập trình ứng dụng. |
| **CRUD** | Create, Read, Update, Delete | Bốn thao tác cơ bản trên dữ liệu: Tạo mới, Đọc/Xem, Cập nhật, Xóa. |
| **Gemini Vision** | Google Gemini Flash Vision API | Mô hình trí tuệ nhân tạo thị giác máy tính đa phương thức của Google. |
| **S3** | Amazon Simple Storage Service | Dịch vụ lưu trữ đối tượng đám mây của Amazon Web Services. |

---

## 3. Tổng quan hệ thống

### 3.1 Mô tả hệ thống
Hệ thống **AI Calorie & Meal Tracker** là nền tảng theo dõi dinh dưỡng thông minh đa nền tảng gồm hai giao diện người dùng chính (Mobile App và Web Dashboard) kết nối đồng bộ với máy chủ Backend thông qua chuẩn giao tiếp RESTful API:
1. **Ứng dụng di động (Mobile App):** Hỗ trợ chụp ảnh, nén ảnh, gửi yêu cầu phân tích AI, kiểm tra/chỉnh sửa nhanh món ăn và theo dõi nhật ký hàng ngày khi di chuyển.
2. **Bảng điều khiển Web (Web Dashboard):** Cung cấp giao diện trực quan trên máy tính để theo dõi biểu đồ thống kê xu hướng 7 ngày / 30 ngày, phân tích tỷ lệ nhóm chất và xuất báo cáo PDF/CSV.
3. **Máy chủ xử lý trung tâm (Backend REST API):** Tiếp nhận dữ liệu, xử lý xác thực bảo mật, tích hợp lưu trữ hình ảnh đám mây, kết nối mô hình AI Gemini Vision, tính toán công thức thể trạng và quản lý cơ sở dữ liệu tập trung.

### 3.2 Mục tiêu sản phẩm
* **Nhanh chóng:** Phân tích ảnh và trả kết quả ước tính dinh dưỡng trong thời gian ngắn.
* **Chính xác & Linh hoạt:** Đưa ra ước tính chuẩn xác kèm quyền kiểm soát, chỉnh sửa trọng lượng/nguyên liệu từ phía người dùng.
* **Cá nhân hóa:** Thiết lập mục tiêu năng lượng và tỷ lệ nhóm chất tự động theo từng mục tiêu (Giảm cân, Duy trì, Tăng cân/Tăng cơ).
* **Toàn diện:** Cung cấp báo cáo thống kê dài hạn và khả năng trích xuất dữ liệu tiện lợi.

### 3.3 Đối tượng sử dụng
* **Người tập luyện thể thao / Thể hình (Fitness):** Cần theo dõi sát sao hàm lượng Protein và tỷ lệ Macros để tối ưu phát triển cơ bắp và giảm mỡ.
* **Người có nhu cầu quản lý cân nặng:** Cần thâm hụt hoặc dư thừa calo an toàn, có kiểm soát theo chỉ số TDEE.
* **Người quan tâm đến lối sống lành mạnh:** Muốn nắm rõ thói quen dinh dưỡng để cân bằng khẩu phần ăn mỗi ngày.

### 3.4 Danh sách Actor

| Mã Actor | Tên Actor | Mô tả | Vai trò & Trách nhiệm | Tương tác chính |
| :--- | :--- | :--- | :--- | :--- |
| **ACT-001** | **Người dùng (User)** | Người sử dụng hệ thống cuối có tài khoản đã đăng ký. | Tạo tài khoản, khai báo hồ sơ thể trạng, chụp ảnh phân tích món ăn, quản lý nhật ký bữa ăn, xem báo cáo thống kê cá nhân. | Tương tác trực tiếp trên Mobile App và Web Dashboard qua giao diện người dùng. |
| **ACT-002** | **Quản trị viên (Administrator)** | Người có quyền hạn quản trị hệ thống (`ROLE_ADMIN`). | Giám sát vận hành hệ thống, quản lý người dùng và cấu hình tài nguyên. | Tương tác thông qua các API quản trị và phân hệ quản lý hệ thống. |
| **ACT-003** | **Dịch vụ AI Thị giác (AI Vision Service)** | Tác nhân hệ thống bên ngoài (Google Gemini Flash Vision API). | Tiếp nhận dữ liệu hình ảnh và câu lệnh gợi ý (Prompt), trả về dữ liệu bóc tách món ăn, dinh dưỡng và lời khuyên sức khỏe. | Tương tác máy-đối-máy (M2M) qua giao thức HTTP/JSON với Backend API. |
| **ACT-004** | **Dịch vụ Lưu trữ Đám mây (Cloud Storage Service)** | Tác nhân hệ thống bên ngoài (AWS S3 / Lưu trữ cục bộ). | Lưu trữ an toàn tệp tin hình ảnh món ăn và cung cấp đường dẫn truy cập công khai/bảo mật. | Tiếp nhận tệp tin đa phương tiện từ Backend Server. |

### 3.5 Bối cảnh hệ thống

```text
+-------------------------------------------------------------------------+
|                               ACT-001: Người dùng                       |
+-------------------------------------------------------------------------+
       |                                             |
       | (Mobile App - iOS/Android)                  | (Web Dashboard - Trình duyệt)
       v                                             v
+-------------------------------------------------------------------------+
|                HỆ THỐNG MÁY CHỦ TRUNG TÂM (BACKEND REST API)             |
|   - Xác thực & Phân quyền (Spring Security, JWT)                        |
|   - Tính toán chỉ số thể trạng (BMR, TDEE, Calorie/Macro Target)        |
|   - Quản lý nhật ký bữa ăn (CRUD Meals & Meal Items)                    |
|   - Thống kê tiến độ & Xuất báo cáo (CSV, PDF)                         |
+-------------------------------------------------------------------------+
       |                               |                          |
       | Upload ảnh                    | Gửi ảnh & Prompt         | Lưu trữ dữ liệu
       v                               v                          v
+--------------------+      +----------------------+     +------------------+
| ACT-004: AWS S3 /  |      | ACT-003: Google      |     | Cơ sở dữ liệu    |
| Local File Storage |      | Gemini Flash Vision  |     | PostgreSQL       |
+--------------------+      +----------------------+     +------------------+
```

---

## 4. Phạm vi hệ thống

### 4.1 Trong phạm vi (In-Scope)
1. **Xác thực và phân quyền:** Đăng ký, đăng nhập tài khoản bằng Email/Mật khẩu; cấp phát và xác thực mã JWT Token; lấy thông tin tài khoản hiện hành.
2. **Quản lý hồ sơ sức khỏe & Thể trạng:** Khai báo tuổi, giới tính, chiều cao, cân nặng, cân nặng mục tiêu, mức độ vận động, mục tiêu thể hình; tự động tính toán BMR, TDEE, BMI, Calorie Target và phân bổ Macros (Protein, Carbs, Fat); cho phép tùy biến mục tiêu calo thủ công.
3. **Nhận diện & Phân tích món ăn bằng AI:** Tiếp nhận tải lên hình ảnh món ăn, kết nối Gemini Vision API để nhận diện tên món, khối lượng ước tính, thành phần dinh dưỡng chi tiết và lời khuyên sức khỏe; hỗ trợ cơ chế phân tích dự phòng (Fallback) khi dịch vụ AI gián đoạn.
4. **Quản lý nhật ký bữa ăn (Meal Logging):** Xem lại kết quả AI, điều chỉnh trọng lượng/nguyên liệu, thêm/xóa món ăn; lưu trữ bữa ăn theo ngày và theo 4 phân loại bữa (Sáng, Trưa, Tối, Ăn nhẹ); sửa và xóa bữa ăn đã lưu.
5. **Thống kê tiến độ dinh dưỡng (Analytics):** Thống kê tiến độ tiêu thụ calo và macros trong ngày so với mục tiêu; thống kê xu hướng tiêu thụ calo/macros theo khoảng thời gian (7 ngày / 30 ngày); phân tích tỷ lệ phần trăm phân bổ năng lượng giữa 3 nhóm chất đa lượng.
6. **Bảng điều khiển Web (Web Dashboard):** Xem giao diện tổng quan các chỉ số, lịch sử bữa ăn theo ngày, biểu đồ tiến độ và quản lý hồ sơ.
7. **Xuất báo cáo dinh dưỡng (Export):** Trích xuất lịch sử dinh dưỡng ra tệp định dạng CSV (tương thích UTF-8 Excel) và PDF.

### 4.2 Ngoài phạm vi (Out-of-Scope - Các phiên bản tương lai)
* Tích hợp đồng bộ tự động với các ứng dụng sức khỏe phần cứng bên thứ ba (Apple HealthKit, Google Fit).
* Quét mã vạch bao bì thực phẩm đóng gói (Barcode Scanner).
* Động cơ gợi ý thực đơn thông minh tự động dựa trên lượng calo còn lại trong ngày (AI Meal Recommendation).
* Tính năng cộng đồng, bảng xếp hạng bạn bè và chia sẻ công khai bài đăng ăn uống lên mạng xã hội.
* Cổng thanh toán trực tuyến và gói dịch vụ thuê bao (Subscription / In-app purchase).

### 4.3 Giả định (Assumptions)
* **Giả định 1:** Thiết bị di động của người dùng có camera hoạt động bình thường hoặc có khả năng chọn ảnh từ thư viện ảnh.
* **Giả định 2:** Kết nối mạng Internet ổn định để ứng dụng gửi ảnh lên máy chủ và truy vấn Gemini API.
* **Giả định 3:** Người dùng cung cấp trung thực các thông số thể trạng cá nhân để kết quả tính toán BMR/TDEE đạt độ tin cậy tối ưu.
* **Giả định 4:** Kết quả phân tích dinh dưỡng từ AI là số liệu ước tính mang tính tham khảo khoa học, không thay thế hoàn toàn chỉ định chuyên môn từ bác sĩ điều trị.

### 4.4 Ràng buộc (Constraints)
* **Ràng buộc nghiệp vụ:** Ngưỡng calo tối thiểu an toàn cho sức khỏe khi tính toán mục tiêu calo hàng ngày không được dưới 1200 kcal/ngày (trừ trường hợp người dùng chủ động chỉ định mục tiêu tùy chỉnh).
* **Ràng buộc kỹ thuật:** 
  - Kích thước tệp tin ảnh tải lên không vượt quá 15 MB.
  - Sử dụng cơ chế xác thực không trạng thái (Stateless Session) với JWT.
  - Mã thông báo Access Token có thời hạn hợp lệ 24 giờ kể từ thời điểm cấp phát.
* **Ràng buộc bảo mật:** Toàn bộ mật khẩu người dùng phải được mã hóa một chiều bằng thuật toán BCrypt trước khi lưu trữ trong cơ sở dữ liệu.
* **Ràng buộc bên thứ ba:** Phụ thuộc vào hạn mức (Quota) và tính khả dụng của Google Gemini Flash Vision API và AWS S3.

---

## 5. Yêu cầu nghiệp vụ (Business Requirements)

### BR-001: Tự động hóa ghi nhận nhật ký dinh dưỡng qua thị giác máy tính AI
* **Mục tiêu:** Cắt giảm hơn 80% thời gian ghi nhận bữa ăn so với phương pháp nhập liệu thủ công truyền thống.
* **Mô tả:** Hệ thống phải cung cấp khả năng tự động phân tích hình ảnh bữa ăn để nhận diện các món ăn thành phần, ước lượng khối lượng, tính toán lượng Calories và phân rã các nhóm chất Macronutrients (Carbohydrate, Protein, Fat) một cách tự động.
* **Độ ưu tiên:** Cao (Must Have).
* **Nguồn:** README.md (Mục 1 & 2), `GeminiVisionService.java`.

### BR-002: Cá nhân hóa mục tiêu dinh dưỡng và thể trạng người dùng
* **Mục tiêu:** Cung cấp chỉ số năng lượng chính xác và kế hoạch dinh dưỡng phù hợp cho từng cá nhân.
* **Mô tả:** Hệ thống phải tính toán tự động chỉ số BMR (Tỷ lệ trao đổi chất cơ bản) theo công thức Mifflin-St Jeor, chỉ số TDEE (Tổng năng lượng tiêu thụ hàng ngày) dựa trên mức độ vận động, và đề xuất mục tiêu Calorie & Macros hàng ngày dựa trên mục tiêu sức khỏe (Giảm cân, Duy trì, Tăng cân/Tăng cơ).
* **Độ ưu tiên:** Cao (Must Have).
* **Nguồn:** README.md (Mục 2.1), `HealthProfileService.java`.

### BR-003: Theo dõi tiến độ dinh dưỡng đa chiều và liên tục
* **Mục tiêu:** Giúp người dùng nắm bắt tình trạng nạp năng lượng trong ngày và xu hướng dài hạn.
* **Mô tả:** Hệ thống phải cung cấp thông tin thời gian thực về lượng calo đã nạp, lượng calo còn lại trong ngày so với mục tiêu, cùng các biểu đồ xu hướng 7 ngày / 30 ngày và phân bố tỷ lệ chất đạm/bột đường/chất béo.
* **Độ ưu tiên:** Cao (Must Have).
* **Nguồn:** README.md (Mục 2.3), `AnalyticsService.java`.

### BR-004: Trải nghiệm đồng bộ đa nền tảng thời gian thực
* **Mục tiêu:** Tối ưu hóa tính tiện lợi khi ghi nhận ngoài môi trường (Mobile App) và phân tích sâu trên máy tính (Web Dashboard).
* **Mô tả:** Dữ liệu nhật ký bữa ăn và hồ sơ sức khỏe phải được đồng bộ hóa tức thời và nhất quán giữa ứng dụng di động và bảng điều khiển máy tính thông qua hệ thống API tập trung.
* **Độ ưu tiên:** Trung bình (Should Have).
* **Nguồn:** README.md (Mục 1 & 4).

### BR-005: Xuất bản và chia sẻ dữ liệu dinh dưỡng chuyên nghiệp
* **Mục tiêu:** Hỗ trợ người dùng lưu trữ dữ liệu cá nhân hoặc chia sẻ với Huấn luyện viên thể hình (PT), Bác sĩ và Chuyên gia dinh dưỡng.
* **Mô tả:** Hệ thống phải hỗ trợ trích xuất dữ liệu nhật ký bữa ăn chi tiết theo khoảng thời gian tùy chọn dưới định dạng tệp CSV và báo cáo PDF hoàn chỉnh.
* **Độ ưu tiên:** Trung bình (Should Have).
* **Nguồn:** README.md (Mục 2.4), `ExportService.java`.

---

## 6. Danh sách User Story

### US-001: Đăng ký tài khoản người dùng
* **Nội dung:** Với vai trò là **Người dùng mới**, tôi muốn **đăng ký tài khoản bằng Họ tên, Email và Mật khẩu**, để **có thể tạo không gian lưu trữ dữ liệu dinh dưỡng cá nhân**.
* **Liên kết yêu cầu chức năng:** FR-001.

### US-002: Đăng nhập vào hệ thống
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **đăng nhập bằng Email và Mật khẩu**, để **truy cập vào dữ liệu và chức năng của ứng dụng**.
* **Liên kết yêu cầu chức năng:** FR-002.

### US-003: Xem thông tin tài khoản hiện tại
* **Nội dung:** Với vai trò là **Người dùng đã đăng nhập**, tôi muốn **xem thông tin cá nhân cơ bản và trạng thái hồ sơ sức khỏe**, để **biết thông tin tài khoản của mình**.
* **Liên kết yêu cầu chức năng:** FR-003.

### US-004: Thiết lập và cập nhật hồ sơ thể trạng
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **khai báo/chỉnh sửa thông tin tuổi, giới tính, chiều cao, cân nặng, mức độ vận động và mục tiêu thể hình**, để **hệ thống tính toán chỉ số BMR, TDEE và mục tiêu calo phù hợp với tôi**.
* **Liên kết yêu cầu chức năng:** FR-004, FR-005.

### US-005: Xem hồ sơ sức khỏe và mục tiêu dinh dưỡng
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **xem chi tiết chỉ số BMI, phân loại thể trạng, chỉ số BMR, TDEE và định mức Calories, Protein, Carbs, Fat hàng ngày**, để **theo dõi định mức dinh dưỡng cần đạt**.
* **Liên kết yêu cầu chức năng:** FR-006.

### US-006: Chụp và phân tích ảnh bữa ăn bằng AI
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **chụp hoặc chọn ảnh món ăn và gửi cho AI phân tích**, để **tự động nhận diện các món ăn, lượng calo, macros và nhận lời khuyên dinh dưỡng**.
* **Liên kết yêu cầu chức năng:** FR-007.

### US-007: Kiểm tra và tùy chỉnh kết quả phân tích AI
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **xem lại kết quả phân tích sơ bộ của AI, điều chỉnh tên món, trọng lượng, thêm hoặc bớt món**, để **đảm bảo số liệu chính xác theo thực tế trước khi lưu**.
* **Liên kết yêu cầu chức năng:** FR-007, FR-008.

### US-008: Lưu bữa ăn vào nhật ký dinh dưỡng
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **lưu bữa ăn đã xác nhận kèm phân loại bữa ăn (Sáng/Trưa/Tối/Phụ) vào nhật ký**, để **cập nhật tiến độ dinh dưỡng trong ngày**.
* **Liên kết yêu cầu chức năng:** FR-008.

### US-009: Xem danh sách bữa ăn theo ngày
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **xem danh sách tất cả các bữa ăn đã ghi nhận trong ngày (hôm nay hoặc ngày đã chọn)**, để **quản lý khẩu phần ăn uống hàng ngày**.
* **Liên kết yêu cầu chức năng:** FR-009.

### US-010: Xem chi tiết một bữa ăn
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **xem chi tiết một bữa ăn cụ thể gồm ảnh chụp, lời khuyên AI và danh sách từng món ăn thành phần**, để **nắm rõ chi tiết năng lượng của bữa ăn đó**.
* **Liên kết yêu cầu chức năng:** FR-010.

### US-011: Chỉnh sửa thông tin bữa ăn đã lưu
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **cập nhật lại ngày ăn, loại bữa, tên bữa, ghi chú hoặc danh sách món của bữa ăn đã lưu**, để **sửa các thông tin sai lệch**.
* **Liên kết yêu cầu chức năng:** FR-011.

### US-012: Xóa bữa ăn khỏi nhật ký
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **xóa một bữa ăn đã ghi nhận nhầm**, để **giữ cho dữ liệu nhật ký dinh dưỡng luôn chính xác**.
* **Liên kết yêu cầu chức năng:** FR-012.

### US-013: Xem tổng quan dinh dưỡng trong ngày (Daily Summary)
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **xem tổng calo đã nạp, calo còn lại, tổng protein, carbs, fat so với mục tiêu trong ngày**, để **điều chỉnh các bữa ăn tiếp theo cho hợp lý**.
* **Liên kết yêu cầu chức năng:** FR-013.

### US-014: Xem báo cáo thống kê xu hướng dinh dưỡng theo khoảng thời gian
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **xem biểu đồ calo trung bình và tỷ lệ phân bố nhóm chất theo 7 ngày hoặc 30 ngày**, để **đánh giá mức độ kỷ luật dinh dưỡng trong dài hạn**.
* **Liên kết yêu cầu chức năng:** FR-014.

### US-015: Xuất dữ liệu nhật ký dạng tệp CSV
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **tải xuống báo cáo nhật ký ăn uống dạng tệp CSV**, để **phân tích dữ liệu trên Microsoft Excel hoặc phần mềm bảng tính khác**.
* **Liên kết yêu cầu chức năng:** FR-015.

### US-016: Xuất báo cáo nhật ký dạng tệp PDF
* **Nội dung:** Với vai trò là **Người dùng**, tôi muốn **tải xuống báo cáo dinh dưỡng định dạng PDF có cấu trúc đẹp mắt**, để **in ấn hoặc gửi cho huấn luyện viên/bác sĩ dinh dưỡng**.
* **Liên kết yêu cầu chức năng:** FR-016.

---

## 7. Yêu cầu chức năng (Functional Requirements)

### FR-001: Đăng ký tài khoản người dùng mới
* **Mã yêu cầu:** FR-001
* **Tên yêu cầu:** Đăng ký tài khoản người dùng mới
* **Mô tả:** Hệ thống phải cho phép người dùng đăng ký tài khoản mới bằng cách cung cấp họ tên, email hợp lệ và mật khẩu bảo mật.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Cao (Must Have)
* **Điều kiện trước:** Người dùng chưa đăng nhập.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu đăng ký tài khoản.
* **Dữ liệu đầu vào:**
  - `fullName`: Chuỗi văn bản, bắt buộc, không được để trống.
  - `email`: Chuỗi định dạng email chuẩn, bắt buộc.
  - `password`: Chuỗi văn bản, bắt buộc, tối thiểu 6 ký tự.
* **Hành vi hệ thống:**
  1. Kiểm tra tính hợp lệ của dữ liệu đầu vào.
  2. Chuẩn hóa email về dạng chữ thường và loại bỏ khoảng trắng thừa.
  3. Kiểm tra sự tồn tại của email trong hệ thống (RULE-001). Nếu đã tồn tại, trả về thông báo lỗi.
  4. Mã hóa mật khẩu bằng thuật toán BCrypt.
  5. Lưu thông tin người dùng mới với vai trò mặc định là `ROLE_USER`.
  6. Tạo mã xác thực JWT Token và trả về cho client.
* **Kết quả đầu ra:** Thông tin tài khoản đã tạo kèm JWT Token, kiểu mã token (`Bearer`), thời hạn hiệu lực tính bằng mili-giây.
* **Điều kiện sau:** Bản ghi người dùng mới được tạo trong cơ sở dữ liệu và người dùng chuyển sang trạng thái đã đăng nhập.
* **Quy tắc nghiệp vụ:** RULE-001.
* **Tiêu chí chấp nhận:** AC-001.
* **Nguồn:** `AuthController.java`, `AuthService.java`, `RegisterRequest.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-002: Đăng nhập hệ thống
* **Mã yêu cầu:** FR-002
* **Tên yêu cầu:** Đăng nhập hệ thống
* **Mô tả:** Hệ thống phải xác thực thông tin đăng nhập của người dùng qua email và mật khẩu để cấp quyền truy cập.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Cao (Must Have)
* **Điều kiện trước:** Tài khoản người dùng đã được tạo trong hệ thống.
* **Điều kiện kích hoạt:** Người dùng gửi thông tin đăng nhập.
* **Dữ liệu đầu vào:**
  - `email`: Chuỗi định dạng email, bắt buộc.
  - `password`: Chuỗi mật khẩu, bắt buộc.
* **Hành vi hệ thống:**
  1. Kiểm tra định dạng dữ liệu đầu vào.
  2. Thực hiện xác thực thông tin tài khoản với cơ sở dữ liệu.
  3. Nếu email không tồn tại hoặc mật khẩu không khớp, trả về lỗi từ chối đăng nhập.
  4. Nếu xác thực thành công, khởi tạo JWT Token chứa thông tin định danh người dùng.
* **Kết quả đầu ra:** JWT Token, loại token, thời gian hết hạn và thông tin người dùng cơ bản.
* **Điều kiện sau:** Người dùng được xác thực phiên làm việc hợp lệ.
* **Quy tắc nghiệp vụ:** RULE-002, SEC-001, SEC-002.
* **Tiêu chí chấp nhận:** AC-002.
* **Nguồn:** `AuthController.java`, `AuthService.java`, `LoginRequest.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-003: Lấy thông tin tài khoản người dùng hiện hành
* **Mã yêu cầu:** FR-003
* **Tên yêu cầu:** Lấy thông tin tài khoản hiện hành
* **Mô tả:** Hệ thống phải cung cấp thông tin chi tiết về tài khoản đang đăng nhập hiện tại dựa trên JWT Token.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Cao (Must Have)
* **Điều kiện trước:** Người dùng đã gửi kèm JWT Token hợp lệ trong tiêu đề yêu cầu (Header `Authorization: Bearer <token>`).
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu truy vấn thông tin cá nhân (`GET /api/v1/auth/me`).
* **Dữ liệu đầu vào:** Không có (sử dụng thông tin định danh từ JWT Token).
* **Hành vi hệ thống:**
  1. Trích xuất định danh người dùng từ Token.
  2. Truy vấn thông tin người dùng từ cơ sở dữ liệu.
  3. Xác định trạng thái đã thiết lập hồ sơ sức khỏe (`hasHealthProfile`) hay chưa.
* **Kết quả đầu ra:** DTO chứa mã ID, email, họ tên, URL ảnh đại diện, vai trò (`role`), cờ trạng thái `hasHealthProfile` và ngày tạo.
* **Điều kiện sau:** Không làm thay đổi trạng thái dữ liệu.
* **Quy tắc nghiệp vụ:** RULE-002.
* **Tiêu chí chấp nhận:** AC-003.
* **Nguồn:** `AuthController.java`, `UserService.java`, `UserDto.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-004: Thiết lập và cập nhật hồ sơ sức khỏe cá nhân
* **Mã yêu cầu:** FR-004
* **Tên yêu cầu:** Thiết lập và cập nhật hồ sơ sức khỏe cá nhân
* **Mô tả:** Hệ thống phải cho phép người dùng khai báo hoặc chỉnh sửa các thông số thể trạng và mục tiêu sức khỏe của mình.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Cao (Must Have)
* **Điều kiện trước:** Người dùng đã đăng nhập.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu lưu hồ sơ sức khỏe (`POST /api/v1/profile`).
* **Dữ liệu đầu vào:**
  - `age`: Số nguyên (10 đến 120), bắt buộc.
  - `gender`: Giá trị thuộc `MALE`, `FEMALE`, `OTHER`, bắt buộc.
  - `heightCm`: Số thực (50.0 đến 250.0 cm), bắt buộc.
  - `weightKg`: Số thực (20.0 đến 300.0 kg), bắt buộc.
  - `targetWeightKg`: Số thực (tùy chọn).
  - `activityLevel`: Giá trị thuộc enum (`SEDENTARY`, `LIGHTLY_ACTIVE`, `MODERATELY_ACTIVE`, `VERY_ACTIVE`, `EXTRA_ACTIVE`), bắt buộc.
  - `goal`: Giá trị thuộc enum (`LOSE_WEIGHT`, `MAINTAIN`, `GAIN_WEIGHT`), bắt buộc.
  - `customDailyCalorieTarget`: Số nguyên mục tiêu calo tùy biến (> 500 kcal, tùy chọn).
* **Hành vi hệ thống:**
  1. Kiểm tra tính hợp lệ của tất cả các trường dữ liệu theo ràng buộc biên độ.
  2. Tìm hồ sơ hiện có của người dùng; nếu chưa có thì khởi tạo bản ghi mới liên kết với `User`.
  3. Cập nhật các thông số thể trạng đầu vào.
  4. Gọi logic tự động tính toán BMR, TDEE, Calorie Target và Macros (FR-005).
  5. Lưu hồ sơ sức khỏe vào cơ sở dữ liệu.
* **Kết quả đầu ra:** Thông tin chi tiết hồ sơ sức khỏe đã cập nhật kèm các chỉ số tính toán (BMI, phân loại BMI, BMR, TDEE, mục tiêu Calorie/Protein/Carbs/Fat).
* **Điều kiện sau:** Hồ sơ sức khỏe của người dùng được lưu trữ hoặc cập nhật thành công.
* **Quy tắc nghiệp vụ:** RULE-002, RULE-003, RULE-004, RULE-005, RULE-006, RULE-008.
* **Tiêu chí chấp nhận:** AC-004.
* **Nguồn:** `HealthProfileController.java`, `HealthProfileService.java`, `HealthProfileRequest.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-005: Tự động tính toán các chỉ số BMR, TDEE và định mức dinh dưỡng
* **Mã yêu cầu:** FR-005
* **Tên yêu cầu:** Tự động tính toán chỉ số BMR, TDEE và định mức dinh dưỡng
* **Mô tả:** Hệ thống phải tự động tính toán chính xác chỉ số BMR, TDEE, Calorie Target và phân bổ Macros mỗi khi hồ sơ sức khỏe được tạo mới hoặc cập nhật.
* **Actor:** Hệ thống (Backend Engine)
* **Độ ưu tiên:** Cao (Must Have)
* **Điều kiện trước:** Dữ liệu hồ sơ sức khỏe đầu vào hợp lệ.
* **Điều kiện kích hoạt:** Hàm `upsertMyProfile` trong `HealthProfileService` được gọi.
* **Dữ liệu đầu vào:** Cân nặng (kg), chiều cao (cm), tuổi, giới tính, mức độ vận động, mục tiêu thể hình, mục tiêu calo tùy chọn.
* **Hành vi hệ thống:**
  1. **Tính BMR (Mifflin-St Jeor):** `(10 * weightKg) + (6.25 * heightCm) - (5 * age) + offset` (Nam: +5, Nữ: -161, Khác: -78).
  2. **Tính TDEE:** `BMR * Hệ số vận động` (1.2 đến 1.9).
  3. **Tính Daily Calorie Target:** `TDEE + Điều chỉnh mục tiêu` (Giảm cân: -500 kcal, Duy trì: 0, Tăng cân: +500 kcal). Đảm bảo tối thiểu không thấp hơn 1200 kcal (trừ khi có `customDailyCalorieTarget` > 500).
  4. **Phân bổ Macronutrients (30% Protein / 45% Carbs / 25% Fat):**
     - Protein: `(CalorieTarget * 0.30) / 4.0` (gam)
     - Carbs: `(CalorieTarget * 0.45) / 4.0` (gam)
     - Fat: `(CalorieTarget * 0.25) / 9.0` (gam)
  5. **Tính chỉ số BMI:** `weightKg / (heightM * heightM)`.
* **Kết quả đầu ra:** Các giá trị số nguyên BMR, TDEE, Calorie Target, Protein (g), Carbs (g), Fat (g) và BMI được gán vào bản ghi hồ sơ.
* **Điều kiện sau:** Các chỉ số được ghi nhận đồng bộ vào bản ghi `HealthProfile`.
* **Quy tắc nghiệp vụ:** RULE-003, RULE-004, RULE-005, RULE-006, RULE-008.
* **Tiêu chí chấp nhận:** AC-005.
* **Nguồn:** `HealthProfileService.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-006: Lấy thông tin hồ sơ sức khỏe hiện tại
* **Mã yêu cầu:** FR-006
* **Tên yêu cầu:** Lấy thông tin hồ sơ sức khỏe hiện tại
* **Mô tả:** Hệ thống phải trả về toàn bộ thông tin thể trạng và mục tiêu dinh dưỡng của người dùng đang đăng nhập.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Cao (Must Have)
* **Điều kiện trước:** Người dùng đã đăng nhập.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu `GET /api/v1/profile`.
* **Dữ liệu đầu vào:** Không có (xác thực qua JWT Token).
* **Hành vi hệ thống:**
  1. Tìm bản ghi hồ sơ sức khỏe thuộc về người dùng hiện tại.
  2. Nếu không tìm thấy hồ sơ, trả về lỗi 404 (ResourceNotFoundException) với thông báo chưa thiết lập hồ sơ.
  3. Tính toán chỉ số BMI và xếp loại thể trạng tương ứng.
  4. Ánh xạ sang DTO và trả về kết quả.
* **Kết quả đầu ra:** DTO `HealthProfileDto` chứa toàn bộ thông số thể trạng, chỉ số tính toán và thời gian cập nhật.
* **Điều kiện sau:** Không làm thay đổi trạng thái dữ liệu.
* **Quy tắc nghiệp vụ:** RULE-002, RULE-008.
* **Tiêu chí chấp nhận:** AC-006.
* **Nguồn:** `HealthProfileController.java`, `HealthProfileService.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-007: Tải lên ảnh bữa ăn và phân tích dinh dưỡng qua AI
* **Mã yêu cầu:** FR-007
* **Tên yêu cầu:** Tải lên ảnh bữa ăn và phân tích dinh dưỡng qua AI
* **Mô tả:** Hệ thống phải cho phép người dùng tải lên hình ảnh món ăn, thực hiện lưu trữ hình ảnh và gửi tới mô hình AI để nhận diện món ăn, bóc tách dinh dưỡng và gợi ý lời khuyên sức khỏe.
* **Actor:** ACT-001 (Người dùng), ACT-003 (AI Vision), ACT-004 (Storage)
* **Độ ưu tiên:** Cao (Must Have)
* **Điều kiện trước:** Người dùng đã đăng nhập và tệp tin ảnh không rỗng, dung lượng <= 15MB.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu `POST /api/v1/meals/analyze` kèm tệp tin đa phương tiện `image`.
* **Dữ liệu đầu vào:** Tệp tin hình ảnh (`MultipartFile image`).
* **Hành vi hệ thống:**
  1. Kiểm tra tệp tin ảnh không được rỗng.
  2. Tạo tên định danh duy nhất (UUID) cho tệp tin.
  3. Lưu trữ tệp tin lên AWS S3 (nếu được cấu hình bật) hoặc lưu cục bộ vào thư mục tĩnh (`StorageService`). Lấy về URL hình ảnh.
  4. Chuyển đổi dữ liệu ảnh thành chuỗi Base64.
  5. Tạo cấu trúc câu lệnh phân tích dinh dưỡng (Prompt) yêu cầu trả về định dạng JSON nghiêm ngặt.
  6. Gửi yêu cầu phân tích tới Google Gemini Flash Vision API (`gemini-1.5-flash`).
  7. Trích xuất và phân giải cú pháp JSON phản hồi từ AI thành đối tượng `MealAnalysisResponse`.
  8. Nếu xảy ra lỗi kết nối AI hoặc phản hồi không đúng cấu trúc, kích hoạt cơ chế dự phòng Fallback trả về dữ liệu mẫu có cấu trúc hoàn chỉnh.
* **Kết quả đầu ra:** Đối tượng `MealAnalysisResponse` gồm: Tên gợi ý bữa ăn, URL ảnh đã lưu, tổng calo ước tính, tổng protein, tổng carbs, tổng fat, lời khuyên sức khỏe (`healthTip`) và danh sách món ăn nhận diện được (`recognizedItems`).
* **Điều kiện sau:** Hình ảnh được lưu trữ an toàn và dữ liệu phân tích sơ bộ sẵn sàng cho người dùng kiểm tra/chỉnh sửa.
* **Quy tắc nghiệp vụ:** AI-001, NFR-001, NFR-003.
* **Tiêu chí chấp nhận:** AC-007.
* **Nguồn:** `MealController.java`, `StorageService.java`, `GeminiVisionService.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-008: Lưu bữa ăn đã xác nhận vào nhật ký dinh dưỡng
* **Mã yêu cầu:** FR-008
* **Tên yêu cầu:** Lưu bữa ăn đã xác nhận vào nhật ký dinh dưỡng
* **Mô tả:** Hệ thống phải cho phép người dùng lưu trữ một bữa ăn (sau khi đã xem xét và chỉnh sửa từ kết quả AI hoặc tạo mới) vào cơ sở dữ liệu nhật ký.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Cao (Must Have)
* **Điều kiện trước:** Người dùng đã đăng nhập.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu `POST /api/v1/meals`.
* **Dữ liệu đầu vào:**
  - `mealDate`: Ngày ghi nhận bữa ăn (mặc định ngày hiện tại nếu không truyền).
  - `mealType`: Loại bữa ăn (`BREAKFAST`, `LUNCH`, `DINNER`, `SNACK`), bắt buộc.
  - `name`: Tên bữa ăn (tùy chọn, mặc định lấy tên hiển thị của loại bữa).
  - `imageUrl`: Đường dẫn ảnh bữa ăn (tùy chọn).
  - `healthTip`: Lời khuyên dinh dưỡng kèm theo (tùy chọn).
  - `notes`: Ghi chú cá nhân (tùy chọn).
  - `items`: Danh sách các món ăn thành phần (bắt buộc ít nhất 1 món): Mỗi món gồm `name`, `estimatedWeightGrams`, `servingSize`, `calories`, `protein`, `carbs`, `fat`, `fiber`, `confidenceScore`.
* **Hành vi hệ thống:**
  1. Kiểm tra tính hợp lệ của danh sách món ăn (`items` không được rỗng).
  2. Tạo bản ghi `Meal` liên kết với tài khoản người dùng hiện hành.
  3. Duyệt qua từng món ăn thành phần và tạo các bản ghi `MealItem` tương ứng gắn vào `Meal`.
  4. Tự động tính toán lại tổng Calorie, Protein, Carbs, Fat của toàn bộ bữa ăn (RULE-007).
  5. Lưu toàn bộ bản ghi vào cơ sở dữ liệu qua giao dịch nguyên tử (`@Transactional`).
* **Kết quả đầu ra:** Mã phản hồi 201 Created kèm dữ liệu DTO `MealDto` hoàn chỉnh của bữa ăn vừa tạo.
* **Điều kiện sau:** Bữa ăn và các món ăn thành phần được ghi nhận vĩnh viễn trong cơ sở dữ liệu.
* **Quy tắc nghiệp vụ:** RULE-002, RULE-007.
* **Tiêu chí chấp nhận:** AC-008.
* **Nguồn:** `MealController.java`, `MealService.java`, `CreateMealRequest.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-009: Lấy danh sách các bữa ăn theo ngày
* **Mã yêu cầu:** FR-009
* **Tên yêu cầu:** Lấy danh sách các bữa ăn theo ngày
* **Mô tả:** Hệ thống phải trả về danh sách toàn bộ các bữa ăn mà người dùng đã ghi nhận trong một ngày cụ thể (mặc định là ngày hôm nay nếu không chỉ định).
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Cao (Must Have)
* **Điều kiện trước:** Người dùng đã đăng nhập.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu `GET /api/v1/meals/daily?date=YYYY-MM-DD`.
* **Dữ liệu đầu vào:** `date` (định dạng `YYYY-MM-DD`, tùy chọn).
* **Hành vi hệ thống:**
  1. Xác định ngày cần truy vấn (nếu tham số `date` trống, lấy ngày hiện tại của hệ thống).
  2. Truy vấn danh sách bữa ăn thuộc quyền sở hữu của người dùng trong ngày đó, sắp xếp theo thời gian tạo mới nhất lên trước.
  3. Nạp đầy đủ thông tin các món ăn con (`MealItem`) của từng bữa.
* **Kết quả đầu ra:** Danh sách các đối tượng `MealDto`.
* **Điều kiện sau:** Không làm thay đổi trạng thái dữ liệu.
* **Quy tắc nghiệp vụ:** RULE-002.
* **Tiêu chí chấp nhận:** AC-009.
* **Nguồn:** `MealController.java`, `MealService.java`, `MealRepository.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-010: Xem chi tiết một bữa ăn theo định danh
* **Mã yêu cầu:** FR-010
* **Tên yêu cầu:** Xem chi tiết một bữa ăn theo định danh
* **Mô tả:** Hệ thống phải trả về chi tiết toàn bộ thông tin của một bữa ăn dựa trên mã ID được cung cấp.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Trung bình (Should Have)
* **Điều kiện trước:** Người dùng đã đăng nhập và bữa ăn tồn tại.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu `GET /api/v1/meals/{id}`.
* **Dữ liệu đầu vào:** `id` (Số nguyên định danh bữa ăn trên đường dẫn).
* **Hành vi hệ thống:**
  1. Truy vấn bữa ăn theo cặp khóa `(id, userId)` của người dùng hiện tại (RULE-002).
  2. Nếu không tìm thấy, trả về lỗi 404 (ResourceNotFoundException).
  3. Ánh xạ dữ liệu bữa ăn và danh sách món thành phần sang `MealDto`.
* **Kết quả đầu ra:** Đối tượng `MealDto` chi tiết.
* **Điều kiện sau:** Không làm thay đổi trạng thái dữ liệu.
* **Quy tắc nghiệp vụ:** RULE-002.
* **Tiêu chí chấp nhận:** AC-010.
* **Nguồn:** `MealController.java`, `MealService.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-011: Cập nhật thông tin bữa ăn
* **Mã yêu cầu:** FR-011
* **Tên yêu cầu:** Cập nhật thông tin bữa ăn
* **Mô tả:** Hệ thống phải cho phép người dùng chỉnh sửa thông tin ngày ăn, loại bữa, tên, ảnh, lời khuyên, ghi chú và cập nhật lại danh sách các món ăn thành phần trong bữa ăn.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Trung bình (Should Have)
* **Điều kiện trước:** Người dùng đã đăng nhập và sở hữu bữa ăn cần chỉnh sửa.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu `PUT /api/v1/meals/{id}` kèm payload chỉnh sửa.
* **Dữ liệu đầu vào:** `id` trên đường dẫn và `UpdateMealRequest` trong thân yêu cầu.
* **Hành vi hệ thống:**
  1. Kiểm tra quyền sở hữu bữa ăn của người dùng hiện tại.
  2. Cập nhật các trường thông tin cơ bản được truyền vào.
  3. Nếu danh sách `items` được cung cấp, xóa danh sách món cũ và thay thế bằng danh sách món mới.
  4. Gọi hàm `recalculateTotals()` để tính lại tổng năng lượng và các chỉ số dinh dưỡng (RULE-007).
  5. Lưu lại thay đổi vào cơ sở dữ liệu.
* **Kết quả đầu ra:** Đối tượng `MealDto` đã được cập nhật.
* **Điều kiện sau:** Dữ liệu bữa ăn trong cơ sở dữ liệu được cập nhật mới.
* **Quy tắc nghiệp vụ:** RULE-002, RULE-007.
* **Tiêu chí chấp nhận:** AC-011.
* **Nguồn:** `MealController.java`, `MealService.java`, `UpdateMealRequest.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-012: Xóa một bữa ăn
* **Mã yêu cầu:** FR-012
* **Tên yêu cầu:** Xóa một bữa ăn
* **Mô tả:** Hệ thống phải cho phép người dùng xóa hoàn toàn một bữa ăn khỏi nhật ký dinh dưỡng.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Trung bình (Should Have)
* **Điều kiện trước:** Người dùng đã đăng nhập và sở hữu bữa ăn cần xóa.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu `DELETE /api/v1/meals/{id}`.
* **Dữ liệu đầu vào:** `id` (Số nguyên định danh bữa ăn).
* **Hành vi hệ thống:**
  1. Xác thực quyền sở hữu bữa ăn của người dùng hiện tại.
  2. Nếu không tìm thấy hoặc không thuộc quyền sở hữu, trả về lỗi 404.
  3. Thực hiện xóa bản ghi bữa ăn cùng toàn bộ các món ăn liên kết (Cascade Delete).
* **Kết quả đầu ra:** Thông báo xóa bữa ăn thành công.
* **Điều kiện sau:** Bản ghi bữa ăn bị loại bỏ hoàn toàn khỏi cơ sở dữ liệu.
* **Quy tắc nghiệp vụ:** RULE-002.
* **Tiêu chí chấp nhận:** AC-012.
* **Nguồn:** `MealController.java`, `MealService.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-013: Xem thống kê dinh dưỡng trong ngày (Daily Summary)
* **Mã yêu cầu:** FR-013
* **Tên yêu cầu:** Xem thống kê dinh dưỡng trong ngày
* **Mô tả:** Hệ thống phải tổng hợp toàn bộ các bữa ăn trong ngày đã chọn, so sánh với mục tiêu từ hồ sơ sức khỏe và trả về các chỉ số tiêu thụ chi tiết.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Cao (Must Have)
* **Điều kiện trước:** Người dùng đã đăng nhập.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu `GET /api/v1/analytics/daily-summary?date=YYYY-MM-DD`.
* **Dữ liệu đầu vào:** `date` (định dạng `YYYY-MM-DD`, tùy chọn).
* **Hành vi hệ thống:**
  1. Xác định ngày truy vấn (mặc định là ngày hôm nay).
  2. Lấy toàn bộ các bữa ăn trong ngày của người dùng.
  3. Lấy mục tiêu Calorie/Protein/Carbs/Fat từ hồ sơ sức khỏe của người dùng (nếu người dùng chưa tạo hồ sơ, sử dụng định mức mặc định: 2000 kcal, 150g Protein, 225g Carbs, 55g Fat).
  4. Tính tổng lượng Calorie, Protein, Carbs, Fat đã tiêu thụ từ các bữa ăn.
  5. Tính lượng Calorie còn lại (`remainingCalories = calorieTarget - totalCaloriesConsumed`).
  6. Đếm tổng số bữa ăn trong ngày (`mealCount`).
* **Kết quả đầu ra:** Đối tượng `DailySummaryDto` chứa đầy đủ các chỉ số thực tế, chỉ số mục tiêu, phần chênh lệch và danh sách các bữa ăn trong ngày.
* **Điều kiện sau:** Không làm thay đổi trạng thái dữ liệu.
* **Quy tắc nghiệp vụ:** RULE-002, RULE-005, RULE-006.
* **Tiêu chí chấp nhận:** AC-013.
* **Nguồn:** `AnalyticsController.java`, `AnalyticsService.java`, `DailySummaryDto.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-014: Xem thống kê dinh dưỡng theo khoảng thời gian (Range Summary)
* **Mã yêu cầu:** FR-014
* **Tên yêu cầu:** Xem thống kê dinh dưỡng theo khoảng thời gian
* **Mô tả:** Hệ thống phải tổng hợp dữ liệu dinh dưỡng theo từng ngày trong khoảng thời gian xác định, tính toán các chỉ số trung bình hàng ngày và phân tích tỷ lệ đóng góp năng lượng giữa các nhóm chất Macronutrients.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Cao (Must Have)
* **Điều kiện trước:** Người dùng đã đăng nhập.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu `GET /api/v1/analytics/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`.
* **Dữ liệu đầu vào:**
  - `startDate`: Ngày bắt đầu (tùy chọn, mặc định là 6 ngày trước).
  - `endDate`: Ngày kết thúc (tùy chọn, mặc định là ngày hiện tại).
* **Hành vi hệ thống:**
  1. Xác định khoảng thời gian truy vấn.
  2. Lặp qua từng ngày trong khoảng thời gian và lấy dữ liệu tóm tắt ngày (`DailySummaryDto`).
  3. Tính mức tiêu thụ trung bình hàng ngày của Calories, Protein, Carbs và Fat.
  4. Tính tỷ lệ phần trăm phân bố năng lượng giữa các nhóm chất dựa trên hệ số quy đổi calo: `(Protein * 4) + (Carbs * 4) + (Fat * 9)`.
* **Kết quả đầu ra:** Đối tượng `DateRangeSummaryDto` chứa ngày bắt đầu, ngày kết thúc, các giá trị trung bình hàng ngày, mục tiêu calo, mảng dữ liệu chi tiết từng ngày và bản đồ tỷ lệ phân bố Macros (`macroDistributionPercent`).
* **Điều kiện sau:** Không làm thay đổi trạng thái dữ liệu.
* **Quy tắc nghiệp vụ:** RULE-002.
* **Tiêu chí chấp nhận:** AC-014.
* **Nguồn:** `AnalyticsController.java`, `AnalyticsService.java`, `DateRangeSummaryDto.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-015: Xuất báo cáo dinh dưỡng định dạng CSV
* **Mã yêu cầu:** FR-015
* **Tên yêu cầu:** Xuất báo cáo dinh dưỡng định dạng CSV
* **Mô tả:** Hệ thống phải hỗ trợ trích xuất toàn bộ dữ liệu nhật ký ăn uống và dinh dưỡng trong khoảng thời gian ra tệp tin định dạng CSV có gắn mã UTF-8 BOM để tương thích hoàn toàn với Microsoft Excel.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Trung bình (Should Have)
* **Điều kiện trước:** Người dùng đã đăng nhập.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu `GET /api/v1/analytics/export/csv?startDate=...&endDate=...`.
* **Dữ liệu đầu vào:** `startDate`, `endDate` (tùy chọn, mặc định là 30 ngày gần nhất).
* **Hành vi hệ thống:**
  1. Truy vấn toàn bộ các bữa ăn của người dùng trong khoảng ngày yêu cầu theo thứ tự thời gian tăng dần.
  2. Ghi mã byte UTF-8 BOM (`0xEF, 0xBB, 0xBF`) vào luồng dữ liệu xuất.
  3. Tạo tiêu đề cột: `Ngay`, `Loai_Bua_An`, `Ten_Bua_An`, `Mon_An`, `Khoi_Luong_g`, `Calories`, `Protein_g`, `Carbs_g`, `Fat_g`, `Ghi_Chu`.
  4. Ghi từng dòng dữ liệu chi tiết tương ứng với từng món ăn trong mỗi bữa.
  5. Đóng gói luồng byte và thiết lập tiêu đề phản hồi `Content-Disposition: attachment; filename="meal_report_YYYY-MM-DD.csv"` với kiểu MIME `text/csv; charset=UTF-8`.
* **Kết quả đầu ra:** Tệp tin nhị phân CSV tải về cho người dùng.
* **Điều kiện sau:** Không làm thay đổi trạng thái dữ liệu.
* **Quy tắc nghiệp vụ:** RULE-002, NFR-007.
* **Tiêu chí chấp nhận:** AC-015.
* **Nguồn:** `AnalyticsController.java`, `ExportService.java`.
* **Trạng thái:** Đã triển khai.

---

### FR-016: Xuất báo cáo dinh dưỡng định dạng PDF
* **Mã yêu cầu:** FR-016
* **Tên yêu cầu:** Xuất báo cáo dinh dưỡng định dạng PDF
* **Mô tả:** Hệ thống phải tổng hợp dữ liệu nhật ký ăn uống và định dạng thành tài liệu PDF có bố cục tiêu đề trang, thông tin người dùng, bảng thống kê chi tiết và tổng năng lượng tiêu thụ.
* **Actor:** ACT-001 (Người dùng)
* **Độ ưu tiên:** Trung bình (Should Have)
* **Điều kiện trước:** Người dùng đã đăng nhập.
* **Điều kiện kích hoạt:** Người dùng gửi yêu cầu `GET /api/v1/analytics/export/pdf?startDate=...&endDate=...`.
* **Dữ liệu đầu vào:** `startDate`, `endDate` (tùy chọn, mặc định là 30 ngày gần nhất).
* **Hành vi hệ thống:**
  1. Truy vấn các bữa ăn của người dùng trong khoảng ngày chỉ định.
  2. Khởi tạo tài liệu PDF khổ A4 bằng thư viện tạo tài liệu.
  3. Vẽ phần đầu trang: Tiêu đề báo cáo, họ tên người dùng, email, phạm vi ngày xuất.
  4. Vẽ bảng dữ liệu gồm 6 cột: `Ngay`, `Bua an`, `Ten mon`, `Calories`, `Protein(g)`, `Carbs(g)`.
  5. Tính tổng cộng số lượng bữa ăn và tổng năng lượng (kcal) để hiển thị ở phần kết luận báo cáo.
  6. Xuất mảng byte PDF với tiêu đề `Content-Disposition: attachment; filename="meal_report_YYYY-MM-DD.pdf"` và kiểu MIME `application/pdf`.
* **Kết quả đầu ra:** Tệp tin tài liệu PDF tải về máy của người dùng.
* **Điều kiện sau:** Không làm thay đổi trạng thái dữ liệu.
* **Quy tắc nghiệp vụ:** RULE-002, NFR-007.
* **Tiêu chí chấp nhận:** AC-016.
* **Nguồn:** `AnalyticsController.java`, `ExportService.java`.
* **Trạng thái:** Đã triển khai.

---

## 8. Danh sách Use Case

### UC-001: Đăng ký và Thiết lập hồ sơ thể trạng ban đầu
* **Mã Use Case:** UC-001
* **Tên Use Case:** Đăng ký và Thiết lập hồ sơ thể trạng ban đầu
* **Actor chính:** ACT-001 (Người dùng mới)
* **Actor phụ:** Không có
* **Mục tiêu:** Tạo tài khoản mới thành công và tính toán mục tiêu calo cá nhân đầu tiên.
* **Điều kiện trước:** Người dùng chưa có tài khoản trên hệ thống.
* **Điều kiện kích hoạt:** Người dùng nhấn nút "Đăng ký" trên màn hình đăng ký.
* **Luồng chính:**
  1. Người dùng nhập Họ tên, Email, Mật khẩu và gửi yêu cầu đăng ký.
  2. Hệ thống kiểm tra dữ liệu, mã hóa mật khẩu và tạo tài khoản mới.
  3. Hệ thống trả về JWT Token và tự động chuyển người dùng đến màn hình thiết lập hồ sơ sức khỏe.
  4. Người dùng nhập các thông số: Tuổi, Giới tính, Chiều cao, Cân nặng, Mức độ vận động và Mục tiêu.
  5. Người dùng nhấn "Lưu hồ sơ".
  6. Hệ thống tự động tính toán BMR, TDEE, Calorie Target, Macros và lưu vào cơ sở dữ liệu.
  7. Hệ thống chuyển hướng người dùng vào màn hình chính (Dashboard / Diary).
* **Luồng thay thế:**
  - *2a. Email đã tồn tại:* Hệ thống hiển thị cảnh báo email đã được sử dụng và yêu cầu nhập email khác.
* **Luồng ngoại lệ:**
  - *1a. Dữ liệu không hợp lệ (Mật khẩu < 6 ký tự hoặc email sai cấu trúc):* Hệ thống hiển thị lỗi tại trường nhập liệu tương ứng.
* **Điều kiện sau:** Tài khoản được tạo và hồ sơ thể trạng được thiết lập đầy đủ.

---

### UC-002: Chụp ảnh món ăn và Ghi nhận bữa ăn thông minh bằng AI
* **Mã Use Case:** UC-002
* **Tên Use Case:** Chụp ảnh món ăn và Ghi nhận bữa ăn thông minh bằng AI
* **Actor chính:** ACT-001 (Người dùng)
* **Actor phụ:** ACT-003 (AI Vision Service), ACT-004 (Cloud Storage)
* **Mục tiêu:** Nhận diện nhanh các món ăn trong ảnh và lưu nhật ký ăn uống chính xác.
* **Điều kiện trước:** Người dùng đã đăng nhập vào ứng dụng di động.
* **Điều kiện kích hoạt:** Người dùng mở Camera và chụp ảnh món ăn hoặc chọn ảnh từ thư viện.
* **Luồng chính:**
  1. Người dùng chụp ảnh bữa ăn trên Mobile App.
  2. Ứng dụng di động tự động nén và thu nhỏ kích thước ảnh ở phía Client.
  3. Ứng dụng gửi ảnh đến API phân tích (`POST /api/v1/meals/analyze`).
  4. Hệ thống lưu ảnh vào bộ nhớ lưu trữ (AWS S3 hoặc Local) và lấy URL truy cập.
  5. Hệ thống gửi ảnh kèm prompt dinh dưỡng đến Gemini Flash Vision API.
  6. Gemini Vision phản hồi dữ liệu cấu trúc JSON bóc tách món ăn và ước tính dinh dưỡng.
  7. Hệ thống trả dữ liệu phân tích sơ bộ về ứng dụng di động.
  8. Ứng dụng di động hiển thị màn hình Xem xét & Chỉnh sửa (Review Screen) gồm ảnh chụp, tên bữa, lời khuyên sức khỏe và danh sách món nhận diện.
  9. Người dùng điều chỉnh phân loại bữa ăn (Sáng/Trưa/Tối/Phụ) và điều chỉnh khối lượng gram của từng món ăn (nếu cần).
  10. Người dùng nhấn nút "Lưu vào nhật ký dinh dưỡng".
  11. Hệ thống lưu bữa ăn và các món ăn thành phần vào cơ sở dữ liệu, cập nhật lại tổng calo tiêu thụ trong ngày.
  12. Hệ thống chuyển người dùng về màn hình Nhật ký ăn uống (Diary) với dữ liệu mới nhất.
* **Luồng thay thế:**
  - *5a. Kết nối AI gặp sự cố hoặc khóa API không hợp lệ:* Hệ thống tự động kích hoạt cơ chế Fallback trả về cấu trúc dữ liệu mô phỏng thông minh để người dùng vẫn có thể tiếp tục chỉnh sửa và lưu bữa ăn.
  - *9a. Người dùng muốn bổ sung thêm món ăn:* Người dùng nhấn "Thêm món", nhập tên và thông số món ăn mới vào danh sách trước khi lưu.
* **Luồng ngoại lệ:**
  - *3a. Kích thước ảnh vượt quá 15MB:* Hệ thống trả về lỗi và yêu cầu nén ảnh hoặc chọn ảnh khác.
  - *10a. Danh sách món ăn bị xóa hết (rỗng):* Hệ thống cảnh báo bữa ăn phải có ít nhất 1 món ăn.
* **Điều kiện sau:** Bữa ăn mới được ghi nhận vào nhật ký và các chỉ số tiến độ ngày được cập nhật tức thì.

---

### UC-003: Theo dõi và Xuất báo cáo dinh dưỡng trên Web Dashboard
* **Mã Use Case:** UC-003
* **Tên Use Case:** Theo dõi và Xuất báo cáo dinh dưỡng trên Web Dashboard
* **Actor chính:** ACT-001 (Người dùng)
* **Actor phụ:** Không có
* **Mục tiêu:** Quan sát biểu đồ dinh dưỡng dài hạn và tải về tệp báo cáo PDF/CSV.
* **Điều kiện trước:** Người dùng đã đăng nhập vào Web Dashboard.
* **Điều kiện kích hoạt:** Người dùng truy cập trang Thống kê (Analytics) hoặc Lịch sử (Meal History).
* **Luồng chính:**
  1. Người dùng chọn phạm vi ngày cần xem (7 ngày gần nhất hoặc 30 ngày).
  2. Hệ thống hiển thị biểu đồ xu hướng calo trung bình và biểu đồ tỷ lệ phân bổ Macros (Protein/Carbs/Fat).
  3. Người dùng nhấn nút "Xuất báo cáo" (Export Report).
  4. Hệ thống mở cửa sổ tùy chọn định dạng xuất (CSV hoặc PDF) và khoảng thời gian.
  5. Người dùng chọn định dạng PDF và nhấn "Tải xuống".
  6. Hệ thống tổng hợp dữ liệu, tạo tệp tài liệu PDF và trả luồng tệp tin về trình duyệt.
  7. Trình duyệt tự động tải tệp `meal_report_YYYY-MM-DD.pdf` về máy tính người dùng.
* **Luồng thay thế:**
  - *5a. Người dùng chọn định dạng CSV:* Hệ thống tạo tệp CSV có mã UTF-8 BOM và tải về máy.
* **Luồng ngoại lệ:**
  - *6a. Không thể tạo tệp xuất:* Hệ thống hiển thị thông báo lỗi và đề nghị thử lại sau.
* **Điều kiện sau:** Người dùng lưu trữ thành công tệp tin báo cáo về máy tính.

---

## 9. Quy tắc nghiệp vụ (Business Rules)

### RULE-001: Tính duy nhất của tài khoản người dùng
* **Mô tả:** Địa chỉ Email là định danh duy nhất của mỗi tài khoản trong toàn bộ hệ thống. Hệ thống không cho phép hai tài khoản sử dụng chung một email. Email phải được chuẩn hóa về dạng chữ thường (lowercase) và loại bỏ khoảng trắng trước khi kiểm tra hoặc lưu trữ.
* **Đối tượng áp dụng:** Bất kỳ người dùng nào thực hiện đăng ký hoặc đăng nhập.
* **Độ ưu tiên:** Cao (Must Have).
* **Nguồn:** `AuthService.java` (dòng 30-37).

### RULE-002: Cô lập quyền sở hữu và bảo vệ dữ liệu cá nhân
* **Mô tả:** Người dùng chỉ có toàn quyền xem, cập nhật, xóa các tài nguyên (hồ sơ sức khỏe, bữa ăn, món ăn, số liệu thống kê) thuộc quyền sở hữu của chính tài khoản của mình. Mọi thao tác truy vấn đều phải ràng buộc điều kiện theo `userId` được trích xuất từ JWT Token của phiên đăng nhập hiện tại.
* **Đối tượng áp dụng:** Toàn bộ các tài nguyên nghiệp vụ trong hệ thống.
* **Độ ưu tiên:** Cao (Must Have).
* **Nguồn:** `MealRepository.java`, `MealService.java`, `HealthProfileService.java`.

### RULE-003: Công thức tính toán chỉ số trao đổi chất cơ bản (BMR)
* **Mô tả:** Chỉ số BMR được tính toán tự động dựa trên phương trình chuẩn **Mifflin-St Jeor**:
  - `Base BMR = (10.0 * Cân nặng_kg) + (6.25 * Chiều cao_cm) - (5.0 * Tuổi)`
  - Giới tính Nam (`MALE`): `BMR = Math.round(Base BMR + 5)`
  - Giới tính Nữ (`FEMALE`): `BMR = Math.round(Base BMR - 161)`
  - Giới tính Khác (`OTHER`): `BMR = Math.round(Base BMR - 78)`
* **Đối tượng áp dụng:** Tất cả các hồ sơ sức khỏe.
* **Độ ưu tiên:** Cao (Must Have).
* **Nguồn:** `HealthProfileService.java` (dòng 69-79).

### RULE-004: Hệ số hoạt động và tính toán tổng năng lượng tiêu thụ (TDEE)
* **Mô tả:** Chỉ số TDEE được tính bằng BMR nhân với hệ số vận động tương ứng của người dùng:
  - `SEDENTARY` (Ít vận động): Hệ số `1.2`
  - `LIGHTLY_ACTIVE` (Vận động nhẹ 1-3 ngày/tuần): Hệ số `1.375`
  - `MODERATELY_ACTIVE` (Vận động vừa 3-5 ngày/tuần): Hệ số `1.55`
  - `VERY_ACTIVE` (Vận động nhiều 6-7 ngày/tuần): Hệ số `1.725`
  - `EXTRA_ACTIVE` (Vận động cực nhiều / Lao động nặng): Hệ số `1.9`
  - `TDEE = Math.round(BMR * Hệ số vận động)`
* **Đối tượng áp dụng:** Tất cả các hồ sơ sức khỏe.
* **Độ ưu tiên:** Cao (Must Have).
* **Nguồn:** `ActivityLevel.java`, `HealthProfileService.java` (dòng 81-83).

### RULE-005: Quy tắc điều chỉnh mục tiêu năng lượng và ngưỡng an toàn
* **Mô tả:** 
  - Mục tiêu Giảm cân (`LOSE_WEIGHT`): Giảm 500 kcal so với TDEE (`TDEE - 500`).
  - Mục tiêu Duy trì (`MAINTAIN`): Bằng chỉ số TDEE (`TDEE + 0`).
  - Mục tiêu Tăng cân / Tăng cơ (`GAIN_WEIGHT`): Tăng 500 kcal so với TDEE (`TDEE + 500`).
  - **Ngưỡng sàn an toàn (Calorie Floor):** Để bảo vệ sức khỏe và tránh suy nhược, mục tiêu calo tính toán tự động không bao giờ được phép thấp hơn **1200 kcal/ngày** (`Math.max(target, 1200)`). Ngoại lệ: Chỉ khi người dùng chủ động cấu hình trường `customDailyCalorieTarget` > 500 kcal thì hệ thống mới áp dụng theo giá trị tùy chỉnh này.
* **Đối tượng áp dụng:** Tính toán mục tiêu calo hàng ngày.
* **Độ ưu tiên:** Cao (Must Have).
* **Nguồn:** `Goal.java`, `HealthProfileService.java` (dòng 48-51, 85-88).

### RULE-006: Tỷ lệ phân bổ dinh dưỡng đa lượng tiêu chuẩn (Macros Distribution)
* **Mô tả:** Sau khi xác định Daily Calorie Target, định mức 3 nhóm chất được phân bổ theo tỷ lệ chuẩn:
  - **Chất đạm (Protein):** Chiếm 30% tổng năng lượng (1g Protein = 4 kcal) -> `Protein (g) = Math.round((CalorieTarget * 0.30) / 4.0)`
  - **Chất bột đường (Carbs):** Chiếm 45% tổng năng lượng (1g Carbs = 4 kcal) -> `Carbs (g) = Math.round((CalorieTarget * 0.45) / 4.0)`
  - **Chất béo (Fat):** Chiếm 25% tổng năng lượng (1g Fat = 9 kcal) -> `Fat (g) = Math.round((CalorieTarget * 0.25) / 9.0)`
* **Đối tượng áp dụng:** Hồ sơ sức khỏe cá nhân.
* **Độ ưu tiên:** Cao (Must Have).
* **Nguồn:** `HealthProfileService.java` (dòng 56-63).

### RULE-007: Tính toàn vẹn và tính toán lại tổng dinh dưỡng bữa ăn
* **Mô tả:** Tổng Calorie, Protein, Carbs, Fat của một bữa ăn (`Meal`) là tổng cộng dồn của tất cả các món ăn thành phần (`MealItem`) trực thuộc bữa ăn đó. Khi một món ăn được thêm, sửa khối lượng hoặc xóa khỏi bữa ăn, hệ thống phải tự động tính toán lại toàn bộ các tổng số này trước khi ghi nhận xuống cơ sở dữ liệu.
* **Đối tượng áp dụng:** Thực thể bữa ăn (`Meal`).
* **Độ ưu tiên:** Cao (Must Have).
* **Nguồn:** `Meal.java` (dòng 84-89), `MealService.java`.

### RULE-008: Phân loại chỉ số khối cơ thể (BMI Category)
* **Mô tả:** Chỉ số BMI được tính bằng công thức: `BMI = Cân nặng (kg) / (Chiều cao (m) ^ 2)`, làm tròn 1 chữ số thập phân. Phân loại theo thang đo tiêu chuẩn:
  - `BMI < 18.5`: Thiếu cân (Underweight)
  - `18.5 <= BMI <= 24.9`: Bình thường (Normal weight)
  - `25.0 <= BMI <= 29.9`: Thừa cân (Overweight)
  - `BMI >= 30.0`: Béo phì (Obese)
* **Đối tượng áp dụng:** Báo cáo hồ sơ sức khỏe.
* **Độ ưu tiên:** Trung bình (Should Have).
* **Nguồn:** `HealthProfileService.java` (dòng 91-104).

---

## 10. Yêu cầu Trí tuệ nhân tạo (AI Requirements)

### AI-001: Phân tích thị giác và Bóc tách dinh dưỡng từ hình ảnh món ăn
* **Mã yêu cầu:** AI-001
* **Tên yêu cầu:** Phân tích thị giác và bóc tách dinh dưỡng từ hình ảnh món ăn
* **Mục đích:** Tự động hóa việc nhận diện các món ăn, ước lượng khối lượng, calo, macros và đưa ra lời khuyên dinh dưỡng từ một bức ảnh chụp.
* **Mô hình AI được chỉ định:** Google Gemini Flash Vision (`gemini-1.5-flash`).
* **Dữ liệu đầu vào gửi tới AI:**
  - Hình ảnh món ăn được mã hóa dạng Base64 đính kèm kiểu MIME (`image/jpeg`, `image/png`,...).
  - Câu lệnh định hướng chuyên gia (Nutrition Analysis Prompt) chỉ định trả về duy nhất chuỗi JSON có cấu trúc chuẩn hóa.
  - Cấu hình sinh (Generation Config): `temperature = 0.2`, `topK = 32`, `topP = 1.0`, `maxOutputTokens = 2048`.
* **Dữ liệu đầu ra nhận về từ AI:**
  - `suggestedMealName`: Tên tổng quan của bữa ăn (Tiếng Việt).
  - `estimatedTotalCalories`: Tổng calo ước tính của bữa ăn (kcal).
  - `estimatedTotalProtein`: Tổng hàm lượng chất đạm (gam).
  - `estimatedTotalCarbs`: Tổng hàm lượng chất bột đường (gam).
  - `estimatedTotalFat`: Tổng hàm lượng chất béo (gam).
  - `healthTip`: Đoạn văn bản lời khuyên dinh dưỡng hữu ích và tích cực.
  - `recognizedItems`: Danh sách các món ăn thành phần nhận diện được, mỗi món gồm: `name`, `estimatedWeightGrams`, `servingSize`, `calories`, `protein`, `carbs`, `fat`, `fiber`, `confidenceScore` (độ tin cậy từ 0.0 đến 1.0).
* **Hành vi mong đợi & Xử lý phản hồi:**
  - Hệ thống phải tự động bóc tách và làm sạch các thẻ bao bọc markdown (như ```json ... ```) từ kết quả phản hồi của AI trước khi phân giải đối tượng.
* **Xử lý lỗi & Cơ chế dự phòng (Fallback):**
  - Trong các trường hợp: Không có API Key hợp lệ, mạng lỗi, dịch vụ AI quá tải (HTTP status không phải 2xx) hoặc phản hồi không thể phân giải JSON, hệ thống **không được làm sập ứng dụng**.
  - Hệ thống phải tự động chuyển sang cơ chế **Fallback thông minh** (`getFallbackAnalysis`), trả về dữ liệu mẫu bữa ăn hoàn chỉnh có cấu trúc để bảo đảm luồng trải nghiệm người dùng không bị gián đoạn.
* **Quyền riêng tư & Bảo mật dữ liệu AI:**
  - Không gửi bất kỳ thông tin định danh cá nhân nào (Email, Họ tên, ID người dùng) tới API của Google. Chỉ gửi duy nhất dữ liệu nhị phân của ảnh món ăn.
* **Nguồn:** `GeminiVisionService.java`.
* **Trạng thái:** Đã triển khai.

---

## 11. Yêu cầu dữ liệu (Data Requirements)

### DATA-001: Dữ liệu tài khoản người dùng
* **Dữ liệu bắt buộc:** Địa chỉ Email (duy nhất, đúng cú pháp), Mật khẩu (đã băm BCrypt), Họ và tên.
* **Dữ liệu tùy chọn:** Đường dẫn ảnh đại diện (`avatarUrl`), Mã định danh Google OAuth (`googleId`), Vai trò (`role`, mặc định `ROLE_USER`).
* **Dữ liệu tự sinh:** Mã định danh người dùng (ID), Ngày giờ tạo (`createdAt`), Ngày giờ cập nhật (`updatedAt`).
* **Quyền riêng tư & Sở hữu:** Thuộc sở hữu duy nhất của chủ tài khoản.

### DATA-002: Dữ liệu hồ sơ sức khỏe và thể trạng
* **Dữ liệu bắt buộc:** Tuổi (10 - 120), Giới tính (`MALE`/`FEMALE`/`OTHER`), Chiều cao (50 - 250 cm), Cân nặng (20 - 300 kg), Mức độ vận động (5 mức), Mục tiêu thể hình (3 mục tiêu).
* **Dữ liệu tùy chọn:** Cân nặng mục tiêu (`targetWeightKg`), Mục tiêu calo tùy chỉnh (`customDailyCalorieTarget`).
* **Dữ liệu tính toán tự động:** BMR, TDEE, Daily Calorie Target, Daily Protein Target (g), Daily Carbs Target (g), Daily Fat Target (g), BMI.
* **Quy tắc quan hệ:** Mỗi tài khoản người dùng chỉ có duy nhất 1 hồ sơ sức khỏe (Quan hệ 1-1).

### DATA-003: Dữ liệu bữa ăn và món ăn thành phần
* **Dữ liệu bữa ăn (`Meal`):**
  - Bắt buộc: Ngày ăn (`mealDate`), Phân loại bữa ăn (`mealType`: Sáng, Trưa, Tối, Phụ), Tổng Calorie, Tổng Protein, Tổng Carbs, Tổng Fat.
  - Tùy chọn: Tên bữa ăn, Đường dẫn ảnh chụp (`imageUrl`), Lời khuyên sức khỏe (`healthTip`), Ghi chú cá nhân (`notes`).
  - Ràng buộc: Một bữa ăn phải chứa ít nhất 1 món ăn thành phần (`MealItem`).
* **Dữ liệu món ăn thành phần (`MealItem`):**
  - Bắt buộc: Tên món ăn (`name`), Lượng Calories (`calories`).
  - Tùy chọn: Khối lượng ước tính (gam), Khẩu phần (`servingSize`), Hàm lượng Protein, Carbs, Fat, Chất xơ (`fiber`), Điểm độ tin cậy AI (`confidenceScore`).
* **Quy tắc quan hệ:** Xóa bữa ăn sẽ tự động xóa tất cả các món ăn thành phần thuộc bữa ăn đó (Cascade Delete / Orphan Removal).

---

## 12. Yêu cầu bảo mật (Security Requirements)

### SEC-001: Xác thực người dùng bằng JSON Web Token (JWT)
* **Mô tả:** Hệ thống phải áp dụng cơ chế xác thực không lưu trạng thái (Stateless Session). Sau khi đăng nhập thành công, máy chủ cấp phát mã JWT Token có chữ ký bảo mật HMAC-SHA256. Toàn bộ các API nghiệp vụ yêu cầu kiểm tra JWT Token qua tiêu đề HTTP `Authorization: Bearer <token>`.
* **Thời hạn hiệu lực:** Mã Access Token có thời hạn sử dụng trong **24 giờ** (86,400,000 ms).
* **Nguồn:** `JwtService.java`, `JwtAuthenticationFilter.java`, `SecurityConfig.java`.

### SEC-002: Mã hóa mật khẩu người dùng
* **Mô tả:** Hệ thống tuyệt đối không được lưu trữ mật khẩu dưới dạng văn bản thuần (Plaintext). Mật khẩu phải được băm bằng thuật toán `BCryptPasswordEncoder` trước khi lưu trữ vào cơ sở dữ liệu.
* **Nguồn:** `SecurityConfig.java`, `AuthService.java`.

### SEC-003: Kiểm soát phân quyền và Bảo vệ Endpoint (RBAC)
* **Mô tả:** 
  - **Endpoint công khai (Permit All):** `/api/v1/auth/register`, `/api/v1/auth/login`, `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html`, `/uploads/**`.
  - **Endpoint yêu cầu xác thực:** Toàn bộ các endpoint còn lại (`/api/v1/auth/me`, `/api/v1/profile/**`, `/api/v1/meals/**`, `/api/v1/analytics/**`). Nếu không có token hợp lệ, trả về mã trạng thái `401 Unauthorized`.
  - Nếu người dùng truy cập trái quyền, trả về mã trạng thái `403 Forbidden`.
* **Nguồn:** `SecurityConfig.java`, `GlobalExceptionHandler.java`.

### SEC-004: Bảo mật tệp tin đa phương tiện và Chống xung đột tệp
* **Mô tả:** Khi người dùng tải ảnh lên, tên tệp tin gốc phải được thay thế hoàn toàn bằng chuỗi định danh ngẫu nhiên chuẩn UUID phiên bản 4 để tránh xung đột tên tệp, che giấu cấu trúc dữ liệu nhạy cảm từ phía người dùng và ngăn chặn tấn công Path Traversal.
* **Nguồn:** `StorageService.java`.

---

## 13. Yêu cầu phi chức năng (Non-Functional Requirements)

### 13.1 Hiệu năng (Performance)
* **NFR-001 (Dung lượng tải lên):** Hệ thống giới hạn kích thước tối đa cho mỗi tệp tin tải lên và toàn bộ yêu cầu tải ảnh là **15 MB** (`spring.servlet.multipart.max-file-size: 15MB`).
* **NFR-002 (Tối ưu hóa ảnh tại Client):** Ứng dụng di động phải thực hiện nén và thu nhỏ độ phân giải hình ảnh trước khi gửi lên máy chủ để tiết kiệm băng thông mạng của người dùng.
* **NFR-003 (Thời gian phản hồi):** Chưa xác định ngưỡng cam kết SLA cụ thể (TBD), phụ thuộc vào độ trễ mạng và thời gian xử lý của Gemini Vision API.

### 13.2 Bảo mật (Security)
* **NFR-004 (Bảo vệ dữ liệu truyền tải):** Toàn bộ giao tiếp giữa Mobile/Web và Backend phải được thực hiện qua giao thức mã hóa HTTPS/TLS.
* **NFR-005 (Kiểm soát nguồn gốc chia sẻ tài nguyên - CORS):** Máy chủ cấu hình bộ lọc CORS cho phép kết nối an toàn từ các nguồn gốc hợp lệ của Web Dashboard và Mobile App.

### 13.3 Độ tin cậy & Tính sẵn sàng (Reliability & Availability)
* **NFR-006 (Khả năng chịu lỗi dịch vụ bên ngoài):** Khi AWS S3 không khả dụng hoặc chưa cấu hình khóa truy cập, hệ thống phải tự động lưu trữ ảnh vào bộ nhớ tệp cục bộ (`localStorageDir`). Khi Gemini AI gặp sự cố, hệ thống tự động trả dữ liệu mô phỏng dự phòng để duy trì hoạt động liên tục.
* **NFR-007 (Tính toàn vẹn dữ liệu):** Các thao tác ghi nhận hoặc chỉnh sửa bữa ăn có nhiều món con phải được thực hiện trong phạm vi giao dịch cơ sở dữ liệu (`@Transactional`).

### 13.4 Khả năng mở rộng (Scalability)
* **NFR-008 (Kiến trúc phân tầng không lưu trạng thái):** Backend thiết kế theo kiến trúc Layered Architecture (Controller -> Service -> Repository -> Database) và Stateless JWT, cho phép dễ dàng mở rộng theo chiều ngang (Scale Out) trên các cụm máy chủ hoặc vùng chứa Docker.

### 13.5 Khả năng sử dụng (Usability)
* **NFR-009 (Đa ngôn ngữ & Thân thiện):** Toàn bộ thông báo lỗi nghiệp vụ, tên loại bữa ăn, phản hồi API và nhãn giao diện hiển thị cho người dùng phải sử dụng tiếng Việt rõ ràng, dễ hiểu.
* **NFR-010 (Tính tương tác & Khả năng kiểm soát):** Người dùng luôn có quyền xem lại, can thiệp điều chỉnh trọng lượng/thành phần món ăn sau khi AI phân tích trước khi lưu chính thức.

### 13.6 Khả năng bảo trì & Tài liệu hóa (Maintainability)
* **NFR-011 (Tài liệu hóa API tự động):** Toàn bộ API Backend phải được chú thích Swagger/OpenAPI 3.0 đầy đủ và cung cấp giao diện trực quan tại đường dẫn `/swagger-ui.html`.

### 13.7 Khả năng tương thích (Compatibility)
* **NFR-012 (Tương thích nền tảng):** 
  - Mobile App tương thích cả 2 nền tảng iOS và Android (thông qua React Native / Expo).
  - Web Dashboard tương thích với tất cả các trình duyệt web hiện đại (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
* **NFR-013 (Tương thích xuất dữ liệu):** Tệp CSV xuất ra phải chứa mã UTF-8 BOM để hiển thị đúng ký tự tiếng Việt có dấu khi mở bằng Microsoft Excel.

---

## 14. Hệ thống bên ngoài (External Systems)

### EXT-001: Google Gemini Flash Vision API
* **Mã hệ thống:** EXT-001
* **Tên hệ thống:** Google Gemini Flash Vision API
* **Mục đích:** Xử lý thị giác máy tính nhận diện thành phần món ăn, khối lượng ước lượng và hàm lượng dinh dưỡng.
* **Giao thức tương tác:** HTTP REST API (POST qua `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`).
* **Dữ liệu gửi đi:** Chuỗi dữ liệu ảnh Base64, MIME type, câu lệnh phân tích dinh dưỡng và cấu hình sinh token.
* **Dữ liệu nhận về:** Cấu trúc JSON chứa tên món, calo, protein, carbs, fat, lời khuyên sức khỏe và danh sách món nhận diện.
* **Sự phụ thuộc:** Khóa API hợp lệ (`GEMINI_API_KEY`) và tính sẵn sàng của dịch vụ Google AI.

### EXT-002: Amazon Web Services S3 (AWS S3)
* **Mã hệ thống:** EXT-002
* **Tên hệ thống:** Dịch vụ lưu trữ đối tượng Amazon Simple Storage Service (AWS S3)
* **Mục đích:** Lưu trữ hình ảnh bữa ăn trên đám mây với độ bền cao và phân phối ảnh qua URL công khai.
* **Giao thức tương tác:** AWS SDK for Java 2.x (S3Client `PutObjectRequest`).
* **Dữ liệu gửi đi:** Luồng byte hình ảnh, kiểu Content-Type, tên Bucket, tên tệp (Key).
* **Dữ liệu nhận về:** Đường dẫn URL công khai tới đối tượng ảnh trên S3.
* **Sự phụ thuộc:** Tài khoản AWS, S3 Bucket (`AWS_S3_BUCKET`), Access Key, Secret Key và AWS Region (`ap-southeast-1`).

### EXT-003: Hệ quản trị cơ sở dữ liệu PostgreSQL
* **Mã hệ thống:** EXT-003
* **Tên hệ thống:** PostgreSQL Relational Database (Phiên bản 15+)
* **Mục đích:** Lưu trữ quan hệ bền vững cho tài khoản người dùng, hồ sơ sức khỏe, nhật ký bữa ăn và các món ăn thành phần.
* **Giao thức tương tác:** JDBC / Hibernate ORM qua cổng 5432.
* **Sự phụ thuộc:** Dịch vụ PostgreSQL hoạt động và cấu hình kết nối `SPRING_DATASOURCE_URL`.

---

## 15. Sự phụ thuộc hệ thống (Dependencies)

| Thành phần | Loại phụ thuộc | Tên công nghệ / Dịch vụ | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Backend Core** | Framework | Spring Boot 3.x (Java 17+) | Khung phát triển ứng dụng máy chủ và RESTful API. |
| **Bảo mật & Xác thực** | Library | Spring Security 6, jjwt (Java JWT) | Xác thực mã thông báo và mã hóa mật khẩu BCrypt. |
| **Truy xuất dữ liệu** | Library / Driver | Spring Data JPA, Hibernate, PostgreSQL JDBC Driver | Quản lý thực thể và thao tác cơ sở dữ liệu quan hệ. |
| **Thị giác AI** | Dịch vụ đám mây | Google Gemini Flash Vision (`gemini-1.5-flash`) | Phân tích hình ảnh bữa ăn và bóc tách dinh dưỡng. |
| **Lưu trữ tệp tin** | Dịch vụ đám mây / SDK | AWS SDK for Java (S3 Client v2) | Lưu trữ hình ảnh đám mây. |
| **Xuất báo cáo** | Library | OpenPDF / iText, Apache Commons CSV | Tạo tài liệu báo cáo định dạng PDF và CSV. |
| **Mobile App** | Framework | React Native (Expo SDK) | Xây dựng ứng dụng di động đa nền tảng iOS & Android. |
| **Web Dashboard** | Framework / Library | React 18, Vite, Lucide React, Chart.js / Recharts | Xây dựng giao diện quản trị và biểu đồ phân tích trên trình duyệt. |

---

## 16. Tiêu chí chấp nhận (Acceptance Criteria)

### AC-001: Tiêu chí chấp nhận đăng ký tài khoản (FR-001)
* **Điều kiện:** Người dùng chưa có tài khoản trong hệ thống.
* **Khi:** Người dùng gửi yêu cầu đăng ký với họ tên, email chưa từng tồn tại và mật khẩu từ 6 ký tự trở lên.
* **Thì:** Hệ thống phải tạo mới bản ghi người dùng với mật khẩu đã mã hóa, trả về mã trạng thái 201 Created kèm JWT Token hợp lệ và thông tin tài khoản cơ bản.

### AC-002: Tiêu chí chấp nhận đăng nhập tài khoản (FR-002)
* **Điều kiện:** Người dùng đã có tài khoản tồn tại trong hệ thống.
* **Khi:** Người dùng gửi đúng email và mật khẩu đã đăng ký.
* **Thì:** Hệ thống phải xác thực thành công, trả về mã trạng thái 200 OK kèm JWT Token có thời hạn 24 giờ. Nếu sai email hoặc mật khẩu, hệ thống phải trả về lỗi 400 Bad Request hoặc 401 Unauthorized với thông báo "Email hoặc mật khẩu không chính xác".

### AC-003: Tiêu chí chấp nhận lấy thông tin cá nhân (FR-003)
* **Điều kiện:** Người dùng đã đăng nhập và gửi kèm JWT Token hợp lệ.
* **Khi:** Người dùng gọi `GET /api/v1/auth/me`.
* **Thì:** Hệ thống phải trả về thông tin tài khoản chính xác cùng cờ `hasHealthProfile` phản ánh đúng trạng thái hồ sơ sức khỏe.

### AC-004: Tiêu chí chấp nhận thiết lập hồ sơ sức khỏe (FR-004)
* **Điều kiện:** Người dùng đã đăng nhập.
* **Khi:** Người dùng gửi thông số thể trạng (Tuổi 25, Nam, 175cm, 70kg, Vận động vừa `MODERATELY_ACTIVE`, Giảm cân `LOSE_WEIGHT`).
* **Thì:** Hệ thống phải tính toán chính xác BMR = 1669 kcal, TDEE = 2587 kcal, Daily Calorie Target = 2087 kcal, Protein = 157g, Carbs = 235g, Fat = 58g, lưu vào cơ sở dữ liệu và trả về kết quả 200 OK.

### AC-005: Tiêu chí chấp nhận ngưỡng an toàn calo (FR-005)
* **Điều kiện:** Người dùng có chỉ số TDEE thấp (ví dụ TDEE = 1400 kcal) và chọn mục tiêu giảm cân (-500 kcal).
* **Khi:** Hệ thống thực hiện tính toán Calorie Target tự động.
* **Thì:** Mục tiêu calo trả về phải được giới hạn ở ngưỡng tối thiểu là 1200 kcal (`Math.max(1400 - 500, 1200) = 1200 kcal`).

### AC-006: Tiêu chí chấp nhận truy vấn hồ sơ sức khỏe (FR-006)
* **Điều kiện:** Người dùng chưa từng thiết lập hồ sơ sức khỏe.
* **Khi:** Người dùng gọi `GET /api/v1/profile`.
* **Thì:** Hệ thống phải trả về mã lỗi 404 Not Found kèm thông báo "Người dùng chưa thiết lập hồ sơ sức khỏe".

### AC-007: Tiêu chí chấp nhận phân tích ảnh AI (FR-007)
* **Điều kiện:** Người dùng đã đăng nhập và chọn tệp ảnh bữa ăn hợp lệ (<= 15MB).
* **Khi:** Người dùng gọi `POST /api/v1/meals/analyze`.
* **Thì:** Hệ thống phải lưu trữ ảnh thành công, gửi tới Gemini Vision API, trả về tên món ăn, ước tính calo, macros, lời khuyên sức khỏe và danh sách món nhận diện. Nếu AI gặp sự cố, hệ thống phải kích hoạt Fallback trả về dữ liệu mẫu mà không gây sập hệ thống.

### AC-008: Tiêu chí chấp nhận lưu bữa ăn (FR-008)
* **Điều kiện:** Người dùng đã đăng nhập và cung cấp danh sách món ăn có ít nhất 1 món.
* **Khi:** Người dùng gọi `POST /api/v1/meals`.
* **Thì:** Hệ thống phải tạo mới bản ghi `Meal`, tính lại tổng calo/macros từ các món con, lưu trữ vào cơ sở dữ liệu và trả về mã trạng thái 201 Created cùng đối tượng `MealDto`.

### AC-009: Tiêu chí chấp nhận xem nhật ký bữa ăn theo ngày (FR-009)
* **Điều kiện:** Người dùng đã có các bữa ăn được ghi nhận trong ngày.
* **Khi:** Người dùng gọi `GET /api/v1/meals/daily?date=YYYY-MM-DD`.
* **Thì:** Hệ thống phải trả về danh sách tất cả các bữa ăn thuộc về người dùng trong ngày đó, kèm danh sách chi tiết các món con của từng bữa.

### AC-010: Tiêu chí chấp nhận tính cô lập dữ liệu (FR-010, FR-011, FR-012)
* **Điều kiện:** Bữa ăn có mã ID = 100 thuộc về Người dùng A.
* **Khi:** Người dùng B (đã đăng nhập tài khoản của B) cố gắng gọi `GET`, `PUT`, hoặc `DELETE` tới `/api/v1/meals/100`.
* **Thì:** Hệ thống phải từ chối truy cập và trả về mã lỗi 404 Not Found ("Không tìm thấy bữa ăn với ID: 100") để bảo vệ dữ liệu của Người dùng A.

### AC-011: Tiêu chí chấp nhận cập nhật bữa ăn (FR-011)
* **Điều kiện:** Người dùng là chủ sở hữu của bữa ăn.
* **Khi:** Người dùng gửi yêu cầu cập nhật danh sách món ăn của bữa ăn đó.
* **Thì:** Hệ thống phải thay thế danh sách món cũ bằng danh sách món mới, tự động tính toán lại tổng calo/macros và trả về `MealDto` đã cập nhật.

### AC-012: Tiêu chí chấp nhận xóa bữa ăn (FR-012)
* **Điều kiện:** Người dùng là chủ sở hữu của bữa ăn.
* **Khi:** Người dùng gọi `DELETE /api/v1/meals/{id}`.
* **Thì:** Hệ thống phải xóa bữa ăn và toàn bộ các món con liên quan, trả về thông báo thành công. Khi truy vấn lại ID đó, hệ thống trả về lỗi 404.

### AC-013: Tiêu chí chấp nhận thống kê ngày (FR-013)
* **Điều kiện:** Người dùng có mục tiêu calo là 2000 kcal và đã ăn tổng cộng 1450 kcal trong ngày.
* **Khi:** Người dùng gọi `GET /api/v1/analytics/daily-summary`.
* **Thì:** Hệ thống phải trả về `totalCaloriesConsumed = 1450.0`, `calorieTarget = 2000`, `remainingCalories = 550.0` cùng tổng lượng Protein, Carbs, Fat tiêu thụ.

### AC-014: Tiêu chí chấp nhận thống kê khoảng thời gian (FR-014)
* **Điều kiện:** Người dùng có dữ liệu nhật ký ăn uống trong 7 ngày qua.
* **Khi:** Người dùng gọi `GET /api/v1/analytics/range`.
* **Thì:** Hệ thống phải trả về mảng 7 phần tử tóm tắt của từng ngày, tính đúng calo trung bình hàng ngày và tỷ lệ phân bố % năng lượng của Protein, Carbs, Fat.

### AC-015: Tiêu chí chấp nhận xuất tệp CSV (FR-015)
* **Điều kiện:** Người dùng có dữ liệu bữa ăn trong khoảng thời gian xuất.
* **Khi:** Người dùng gọi `GET /api/v1/analytics/export/csv`.
* **Thì:** Hệ thống phải trả về tệp CSV với mã hóa UTF-8 BOM, chứa đúng các cột tiêu đề và hiển thị đúng tiếng Việt có dấu khi mở bằng Microsoft Excel.

### AC-016: Tiêu chí chấp nhận xuất tệp PDF (FR-016)
* **Điều kiện:** Người dùng có dữ liệu bữa ăn trong khoảng thời gian xuất.
* **Khi:** Người dùng gọi `GET /api/v1/analytics/export/pdf`.
* **Thì:** Hệ thống phải trả về luồng tệp tin có kiểu MIME `application/pdf`, chứa bảng tổng hợp dữ liệu bữa ăn rõ ràng, thông tin người dùng và tổng số năng lượng.

---

## 17. Ma trận truy vết yêu cầu (Requirement Traceability Matrix)

| Yêu cầu nghiệp vụ | User Story | Yêu cầu chức năng | Tiêu chí chấp nhận | Use Case | Nguồn đối chiếu | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BR-001** | US-006, US-007, US-008 | FR-007, FR-008 | AC-007, AC-008 | UC-002 | `GeminiVisionService.java`, `MealService.java` | Đã triển khai |
| **BR-002** | US-004, US-005 | FR-004, FR-005, FR-006 | AC-004, AC-005, AC-006 | UC-001 | `HealthProfileService.java`, `HealthProfileController.java` | Đã triển khai |
| **BR-003** | US-009, US-010, US-013, US-014 | FR-009, FR-010, FR-013, FR-014 | AC-009, AC-010, AC-013, AC-014 | UC-002, UC-003 | `AnalyticsService.java`, `MealService.java` | Đã triển khai |
| **BR-004** | US-008, US-009, US-013 | FR-008, FR-009, FR-013 | AC-008, AC-009, AC-013 | UC-002, UC-003 | Mobile App & Web Dashboard codebase | Đã triển khai |
| **BR-005** | US-015, US-016 | FR-015, FR-016 | AC-015, AC-016 | UC-003 | `ExportService.java`, `AnalyticsController.java` | Đã triển khai |
| - | US-001, US-002, US-003 | FR-001, FR-002, FR-003 | AC-001, AC-002, AC-003 | UC-001 | `AuthService.java`, `AuthController.java` | Đã triển khai |
| - | US-011, US-012 | FR-011, FR-012 | AC-011, AC-012 | UC-002 | `MealService.java`, `MealController.java` | Đã triển khai |

---

## 18. Mâu thuẫn yêu cầu (Requirement Conflicts)

### CONFLICT-001: Tính năng đăng nhập Google OAuth 2.0
* **Mô tả mâu thuẫn:** Trong tài liệu `README.md` (Mục 2.1 & Bảng công nghệ) có mô tả hệ thống hỗ trợ "Đăng ký / Đăng nhập an toàn qua Email & Password hoặc Google OAuth 2.0", và trong thực thể `User.java` có định nghĩa trường `googleId`. Tuy nhiên, trong mã nguồn `AuthController.java` và cấu hình bảo mật `SecurityConfig.java` hiện tại, hệ thống mới chỉ triển khai luồng xác thực qua Email & Mật khẩu thuần túy, chưa có endpoint tiếp nhận callback hoặc trao đổi mã xác thực OAuth2 từ Google.
* **Nguồn 1:** `README.md` (Dòng 34, 138), `User.java` (Dòng 44).
* **Nguồn 2:** `AuthController.java`, `SecurityConfig.java`.
* **Ảnh hưởng:** Người dùng không thể thực hiện đăng nhập bằng Google trên ứng dụng thực tế.
* **Trạng thái:** Chưa giải quyết (Cần xác nhận kế hoạch bổ sung).
* **Hướng xử lý đề xuất:** Bổ sung luồng xác thực Google OAuth2 trong phiên bản tiếp theo hoặc cập nhật lại mô tả trong tài liệu hướng dẫn.

---

## 19. Khoảng trống yêu cầu (Requirement Gaps)

### GAP-001: Tính năng tìm kiếm món ăn thủ công từ Cơ sở dữ liệu (Fallback Search)
* **Yêu cầu theo tài liệu:** `README.md` (Mục 2.2) có nêu tính năng "Tìm kiếm thủ công (Fallback Search): Cho phép tìm kiếm món ăn từ cơ sở dữ liệu khi không có ảnh hoặc trong điều kiện mạng yếu".
* **Hiện trạng trong mã nguồn:** Trong cơ sở dữ liệu hiện tại chỉ có các bảng `meals` và `meal_items` lưu dữ liệu cá nhân của từng user, chưa có bảng danh mục thực phẩm mẫu chung (Food Composition Database / Nutrition Dictionary) và chưa có API tìm kiếm món ăn theo từ khóa.
* **Trạng thái:** Chưa triển khai trong Backend.
* **Đề xuất:** Cần xác nhận có bổ sung bảng cơ sở dữ liệu thực phẩm mẫu (ví dụ: Bảng thành phần thực phẩm Việt Nam / USDA) để cung cấp API tìm kiếm hay không.

### GAP-002: Phân quyền và Chức năng cho Quản trị viên (ROLE_ADMIN)
* **Yêu cầu theo mã nguồn:** Trong thực thể `User.java` và enum `Role.java` có định nghĩa vai trò `ROLE_ADMIN`.
* **Hiện trạng trong mã nguồn:** Chưa có bất kỳ API, nghiệp vụ hay giao diện nào được xây dựng riêng dành cho vai trò Quản trị viên (ví dụ: Quản lý danh sách người dùng, xem thống kê hệ thống toàn cục, cấu hình định mức thực phẩm).
* **Trạng thái:** Triển khai một phần (chỉ mới có định nghĩa Role trong mã nguồn).
* **Đề xuất:** Cần xác nhận phạm vi chức năng dành cho Quản trị viên trong các giai đoạn phát triển tiếp theo.

### GAP-003: Các tính năng thuộc Lộ trình phát triển tương lai (Roadmap)
* **Các tính năng:** 
  1. Gợi ý thực đơn thông minh dựa trên lượng calories còn lại trong ngày (AI Meal Recommendation).
  2. Hỗ trợ quét mã vạch sản phẩm đóng gói (Barcode Scanner).
  3. Đồng bộ dữ liệu sức khỏe với Apple HealthKit & Google Fit.
* **Hiện trạng:** Đã được liệt kê trong mục Roadmap của `README.md` nhưng chưa có bất kỳ mã nguồn triển khai nào.
* **Trạng thái:** Đã ghi nhận trong lộ trình (Chưa triển khai).

---

## 20. Các vấn đề cần xác nhận (Open Questions)

| ID | Vấn đề cần xác nhận | Ảnh hưởng | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Q-001** | Khi nào dự án sẽ triển khai hoàn thiện tính năng đăng nhập Google OAuth 2.0 trên Backend và Mobile? | Ảnh hưởng đến luồng đăng nhập và trải nghiệm người dùng mới. | Chưa xác nhận |
| **Q-002** | Hệ thống có cần tích hợp bảng dữ liệu thực phẩm chuẩn (Viện Dinh dưỡng Quốc gia / USDA) phục vụ tìm kiếm thủ công khi không có ảnh không? | Ảnh hưởng đến thiết kế cơ sở dữ liệu và khả năng nhập liệu khi không có kết nối camera. | Chưa xác nhận |
| **Q-003** | Vai trò `ROLE_ADMIN` có cần một bảng điều khiển Web Quản trị (Admin Portal) riêng biệt trong giai đoạn này không? | Ảnh hưởng đến phạm vi xây dựng giao diện Web Dashboard và API bảo mật. | Chưa xác nhận |
| **Q-004** | Ngưỡng thời gian phản hồi kỳ vọng (SLA) đối với chức năng phân tích ảnh AI là bao nhiêu giây? | Ảnh hưởng đến tiêu chí phi chức năng về hiệu năng và cơ chế hiển thị màn hình chờ (Loading state) trên Mobile App. | Chưa xác nhận |

---

## 21. Phụ lục (Appendix)

### Danh mục API Endpoint hiện có trong hệ thống

```text
=======================================================================================================
NHÓM 1: XÁC THỰC & TÀI KHOẢN (/api/v1/auth)
-------------------------------------------------------------------------------------------------------
POST   /api/v1/auth/register          - Đăng ký tài khoản người dùng mới (Public)
POST   /api/v1/auth/login             - Đăng nhập Email & Mật khẩu, lấy JWT Token (Public)
GET    /api/v1/auth/me                - Lấy thông tin tài khoản đang đăng nhập (Yêu cầu JWT)

=======================================================================================================
NHÓM 2: HỒ SƠ SỨC KHỎE & THỂ TRẠNG (/api/v1/profile)
-------------------------------------------------------------------------------------------------------
GET    /api/v1/profile                - Lấy thông tin hồ sơ sức khỏe và các chỉ số BMR/TDEE (Yêu cầu JWT)
POST   /api/v1/profile                - Tạo mới hoặc cập nhật hồ sơ sức khỏe & mục tiêu calo (Yêu cầu JWT)

=======================================================================================================
NHÓM 3: BỮA ĂN & PHÂN TÍCH AI (/api/v1/meals)
-------------------------------------------------------------------------------------------------------
POST   /api/v1/meals/analyze          - Tải ảnh lên và phân tích dinh dưỡng qua Gemini AI (Yêu cầu JWT)
POST   /api/v1/meals                  - Lưu bữa ăn đã xác nhận vào nhật ký dinh dưỡng (Yêu cầu JWT)
GET    /api/v1/meals/daily            - Lấy danh sách các bữa ăn theo ngày (Yêu cầu JWT)
GET    /api/v1/meals/{id}             - Xem chi tiết bữa ăn theo mã ID (Yêu cầu JWT)
PUT    /api/v1/meals/{id}             - Cập nhật thông tin và danh sách món của bữa ăn (Yêu cầu JWT)
DELETE /api/v1/meals/{id}             - Xóa một bữa ăn khỏi nhật ký (Yêu cầu JWT)

=======================================================================================================
NHÓM 4: THỐNG KÊ & BÁO CÁO (/api/v1/analytics)
-------------------------------------------------------------------------------------------------------
GET    /api/v1/analytics/daily-summary - Lấy thống kê calo và macros trong ngày (Yêu cầu JWT)
GET    /api/v1/analytics/range        - Lấy thống kê calo/macros theo khoảng ngày (7/30 ngày) (Yêu cầu JWT)
GET    /api/v1/analytics/export/csv   - Xuất dữ liệu nhật ký dạng tệp CSV (Yêu cầu JWT)
GET    /api/v1/analytics/export/pdf   - Xuất báo cáo dinh dưỡng dạng tệp PDF (Yêu cầu JWT)
=======================================================================================================
```
