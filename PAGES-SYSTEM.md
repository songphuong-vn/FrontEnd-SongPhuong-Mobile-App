# 📦 Hệ thống Pages Độc lập - Song Phương Mobile App

## 🎯 Tổng quan

Hệ thống cho phép tạo các trang HTML **hoạt động độc lập** với đầy đủ:
- ✅ Layout responsive
- ✅ Authentication flow
- ✅ API integration
- ✅ Toast notifications
- ✅ Back navigation
- ✅ Consistent styling

## 📁 Cấu trúc thư mục

```
SP-MOBILE-APP/
├── pages/
│   ├── _template.html          # Template gốc
│   ├── warranty.html            # ✅ Trang bảo hành (hoàn thiện)
│   └── orders.html              # 📝 Ví dụ demo
├── css/
│   ├── warranty-style.css       # CSS riêng cho warranty
│   └── orders-style.css         # CSS riêng cho orders
├── js/
│   ├── api-client.js            # API client (shared)
│   ├── warranty-loader.js       # Logic load warranty
│   └── [page]-loader.js         # Logic cho các pages khác
├── generate-page.ps1            # Script tạo page tự động
├── PAGES.md                     # Hướng dẫn chi tiết
└── vercel.json                  # Routing config
```

## 🚀 Quick Start

### 1. Tạo page mới bằng Generator

```powershell
# Tạo trang "Lịch sử mua hàng"
.\generate-page.ps1 -PageName "history" -PageTitle "Lịch sử mua hàng"

# Tạo trang "Yêu thích"
.\generate-page.ps1 -PageName "favorites" -PageTitle "Sản phẩm yêu thích"
```

### 2. Hoàn thiện page

Sau khi chạy generator, bạn cần:

**a) Tạo CSS** (`css/history-style.css`):
```css
.history-page {
    max-width: 1200px;
    margin: 0 auto;
}
```

**b) Tạo JS Loader** (`js/history-loader.js`):
```javascript
async function loadHistoryContent() {
    const container = document.getElementById('history-content-placeholder');
    
    // Check auth
    if (!api || !api.isAuthenticated()) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="icon ion-locked"></i>
                <h3>Vui lòng đăng nhập</h3>
            </div>
        `;
        return;
    }
    
    try {
        // Fetch data
        const res = await api.request('/history');
        
        // Render
        container.innerHTML = renderHistory(res.data);
    } catch (error) {
        showNotification('Lỗi tải dữ liệu', 'error');
    }
}
```

### 3. Test page

```bash
# Local
http://localhost:8080/pages/history

# Production (Vercel)
https://your-app.vercel.app/pages/history
```

## 🎨 Pages đã hoàn thiện

### 1. Warranty Page (`pages/warranty.html`)

**Features**:
- ✅ Yêu cầu đăng nhập bắt buộc
- ✅ Hiển thị thông tin user
- ✅ Bảng danh sách sản phẩm bảo hành
- ✅ Status badges (Còn hạn/Sắp hết/Hết hạn)
- ✅ Loading state & Error handling

**API Endpoint**: `GET /warranty/products`

**Response format**:
```json
{
  "success": true,
  "data": [
    {
      "productName": "Laptop Dell XPS 13",
      "serialNumber": "SN123456",
      "purchaseDate": "2024-01-15T00:00:00.000Z",
      "warrantyEndDate": "2026-01-15T00:00:00.000Z"
    }
  ]
}
```

### 2. Orders Page (`pages/orders.html`)

**Status**: 📝 Demo template (chưa kết nối API)

Bạn có thể hoàn thiện bằng cách tạo `js/orders-loader.js`

## ⚙️ Cấu hình Routing

### Vercel.json

```json
{
  "rewrites": [
    {
      "source": "/pages/:page",
      "destination": "/pages/:page.html"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Cách hoạt động**:
- `/pages/warranty` → Load `pages/warranty.html` (standalone)
- `/` hoặc bất kỳ route nào khác → Load `index.html` (SPA)

## 🔧 Customization

### Thay đổi Header Color

Sửa trong file page HTML:
```css
.page-header-bar {
    background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR_2 100%);
}
```

### Thêm Custom Styles

Tạo file CSS riêng và import:
```html
<link rel="stylesheet" href="../css/your-custom-style.css">
```

### Thêm Custom Scripts

```html
<script src="../js/your-custom-script.js"></script>
```

## 📱 Responsive Design

Tất cả pages đã được tối ưu cho:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🔐 Authentication Flow

Mỗi page có thể tự quyết định:

**Option 1: Yêu cầu đăng nhập**
```javascript
if (!api.isAuthenticated()) {
    // Show login prompt
    return;
}
```

**Option 2: Cho phép xem không cần đăng nhập**
```javascript
const user = api.isAuthenticated() ? await api.getMe() : null;
// Render với hoặc không có user data
```

## 🎯 Best Practices

1. **Luôn kiểm tra auth** trước khi load sensitive data
2. **Hiển thị loading state** khi fetch API
3. **Handle errors gracefully** với toast notifications
4. **Consistent naming**: `[page]-style.css`, `[page]-loader.js`
5. **Reusable components**: Dùng chung API client, toast system

## 📚 Tài liệu liên quan

- [PAGES.md](./PAGES.md) - Hướng dẫn chi tiết
- [DEPLOY.md](./DEPLOY.md) - Hướng dẫn deploy
- [vercel.json](./vercel.json) - Routing config

## 🐛 Troubleshooting

### Page không load CSS/JS
```
Lỗi: 404 Not Found
Giải pháp: Kiểm tra đường dẫn relative (../css/, ../js/)
```

### API calls bị lỗi
```
Lỗi: CORS error
Giải pháp: Cấu hình CORS trên backend
```

### Back button không hoạt động
```
Lỗi: Không quay lại được
Giải pháp: Kiểm tra window.history.length
```

## 📞 Support

Nếu gặp vấn đề, tham khảo:
1. File PAGES.md
2. Code ví dụ trong `pages/warranty.html`
3. Template `pages/_template.html`

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-25
