# 🔄 Hướng dẫn Đồng bộ Localhost ↔ Deploy

## ✅ Đã thực hiện

### 1. **Tạo Config System**
- ✅ File `js/config.js` - Auto-detect environment
- ✅ Tự động chọn API URL dựa trên hostname
- ✅ Debug mode tự động bật ở localhost

### 2. **Cập nhật API Client**
- ✅ Dùng `APP_CONFIG.API_BASE_URL` thay vì hardcode
- ✅ Fallback an toàn nếu config chưa load
- ✅ Log API URL trong development mode

### 3. **Cập nhật index.html**
- ✅ Load `config.js` TRƯỚC `api-client.js`
- ✅ Đảm bảo thứ tự load đúng

### 4. **Tạo Template mới**
- ✅ `pages/_template-new.html` với absolute paths
- ✅ Dùng `/css/` thay vì `../css/`
- ✅ Dùng `/js/` thay vì `../js/`

---

## 🚀 Cách sử dụng

### Bước 1: Cập nhật Production API URL

Mở file `js/config.js` và sửa:

```javascript
// Line 23-29
if (IS_LOCALHOST) {
    API_BASE_URL = 'http://localhost:5000/api';
} else {
    // TODO: Thay bằng URL backend production thật
    API_BASE_URL = 'https://your-backend-api.com/api'; // ← SỬA ĐÂY
}
```

### Bước 2: Test Localhost

```bash
# Chạy static server
npx serve -s . -p 8080

# Hoặc Python
python -m http.server 8080

# Mở browser
http://localhost:8080
```

**Kiểm tra Console**:
```
🔧 App Configuration
Environment: development
API URL: http://localhost:5000/api
Debug Mode: true
```

### Bước 3: Deploy lên Vercel

```bash
# Deploy
vercel --prod

# Hoặc push lên Git (nếu đã connect)
git add .
git commit -m "Sync localhost and deploy"
git push
```

### Bước 4: Test Deploy

Mở URL deploy và kiểm tra Console:
```
🔧 App Configuration
Environment: production (hoặc staging nếu vercel.app)
API URL: https://your-backend-api.com/api
Debug Mode: false
```

---

## 📋 Checklist Đồng bộ

### Files đã cập nhật:
- [x] `js/config.js` - Environment detection
- [x] `js/api-client.js` - Dùng APP_CONFIG
- [x] `index.html` - Load config.js trước
- [x] `pages/_template-new.html` - Absolute paths

### Files cần kiểm tra:
- [ ] `pages/warranty.html` - Cập nhật paths
- [ ] `pages/orders.html` - Cập nhật paths
- [ ] Các pages khác trong `/pages/`

### Testing:
- [ ] Test localhost:8080
- [ ] Test deploy URL
- [ ] So sánh behavior
- [ ] Kiểm tra API calls
- [ ] Kiểm tra CSS/JS load

---

## 🔍 So sánh Localhost vs Deploy

| Feature | Localhost | Deploy (Vercel) | Status |
|---------|-----------|-----------------|--------|
| API URL | `localhost:5000` | `your-backend.com` | ✅ Auto |
| Paths | Relative OK | Need absolute | ✅ Fixed |
| Debug | Enabled | Disabled | ✅ Auto |
| Cache | None | Aggressive | ⚠️ Manual |
| CORS | Same origin | Cross origin | ⚠️ Backend |

---

## 🐛 Troubleshooting

### Issue 1: API calls fail trên deploy

**Kiểm tra**:
```javascript
console.log('API URL:', api.baseURL);
```

**Fix**:
- Đảm bảo `config.js` được load
- Cập nhật production API URL trong `config.js`
- Kiểm tra backend CORS config

### Issue 2: CSS không load

**Kiểm tra**:
```javascript
// Trong Console
document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    console.log(link.href);
});
```

**Fix**:
- Dùng absolute paths: `/css/style.css`
- Không dùng relative: `../css/style.css`

### Issue 3: Config không load

**Kiểm tra**:
```javascript
console.log('APP_CONFIG:', window.APP_CONFIG);
```

**Fix**:
- Đảm bảo `config.js` được load TRƯỚC `api-client.js`
- Kiểm tra thứ tự scripts trong HTML

### Issue 4: Cache cũ trên deploy

**Fix**:
```bash
# Hard reload
Ctrl + Shift + R

# Hoặc clear cache
Ctrl + Shift + Delete
```

---

## 📝 Migration Guide

### Cập nhật Pages cũ sang Absolute Paths

**Trước** (Relative):
```html
<link rel="stylesheet" href="../css/style.css">
<script src="../js/api-client.js"></script>
```

**Sau** (Absolute):
```html
<link rel="stylesheet" href="/css/style.css">
<script src="/js/config.js"></script>
<script src="/js/api-client.js"></script>
```

### Script tự động update:

```javascript
// Run in Console to check all pages
const pages = ['warranty', 'orders'];
pages.forEach(page => {
    fetch(`/pages/${page}.html`)
        .then(r => r.text())
        .then(html => {
            if (html.includes('../css/') || html.includes('../js/')) {
                console.warn(`⚠️ ${page}.html needs update to absolute paths`);
            } else {
                console.log(`✅ ${page}.html OK`);
            }
        });
});
```

---

## 🎯 Best Practices

1. **Luôn dùng Absolute Paths** trong production
2. **Load config.js đầu tiên** trong mọi page
3. **Test trên cả localhost VÀ deploy** trước khi merge
4. **Hard reload** sau mỗi deploy để clear cache
5. **Check Console** để debug environment issues

---

## 📞 Quick Debug

```javascript
// Paste vào Console để check toàn bộ
(function debugEnvironment() {
    console.group('🔍 Environment Debug');
    console.log('Hostname:', window.location.hostname);
    console.log('Environment:', APP_CONFIG?.ENVIRONMENT || 'Config not loaded');
    console.log('API URL:', APP_CONFIG?.API_BASE_URL || 'Config not loaded');
    console.log('Debug Mode:', APP_CONFIG?.ENABLE_DEBUG || false);
    console.log('API Client:', typeof api !== 'undefined' ? api.baseURL : 'Not initialized');
    console.groupEnd();
})();
```

---

## ✅ Kết luận

Sau khi thực hiện các bước trên:
- ✅ Localhost và Deploy sẽ hoạt động GIỐNG NHAU
- ✅ Không cần sửa code khi deploy
- ✅ Tự động detect environment
- ✅ Dễ dàng debug và maintain

**Next Steps**:
1. Cập nhật production API URL trong `config.js`
2. Update các pages cũ sang absolute paths
3. Test kỹ trên cả 2 môi trường
4. Deploy và verify
