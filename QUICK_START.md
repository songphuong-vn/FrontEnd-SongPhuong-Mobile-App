# Song Phương Login System - Hướng dẫn nhanh

## 🚀 Bắt đầu nhanh

### Bước 1: Chuẩn bị

1. **Cài đặt Node.js** (nếu chưa có):
   - Download từ: https://nodejs.org/
   - Chọn phiên bản LTS
   - Verify: `node --version` và `npm --version`

2. **Cài đặt MongoDB**:
   
   **Option A: MongoDB Local**
   - Download từ: https://www.mongodb.com/try/download/community
   - Cài đặt và khởi động service
   
   **Option B: MongoDB Atlas (Khuyến nghị)** ⭐
   - Tạo tài khoản miễn phí tại: https://www.mongodb.com/cloud/atlas
   - Tạo cluster mới (Free M0)
   - Tạo database user
   - Whitelist IP: `0.0.0.0/0`
   - Copy connection string

### Bước 2: Khởi chạy Server

**Cách 1: Dùng script tự động (Windows)** ⭐
```bash
# Double-click file start-server.bat
# Hoặc chạy từ terminal:
start-server.bat
```

**Cách 2: Thủ công**
```bash
# 1. Vào thư mục server
cd server

# 2. Install dependencies
npm install

# 3. Tạo file .env
copy .env.example .env

# 4. Chỉnh sửa .env (xem bên dưới)

# 5. Khởi động server
npm run dev
```

### Bước 3: Cấu hình .env

Mở file `server/.env` và cấu hình:

```env
# Port server
PORT=5000

# MongoDB - Chọn 1 trong 2:

# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/songphuong_db

# MongoDB Atlas (thay your-connection-string):
# MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/songphuong_db

# JWT Secret - TẠO CHUỖI NGẪU NHIÊN MẠNH
JWT_SECRET=thay_chuoi_nay_thanh_secret_manh_random_string_32_ky_tu

# Frontend URL
CORS_ORIGIN=http://localhost:8000
```

💡 **Tip**: Tạo JWT_SECRET ngẫu nhiên:
```bash
# Windows PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# Hoặc online: https://randomkeygen.com/
```

### Bước 4: Khởi chạy Frontend

```bash
# Từ thư mục gốc dự án
npm run serve
# Hoặc:
npx http-server -p 8000 -c-1
```

Frontend sẽ chạy tại: `http://localhost:8000`

### Bước 5: Test

1. Mở trình duyệt: `http://localhost:8000`
2. Click nút "Đăng nhập" ở header
3. Chuyển sang tab "Đăng ký"
4. Đăng ký tài khoản mới
5. Đăng nhập

## ✅ Kiểm tra Server

### Health Check
```bash
# Mở trong browser hoặc curl:
http://localhost:5000/api/health
```

Response thành công:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-24T12:00:00.000Z"
}
```

### Test MongoDB Connection
- Check terminal log khi start server
- Tìm dòng: `✅ MongoDB Connected: ...`

## 🎯 Tính năng

### Đã hoàn thành ✅
- ✅ Backend API với Express + MongoDB
- ✅ User authentication (JWT)
- ✅ Đăng ký / Đăng nhập
- ✅ Profile management
- ✅ Password hashing (bcrypt)
- ✅ Member tier system (Đồng → Kim Cương)
- ✅ Order management
- ✅ Security (Helmet, CORS, Rate limiting)
- ✅ Beautiful login/register UI
- ✅ Responsive design

### Có thể mở rộng 🚀
- Email verification
- Forgot password
- Social login (Facebook, Google)
- Admin dashboard
- Real-time notifications
- Export orders
- Payment integration

## 📱 Sử dụng API

### Đăng ký
```javascript
const response = await api.register({
    fullName: "Nguyễn Văn A",
    username: "nguyenvana",
    email: "user@example.com",
    phone: "0912345678",
    password: "password123"
});
```

### Đăng nhập
```javascript
const response = await api.login({
    email: "user@example.com",
    password: "password123"
});
```

### Lấy thông tin user
```javascript
const response = await api.getMe();
console.log(response.data);
```

### Tạo đơn hàng
```javascript
const order = await api.createOrder({
    items: [
        {
            productId: "123",
            productName: "VGA RTX 4070",
            quantity: 1,
            price: 15000000,
            subtotal: 15000000
        }
    ],
    subtotal: 15000000,
    total: 15050000,
    shippingAddress: { ... }
});
```

## 🐛 Troubleshooting

### Server không start được
```bash
# Kiểm tra port 5000 có bị chiếm:
netstat -ano | findstr :5000

# Kill process nếu cần (thay PID):
taskkill /PID <pid> /F
```

### MongoDB connection error
1. Kiểm tra MongoDB service đang chạy
2. Kiểm tra MONGODB_URI trong .env
3. Nếu dùng Atlas: Check IP whitelist và credentials

### CORS error
- Kiểm tra CORS_ORIGIN trong .env khớp với URL frontend
- Check browser console để xem chi tiết lỗi

### Token invalid
- Clear localStorage trong browser (F12 → Application → Local Storage)
- Đăng nhập lại

## 📖 API Documentation

Xem file **README_LOGIN_SYSTEM.md** để biết:
- Chi tiết tất cả endpoints
- Request/Response examples
- Database schema
- Authentication flow
- Deployment guide

## 🎨 Customization

### Thay đổi member tiers
Edit `server/models/User.js` → method `updateMemberTier()`

### Thay đổi JWT expiration
Edit `server/.env` → `JWT_EXPIRE=30d`

### Thay đổi UI colors
Edit `css/auth-modal.css` → search for `#e60000` (red color)

## 🔒 Security Notes

⚠️ **QUAN TRỌNG**:
1. **Không commit file `.env`** vào Git
2. **Thay đổi JWT_SECRET** trước khi deploy
3. **Sử dụng HTTPS** khi deploy production
4. **Không lưu passwords** trong code
5. **Enable MongoDB authentication** trong production

## 📞 Support

Nếu gặp vấn đề:
1. Check server logs trong terminal
2. Check browser console (F12)
3. Xem Network tab để debug API calls
4. Đọc lại README_LOGIN_SYSTEM.md

---

**Chúc bạn code vui vẻ! 🚀**
