### 📱 Song Phương Mobile - Front-end Client
Một ứng dụng Single Page Application (SPA) hiện đại, tập trung vào trải nghiệm người dùng (UX) mượt mà cho việc quản lý khách hàng và mua sắm thiết bị di động.

🌟 Tổng quan dự án
Đây là nền tảng Front-end thuần túy được tối ưu hóa cho tốc độ và khả năng phản hồi. Dự án sử dụng mô hình Modular JavaScript giúp quản lý logic UI tách biệt với dữ liệu.

Kiến trúc: SPA (Single Page Application) không cần reload trang.

Phong cách: Mobile-first, Responsive hoàn toàn trên mọi thiết bị.

Dữ liệu: Tích hợp API linh hoạt với chế độ Mock Data thông minh khi phát triển local.

🚀 Hướng dẫn khởi chạy nhanh
Vì đây là dự án Front-end, bạn chỉ cần một trình duyệt hiện đại.

1. Cài đặt
Bash
git clone <repository-url>
cd SP-MOBILE-APP
2. Chạy ứng dụng
Bạn có thể sử dụng bất kỳ công cụ Static Server nào:

VS Code: Chuột phải vào index.html -> Open with Live Server.

Node.js: npx serve .

Python: python -m http.server 8080

3. Đăng nhập (Chế độ Test)
Khi chạy trên localhost, hệ thống tự động kích hoạt chế độ Mock Auth:

Username: user | Password: 123456

🛠️ Stack Công nghệ & Cấu trúc
Core Front-end
HTML5/CSS3: Sử dụng Flexbox/Grid cho layout.

Vanilla JS (ES6+): Module hóa toàn bộ logic (không phụ thuộc framework nặng nề).

API Client: Xử lý bất đồng bộ (Async/Await) với cơ chế tự động chuyển đổi môi trường.

Cấu trúc thư mục Client-side
Plaintext
SP-MOBILE-APP/
├── index.html          # Entry point duy nhất (SPA container)
├── css/                # Hệ thống Design System & Layout
├── js/                 
│   ├── app.js          # Khởi tạo ứng dụng & Routing chính
│   ├── ui-helpers.js   # Render linh kiện UI (Table, Modal, Toast)
│   ├── api-client.js   # Lớp giao tiếp với Server/Mock Data
│   └── config.js       # Cấu hình UI & Endpoint
├── pages/              # View-level components cho từng tính năng
└── icons/              # Tài nguyên hình ảnh & SVG
✨ Tính năng Front-end nổi bật
⚡ Smart Rendering: Render danh mục gần 10,000 sản phẩm mà không gây lag nhờ kỹ thuật tối ưu hóa DOM.

🌓 Auto Environment Switch: Tự động nhận diện môi trường:

Localhost: Bật Mock Data để Dev nhanh không cần Backend.

Production: Kết nối thẳng tới API thật.

🛒 Cart Engine: Quản lý giỏ hàng phía Client (LocalStorage) đồng bộ thời gian thực.

🔍 Advanced Filtering: Bộ lọc sản phẩm thông minh (Search, Category, Price) xử lý ngay trên UI.

🛡️ Warranty Lookup: Giao diện tra cứu bảo hành thân thiện.
