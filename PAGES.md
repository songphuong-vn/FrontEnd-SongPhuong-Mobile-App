# Hướng dẫn tạo Pages độc lập

## Cấu trúc Pages

Mỗi page trong thư mục `pages/` có thể hoạt động **độc lập** với:
- ✅ Layout đầy đủ (header, back button)
- ✅ CSS riêng
- ✅ JavaScript logic riêng
- ✅ Tích hợp API client
- ✅ Toast notifications

## Cách tạo Page mới

### Option 1: Dùng Generator Script (Khuyến nghị)

```powershell
.\generate-page.ps1 -PageName "orders" -PageTitle "Đơn hàng của tôi"
```

Script sẽ tự động:
1. Tạo `pages/orders.html` từ template
2. Hướng dẫn tạo `css/orders-style.css`
3. Hướng dẫn tạo `js/orders-loader.js`

### Option 2: Tạo thủ công

1. **Copy template**:
   ```bash
   cp pages/_template.html pages/your-page.html
   ```

2. **Thay thế placeholders**:
   - `{{PAGE_TITLE}}` → Tiêu đề trang
   - `{{PAGE_STYLE}}` → Tên file CSS (vd: `your-page-style`)
   - `{{PAGE_HEADER}}` → Header hiển thị
   - `{{CONTENT_ID}}` → ID của content container
   - `{{PAGE_LOADER}}` → Tên file JS loader
   - `{{INIT_FUNCTION}}` → Tên hàm khởi tạo

3. **Tạo CSS** (`css/your-page-style.css`):
   ```css
   .your-page {
       /* Styles */
   }
   ```

4. **Tạo JS Loader** (`js/your-page-loader.js`):
   ```javascript
   async function loadYourPageContent() {
       const container = document.getElementById('your-page-content-placeholder');
       
       // Check authentication if needed
       if (!api || !api.isAuthenticated()) {
           container.innerHTML = '<div>Vui lòng đăng nhập</div>';
           return;
       }
       
       try {
           // Fetch data from API
           const res = await api.request('/your-endpoint');
           
           // Render content
           container.innerHTML = `<div>${res.data}</div>`;
       } catch (error) {
           console.error(error);
           showNotification('Lỗi tải dữ liệu', 'error');
       }
   }
   ```

## Ví dụ: Trang Warranty

### File: `pages/warranty.html`
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <link rel="stylesheet" href="../css/warranty-style.css">
    <script src="../js/warranty-loader.js"></script>
</head>
<body>
    <div id="warranty-content-placeholder"></div>
    <script>
        loadWarrantyContent();
    </script>
</body>
</html>
```

### File: `js/warranty-loader.js`
```javascript
async function loadWarrantyContent() {
    // Check auth
    if (!api.isAuthenticated()) {
        // Show login prompt
        return;
    }
    
    // Fetch warranty data
    const res = await api.request('/warranty/products');
    
    // Render
    renderWarrantyPage(res.data);
}
```

## Routing với Vercel

File `vercel.json` đã cấu hình:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Lưu ý**: Nếu bạn muốn pages hoạt động độc lập (không qua SPA), cần cập nhật:

```json
{
  "rewrites": [
    { "source": "/pages/(.*)", "destination": "/pages/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Checklist khi tạo Page mới

- [ ] Tạo file HTML từ template
- [ ] Tạo file CSS riêng
- [ ] Tạo file JS loader với hàm init
- [ ] Test authentication flow
- [ ] Test API calls
- [ ] Test responsive design
- [ ] Test back button
- [ ] Update vercel.json nếu cần

## Best Practices

1. **Luôn kiểm tra authentication** trước khi load data
2. **Hiển thị loading state** khi fetch API
3. **Handle errors** rõ ràng với toast notifications
4. **Responsive design** cho mobile
5. **Consistent styling** với design system chung

## Troubleshooting

### Page không load được CSS/JS
- Kiểm tra đường dẫn relative (`../css/`, `../js/`)
- Đảm bảo file tồn tại

### API calls bị lỗi CORS
- Kiểm tra backend CORS config
- Đảm bảo API_BASE_URL đúng trong `api-client.js`

### Back button không hoạt động
- Kiểm tra `goBack()` function
- Test với `window.history.length`
