# 🛒 Song Phương Mobile App

Ứng dụng di động cho **Song Phương** - Chuyên bán máy tính, laptop, linh kiện chính hãng với hơn **9,926 sản phẩm**. Ứng dụng tích hợp hệ thống danh mục phân cấp, công cụ xây dựng PC (Build PC) và tối ưu hóa trải nghiệm trên thiết bị di động.

**Cập nhật lần cuối:** 2026-01-07

## ✨ Tính năng Chính

### 1. 📊 Hệ Thống Danh Mục Phân Cấp (3 Cấp)
- **15+ Danh Mục Chính** với đầy đủ biểu tượng:
  - PC Song Phương
  - Máy Tính Trọn Bộ
  - Laptop - Máy Tính Xách Tay
  - Linh Kiện Máy Tính
  - Tản Nhiệt - Cooling
  - Màn Hình Máy Tính
  - Phụ Kiện PC-Laptop-Mobile
  - Gaming Gear-Phím-Chuột
  - Camera An Ninh
  - Thiết Bị Âm Thanh, Mạng Lan-Wifi
  - Dịch Vụ PC-Laptop
  - Phần Mềm Bản Quyền
  - v.v.

- **Sidebar Dropdown Tương Tác:**
  - Click mũi tên (→) để mở/đóng danh mục con cấp 1
  - Hỗ trợ danh mục con cấp 2 lên tới 3 cấp
  - Animation mượt mà với max-height transition (0.3s)
  - Mũi tên tự động xoay 90° khi mở
  - Tự động đóng submenu khác khi mở submenu mới

- **Navigation Nhanh Dưới Banner:**
  - 8 danh mục phổ biến hiển thị ngay dưới banner
  - Scroll ngang để xem thêm danh mục
  - Tương tác nhanh để lọc sản phẩm

### 2. 🎨 Giao Diện Home Tối ưu
- **Banner Slider Auto:** 
  - Tự động chuyển ảnh sau 5 giây
  - Chạm để chuyển slide
  - Các chấm (dots) chỉ báo vị trí hiện tại
  
- **Hiển thị Sản phẩm:**
  - Masonry layout 2 cột
  - Waterfall scroll infinite tự động tải thêm
  - 9,926 sản phẩm từ database ProductManager
  - Giá, rating, và trạng thái stock rõ ràng

- **Sticky Product Category Navigation:**
  - Danh mục "Tất cả" và "SALE" cố định
  - Các danh mục chính tổng hợp từ sidebar
  - Nhấp vào để lọc sản phẩm ngay

### 3. 🛠️ Xây dựng Cấu hình PC (Build PC)
- **Giao diện tương tác cao:**
  - Chọn linh kiện qua modal picker
  - Hỗ trợ 3 cấu hình khác nhau
  - Tính tổng giá tự động
  - Hiển thị chi tiết cấu hình

- **Danh mục linh kiện đầy đủ:**
  - CPU, Mainboard, RAM, SSD/HDD
  - VGA, PSU, Case, Cooling
  - Các linh kiện khác

### 4. 👤 Quản lý Hồ Sơ & Tài khoản
- Đăng nhập/Đăng ký
- Chỉnh sửa thông tin cá nhân
- Quản lý địa chỉ giao hàng
- Lịch sử mua hàng

### 5. 🔔 Thông Báo & Cài đặt
- Hệ thống thông báo theo thời gian thực
- Tùy chỉnh độ sáng, font size
- Cài đặt chung

## 📂 Cấu Trúc Dự Án

```
SP-MOBILE-APP/
├── index.html                          # File HTML chính
├── README.md                           # Tài liệu này
├── CATEGORIES_INTEGRATION.md           # Hướng dẫn tích hợp danh mục (mới)
├── ionic.config.json                   # Cấu hình Ionic
├── package.json                        # Dependencies
│
├── css/
│   ├── style.css                       # Style cơ bản Ionic
│   ├── home-style.css                  # Style giao diện home + banner
│   ├── buildpc.css                     # Style Build PC
│   ├── header-menu.css                 # Style header
│   ├── profile-style.css               # Style profile
│   ├── settings-modal.css              # Style settings
│   ├── notifications-style.css         # Style notifications
│   ├── footer.css                      # Style footer
│   ├── product-details.css             # Style chi tiết sản phẩm
│   ├── bootstrap.min.css               # Bootstrap framework
│   └── ionic.min.css                   # Ionic CSS
│
├── js/
│   ├── app.js                          # Logic chính (sidebar, navigation, categories)
│   ├── categories-data.js              # 📌 Dữ liệu danh mục (mới)
│   ├── product-manager.js              # Quản lý database 9,926 sản phẩm
│   ├── product-details.js              # Logic chi tiết sản phẩm
│   ├── product-details-data.js         # Dữ liệu bổ sung sản phẩm
│   ├── products-data.js                # Database sản phẩm
│   ├── buildpc.js                      # Logic Build PC
│   ├── buildpc-config.js               # Cấu hình Build PC
│   ├── jquery.min.js                   # jQuery library
│   ├── bootstrap.bundle.min.js         # Bootstrap JS
│   │
│   └── product-details/                # Chi tiết sản phẩm (chunk files)
│       ├── details-000.js
│       ├── details-001.js
│       └── ... (tới details-xxx.js)
│
├── pages/
│   ├── product-details.html            # Trang chi tiết sản phẩm
│   ├── profile.html                    # Trang hồ sơ
│   ├── build-pc.html                   # Trang Build PC
│   └── warranty.html                   # Trang bảo hành
│
├── scripts/
│   └── build-details.js                # Script tạo chi tiết sản phẩm
│
├── icons/
│   ├── songphuong-logo.png
│   ├── cart-icon.png
│   └── ... (các icon khác)
│
└── database-product/
    ├── products.json                   # Database sản phẩm (50MB+)
    ├── products-lite.json              # Phiên bản nhẹ
    ├── products-details.json           # Chi tiết sản phẩm
    └── product-datat.csv              # Dữ liệu CSV gốc
```

