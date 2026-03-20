# MH36 TRAVEL Platform

Hệ thống đặt tour du lịch cao cấp, hỗ trợ 6 luồng chức năng chính: Landing Page, Tìm kiếm Tour, Chi tiết Tour (Checkout), Customer Dashboard, Admin Dashboard và Tích hợp công cụ tự động (AI Chatbot, Nhắc nhở qua Edge Functions, Google Calendar).

## 🔥 Tính năng vượt trội

- **Giao diện hiện đại (UI/UX)**: Được thiết kế chuyên nghiệp với Tailwind & shadcn/ui. Hỗ trợ responsive đa nền tảng, thiết kế tối ưu trên Mobile và Desktop. Tích hợp PWA.
- **Hệ thống Quản lý Tour & Đặt hàng**: Luồng nghiệp vụ chi tiết. Phương thức Checkout linh hoạt với Gateway thanh toán thật (VNPay, MoMo).
- **Admin Dashboard**: Cung cấp công cụ thống kê biểu đồ doanh thu theo thời gian thực và Quản trị đơn hàng toàn diện. Có giao diện chuyên biệt cho Cấu hình API Keys cổng thanh toán nhanh chóng.
- **Tính năng AI và Nâng cao**: 
  - AI Assistant (Anthropic SDK - Claude 3.5 Sonnet) tư vấn du lịch.
  - Tự động Book Lịch vào Google Calendar bằng Service Integration.
  - Supabase Edge Functions tự động quét dữ liệu và nhắc lịch 24h trước giờ khởi hành (tích hợp Zalo ZNS / Email).

---

## 💻 Tech Stack
- Frontend: **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **shadcn/ui**, **lucide-react**.
- Backend & Database: **Supabase** (Postgres, Auth, Edge Functions).
- Background Jobs: **Supabase Edge Functions** (Deno).
- Deployment: Hỗ trợ **Vercel**.

---

## 🛠 Hướng dẫn Khởi chạy cục bộ (Local Development)

### 1. Chuẩn bị môi trường
- Đảm bảo bạn đã cài đặt Node.js 18+ và NPM.
- Một dự án/tài khoản trên `Supabase.com` để lưu trữ dữ liệu.

### 2. Thiết lập cơ sở dữ liệu (Supabase)
Ở giao diện Supabase Dashboard -> **SQL Editor**, dán toàn bộ đoạn code trong file: 
`supabase/migrations/0001_initial_schema.sql` 
để khởi tạo toàn bộ Cấu trúc Table, Relationships và Row Level Security policies.

### 3. Cài đặt các Dependency
Mở Terminal tại thư mục gốc `mh36` và chạy lệnh:
```bash
npm install
```

### 4. Cấu hình biến môi trường
Copy file `.env.example` thành file `.env.local` và điền đầy đủ các thông số thực tế của bạn:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ZALO_OA_TOKEN=...
GOOGLE_CALENDAR_API_KEY=...
AI_API_KEY=sk-... 
VNPAY_URL=...
MOMO_ACCESS_KEY=...
```

### 5. Khởi chạy Server dev
Tiến hành khởi chạy:
```bash
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000` để trải nghiệm dự án.

---

## 🚀 Hướng dẫn Deployment lên Vercel

Ứng dụng được tối ưu hóa 100% để deploy tự động lên Vercel. Hãy làm theo các bước:

1. **Chuẩn bị Repository GitHub:**
   - Commit dự án lên Github repository của riêng bạn (loại trừ node_modules và các file .env).

2. **Kết nối tới Vercel:**
   - Đăng nhập thẻ Dashboard Vercel. Chọn `Add New Project`.
   - Cấp quyền truy cập Github và import repository. 
   - Vercel sẽ tự phát hiện ra Framework Preset là **Next.js**.

3. **Cấu hình Environment Variables:**
   - Tại mục Settings > Environment Variables của Vercel (hoặc điền ngay bước import).
   - Truyền toàn bộ các khóa bảo mật được lưu trữ nội bộ vào đây, đặc biệt là `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

4. **Kích hoạt Build & Deploy:**
   - Nhấn `Deploy`. Quá trình sẽ được tự động hóa từ phân tích code đến build thành Edge functions cho các Server Actions.

5. **Cấu hình Domain Custom & SSL (Tùy chọn):**
   - Truy cập **Settings > Domains** trong Vercel.
   - Nhập domain mới (VD: `mh36-platform.com`).
   - Vào trình quản lý DNS Domain (VD: Cloudflare), trỏ bản ghi A về địa chỉ IP do Vercel cung cấp (VD: 76.76.21.21).
   - Vercel tích hợp sẵn dịch vụ tự động nâng cấp chứng chỉ SSL HTTPS Miễn phí Let's Encrypt.
