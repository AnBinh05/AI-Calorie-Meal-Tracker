# ☁️ Hướng Dẫn Triển Khai NutriAI Lên AWS (Amazon Web Services)

Tài liệu này hướng dẫn chi tiết từng bước cách deploy toàn bộ hệ sinh thái **NutriAI (PostgreSQL + Spring Boot 3 Backend + React Vite Frontend + AWS S3 Storage)** lên hạ tầng đám mây AWS với tiêu chuẩn bảo mật cao nhất, tối ưu chi phí và tận dụng **AWS Free Tier (0đ)**.

---

## 🏗️ 1. Lựa Chọn Kiến Trúc Triển Khai Trên AWS

| Tiêu chí | Tùy chọn 1: AWS EC2 + Docker Compose (Khuyên dùng) | Tùy chọn 2: AWS Managed Services (App Runner + RDS + S3) |
| :--- | :--- | :--- |
| **Chi phí** | **Miễn phí 100%** (Trong gói 750h/tháng EC2 `t3.micro` / `t4g.small` Free Tier) | Free Tier (RDS + App Runner), có thể phát sinh phí nhỏ nếu vượt hạn mức |
| **Độ phức tạp** | **Đơn giản nhất**: 1 máy ảo quản lý tất cả qua Docker | Trung bình: Cần liên kết VPC, Security Groups giữa App Runner và RDS |
| **Thời gian triển khai** | **~10 phút** | ~25 phút |
| **Phù hợp cho** | Cá nhân, đồ án, startup MVP thử nghiệm, demo nhanh | Dự án production quy mô lớn, nhiều người truy cập đồng thời |

---

## 🚀 TÙY CHỌN 1: Triển Khai Nhanh Bằng AWS EC2 + Docker Compose (Khuyên dùng)