## 🚀 Hướng dẫn Cài đặt & Chạy

### Yêu cầu
- Modern browser (Chrome, Firefox, Safari, Edge)
- HTTP server (Live Server, Python, Node.js)
- VS Code (tùy chọn)

### Chạy Ứng dụng

**Cách 1: Dùng Live Server (VS Code)**
1. Cài đặt extension "Live Server"
2. Click chuột phải vào `index.html` → "Open with Live Server"
3. Trình duyệt sẽ mở tự động tại `http://localhost:5500`

**Cách 2: Dùng Python**
```bash
cd "Nhóm 11 - Quản Lý Khách Hàng\SP-MOBILE-APP"
# Python 3.x
python -m http.server 8000
# Truy cập http://localhost:8000
```

**Cách 3: Dùng Node.js**
```bash
npx http-server
```

### Build APK/IPA (Ionic)
```bash
# Cài đặt Ionic CLI
npm install -g @ionic/cli

# Cài dependencies
npm install

# Build cho Android
ionic build --prod
ionic cap add android
ionic cap build android

# Build cho iOS
ionic build --prod
ionic cap add ios
ionic cap build ios
```

## 📖 Hướng dẫn Sử dụng

### Sidebar Danh Mục
1. Click **icon menu (☰)** ở footer để mở sidebar
2. Click vào **mũi tên (→)** bên cạnh tên danh mục để xem danh mục con
3. Click vào **tên danh mục** để lọc sản phẩm
4. Click ngoài sidebar hoặc overlay để đóng

### Build PC
1. Click tab **"Build PC"** ở footer
2. Chọn linh kiện từ modal picker
3. Xem giá tổng tự động cập nhật
4. Lưu hoặc chia sẻ cấu hình

### Chi tiết Sản phẩm
1. Click vào sản phẩm trong danh sách
2. Xem mô tả, giá, rating, hình ảnh
3. Thêm vào giỏ hoặc lưu yêu thích

## 🔧 Cấu Hình & Tùy chỉnh

### Thay đổi Danh Mục
1. Mở `js/categories-data.js`
2. Sửa mảng `CATEGORIES`
3. Thêm/xóa danh mục theo cấu trúc
4. Reload trang để thấy thay đổi

### Thêm Biểu tượng Mới
Sử dụng Ionicons (có sẵn):
```javascript
icon: 'icon ion-grid'  // Danh lưới
icon: 'icon ion-list'  // Danh sách
icon: 'icon ion-settings'  // Cài đặt
icon: 'icon ion-home'  // Nhà
```

Hoặc Font Awesome:
```javascript
icon: 'fas fa-laptop'
icon: 'fas fa-keyboard'
```

## 📊 Dữ Liệu & Database

- **Database:** 9,926 sản phẩm từ CSV gốc
- **Danh mục:** 15+ danh mục chính, 47+ danh mục con cấp 1, 200+ danh mục con cấp 2
- **Tối ưu hóa:** Chunk files cho chi tiết sản phẩm (lazy load)
- **Format:** JSON + CSV + Chunk JS

## 🎯 Tính năng Sắp Tới

- [ ] Tích hợp API backend thực
- [ ] Đăng nhập OAuth (Facebook, Google)
- [ ] Giỏ hàng & Checkout
- [ ] Thanh toán trực tuyến
- [ ] Theo dõi đơn hàng
- [ ] Chat với customer support
- [ ] AR Preview sản phẩm

## 🛡️ Bảo Mật

- HTTPS cho production
- Input validation trên client + server
- CSRF protection
- XSS prevention
- Rate limiting trên API

## 📱 Responsive Design

- **Mobile:** 320px - 480px (tối ưu)
- **Tablet:** 480px - 1024px
- **Desktop:** 1024px+ (full features)

Ứng dụng được thiết kế **Portrait Lock** - khóa cứng chiều dọc trên thiết bị di động.

## 🤝 Đóng Góp

1. Fork repository
2. Tạo branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Copyright © 2026 Song Phương. All rights reserved.

## 👥 Team

- **Development:** GitHub Copilot
- **Product Management:** Nhóm 11
- **University:** UNG (University of New Generation)

## 📞 Liên Hệ & Support

- **Website:** https://songphuong.vn
- **Email:** support@songphuong.vn
- **Phone:** [Liên hệ qua website]

---

**Last Updated:** 2026-01-07  
**Version:** 2.0 (Categories Integration)  
**Status:** 🟢 In Development

- Luôn giữ cấu trúc file `home-style.css` ở cuối `index.html` để override style của Bootstrap.
