
Update 19h19 01.05.2025

# Song Phương Mobile App


Dự án ứng dụng di động cho Song Phương, chuyên bán máy tính, laptop và linh kiện chính hãng. Ứng dụng tích hợp tính năng xây dựng cấu hình PC (Build PC) và tối ưu hóa trải nghiệm trên thiết bị di động.

## 🛠 Tính năng Chính

### 1. Giao diện Song Phương Mobile (Home)
- **Banner Slider Auto:** Banner chạy tự động với hiệu ứng mượt mà.
- **Danh mục Sản phẩm Sticky:** Thanh điều hướng danh mục dính ở đầu trang cho phép truy cập nhanh.
- **Masonry Layout:** Hiển thị sản phẩm dạng lưới 2 cột ngẫu nhiên (Waterfall) tối ưu không gian hiển thị.
- **Sidebar thông minh:**
  - Sidebar dạng trượt từ trái sang, chiếm 60% màn hình.
  - **Scroll Lock:** Khóa cuộn trang chính khi mở sidebar, chỉ cho phép cuộn nội dung trong sidebar.
  - Overlay đóng sidebar khi chạm ra ngoài.

### 2. Xây dựng Cấu hình PC (Build PC)
- **Tích hợp Native:** Giao diện Build PC được port từ web chính sang mobile view.
- **Modal Component Picker:** Hệ thống modal chọn linh kiện (CPU, RAM, VGA...) tối ưu cho cảm ứng.
- **Validation:** Hệ thống kiểm tra tương thích cơ bản giữa các linh kiện.

### 3. Tối ưu hóa Native App
- **Portrait Lock:**
  - Sử dụng API `screen.orientation.lock` để khóa cứng chiều dọc trên thiết bị hỗ trợ.
  - Meta tags `mobile-web-app-capable` cho iOS/Android.
  - **CSS Fallback:** Màn hình khóa màu xanh (Blue Screen) khi người dùng cố tình xoay ngang điện thoại trên trình duyệt web, bắt buộc quay lại chiều dọc.

## 📂 Cấu trúc Dự án

- **index.html:** File cấu trúc chính, tích hợp cả view Home và Build PC.
- **css/**
  - `home-style.css`: Style chủ đạo cho giao diện mobile mới, masonry layout, sidebar.
  - `buildpc.css`: Style port từ module Build PC gốc.
  - `style.css`: Các style cơ bản của Ionic.
- **js/**
  - `app.js`: Logic chính (Sidebar, Scroll Lock, Orientation Lock).
  - `buildpc.js`: Logic xử lý chọn linh kiện và tính toán giá.
  - `buildpc-config.js`: Cấu hình danh mục và API sản phẩm.

## 🚀 Hướng dẫn Cài đặt & Chạy

1. Mở folder dự án trong VS Code.
2. Dùng Live Server để chạy `index.html`.
3. Để build ra file APK/IPA, sử dụng Capacitor hoặc Cordova với thư mục `www` là thư mục gốc.

## 📱 Lưu ý Phát triển
- Ứng dụng được thiết kế khóa cứng ở chế độ **Portrait**.
- Luôn giữ cấu trúc file `home-style.css` ở cuối `index.html` để override style của Bootstrap.