### Bước 1: Khởi tạo Máy Ảo AWS EC2 (Free Tier)
1. Đăng nhập [AWS Management Console](https://console.aws.amazon.com/).
2. Chọn Region gần Việt Nam nhất: **Singapore (`ap-southeast-1`)**.
3. Vào dịch vụ **EC2** ➔ bấm nút **Launch Instance**:
   * **Name:** `nutriai-server`
   * **OS Image:** **Ubuntu 22.04 LTS (HVM)**, SSD Volume Type.
   * **Instance Type:** `t3.micro` (hoặc `t4g.small` nếu có - Free Tier eligible).
   * **Key Pair (SSH):** Tạo một key pair mới dạng `.pem` (Ví dụ: `nutriai-key.pem`), tải về máy và cất giữ an toàn.
   * **Network Settings (Security Group):** Tích chọn:
     * ✅ **Allow SSH traffic from** ➔ Chọn *My IP* (để chỉ máy tính của bạn mới SSH được).
     * ✅ **Allow HTTP traffic from the internet** (Cổng 80 - cho Web Frontend).
     * ✅ **Allow HTTPS traffic from the internet** (Cổng 443).
   * **Configure Storage:** Đổi từ `8 GiB` thành `20 GiB` gp3 (Nằm trong hạn mức 30 GiB free của AWS).
4. Bấm **Launch Instance**. Đợi 1-2 phút để máy ảo ở trạng thái `Running`.

---

### Bước 2: Thiết lập AWS S3 Bucket & IAM User Cho Lưu Trữ Ảnh

#### 2.1. Tạo S3 Bucket
1. Vào dịch vụ **Amazon S3** ➔ Bấm **Create bucket**.
2. **Bucket name:** `nutriai-meals-bucket` (Tên phải là duy nhất trên toàn cầu).
3. **Region:** `ap-southeast-1` (Singapore).
4. **Block Public Access:** Tắt dấu tích *Block all public access* và tích xác nhận rủi ro (để người dùng xem được ảnh sau khi tải lên).
5. Bấm **Create bucket**.
6. Vào bucket vừa tạo ➔ Tab **Permissions** ➔ **Bucket policy** ➔ Paste cấu hình cho phép xem ảnh:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::nutriai-meals-bucket/meals/*"
    }
  ]
}
```
*(Thay `nutriai-meals-bucket` bằng tên bucket thật của bạn).*

#### 2.2. Tạo IAM User và cấp quyền (Quyền tối thiểu - Tránh rò rỉ)
1. Vào dịch vụ **IAM** ➔ **Users** ➔ **Create user**.
2. Đặt tên: `nutriai-backend-user`.
3. Chọn **Attach policies directly** ➔ Gán quyền `AmazonS3FullAccess` (hoặc policy giới hạn trên bucket của bạn).
4. Sau khi tạo xong, vào user ➔ tab **Security credentials** ➔ **Create access key** ➔ chọn *Application running outside AWS*.
5. Tải file CSV chứa:
   * `AWS_ACCESS_KEY_ID` (dạng `AKIA...`)
   * `AWS_SECRET_ACCESS_KEY`

---

### Bước 3: SSH Vào Máy Ảo EC2 & Cài Đặt Docker

Mở PowerShell trên máy tính của bạn (tại thư mục chứa file `nutriai-key.pem`):
```powershell
# Phân quyền cho file key (trên Linux/Mac: chmod 400 nutriai-key.pem)
# Kết nối SSH (thay IP bằng Public IPv4 của EC2):
ssh -i "nutriai-key.pem" ubuntu@<PUBLIC_IP_CUA_EC2>
```

Khi đã vào bên trong máy ảo EC2, chạy các lệnh sau để cài đặt Docker & Docker Compose:
```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
sudo apt install -y docker.io docker-compose-plugin git

# Cho phép user ubuntu chạy docker không cần sudo
sudo usermod -aG docker $USER
newgrp docker

# Kiểm tra docker
docker --version
docker compose version
```

---

### Bước 4: Clone Dự Án & Thiết Lập Biến Môi Trường Bí Mật (.env)

1. Clone mã nguồn từ GitHub vào EC2:
```bash
git clone https://github.com/AnBinh05/AI-Calorie-Meal-Tracker.git
cd AI-Calorie-Meal-Tracker
```

2. Tạo file `.env` bí mật trên EC2 (file này KHÔNG bao giờ bị đẩy lên Git):
```bash
nano .env
```

3. Dán toàn bộ cấu hình thực tế của bạn vào file `.env`:
```properties
# 1. Database PostgreSQL
POSTGRES_DB=calorie_tracker_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=MatKhauDatabaseCucKyManh123!@#

# 2. JWT Secret (Sinh ngẫu nhiên bằng lệnh openssl rand -base64 32)
JWT_SECRET=Wp49QxK2f...chuỗi_base64_256bit_của_bạn...=

# 3. Google Gemini Flash Vision API Key
GEMINI_API_KEY=AIzaSy...api_key_gemini_cua_ban...

# 4. AWS S3 Storage
AWS_S3_ENABLED=true
AWS_S3_BUCKET=nutriai-meals-bucket
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=AKIA...access_key_cua_ban...
AWS_SECRET_ACCESS_KEY=secret_access_key_cua_ban...

# 5. Frontend trỏ tới Backend
VITE_API_BASE_URL=http://<PUBLIC_IP_CUA_EC2>:8080
```
*Nhấn `Ctrl + O` để lưu, sau đó nhấn `Ctrl + X` để thoát `nano`.*

---

### Bước 5: Khởi Động Toàn Bộ Hệ Thống Với 1 Lệnh Duy Nhất

Tại thư mục `AI-Calorie-Meal-Tracker` trên EC2, chạy lệnh:
```bash
docker compose up -d --build
```

Docker sẽ tự động:
1. Kéo image `postgres:16-alpine` và khởi tạo cơ sở dữ liệu.
2. Build `backend/Dockerfile` với multi-stage Eclipse Temurin 17 JRE.
3. Build `web-dashboard/Dockerfile` với Nginx và React Vite.
4. Tự động kết nối 3 service qua mạng nội bộ Docker an toàn.

Kiểm tra trạng thái các container:
```bash
docker compose ps
```
Nếu cả 3 container (`nutriai-postgres`, `nutriai-backend`, `nutriai-web`) đều có trạng thái `Up` là bạn đã thành công!

---

### Bước 6: Mở Cổng 8080 Trong AWS Security Group Để Gọi API
1. Trên giao diện AWS EC2 Console ➔ Chọn Instance của bạn ➔ Tab **Security** ➔ Bấm vào tên **Security Group**.
2. Chọn **Edit inbound rules** ➔ Bấm **Add rule**:
   * **Type:** Custom TCP
   * **Port range:** `8080`
   * **Source:** `Anywhere-IPv4` (`0.0.0.0/0`)
3. Bấm **Save rules**.

---

### 🎉 Hoàn Tất! Đường Dẫn Truy Cập Hệ Thống:
* **Giao diện Web Dashboard:** `http://<PUBLIC_IP_CUA_EC2>/`
* **Swagger UI API Docs:** `http://<PUBLIC_IP_CUA_EC2>:8080/swagger-ui.html`
* **Tài khoản Demo khởi tạo sẵn:** `demo@nutriai.vn` / Mật khẩu: `123456`

---

## 🔒 2. Quy Tắc Bảo Mật "Zero-Leak" Tuyệt Đối Khi Làm Việc Với AWS

1. **Tuyệt đối KHÔNG DÙNG tài khoản Root AWS để tạo Access Key:** Luôn tạo IAM User riêng biệt chỉ có quyền S3.
2. **Khóa bảo vệ Budget Alert (Tránh bị tính tiền oan):**
   * Vào AWS Console ➔ Tìm dịch vụ **AWS Budgets** ➔ Tạo budget cảnh báo nếu chi phí hàng tháng vượt quá `$1.00 USD`. AWS sẽ gửi email ngay nếu có dịch vụ nào phát sinh cước.
3. **Cập nhật mã nguồn khi có tính năng mới:**
   Mỗi khi bạn commit code mới lên GitHub, bạn chỉ cần vào lại EC2 và chạy 2 lệnh sau:
   ```bash
   git pull origin develop
   docker compose up -d --build
   ```
