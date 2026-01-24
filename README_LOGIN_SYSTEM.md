# Song Phuong Mobile App - Login System với MongoDB

## 🚀 Hướng dẫn cài đặt và sử dụng

### Bước 1: Cài đặt MongoDB

#### Option 1: MongoDB Local
1. Download và cài đặt MongoDB Community Server từ: https://www.mongodb.com/try/download/community
2. Khởi động MongoDB service
3. MongoDB sẽ chạy ở `mongodb://localhost:27017`

#### Option 2: MongoDB Atlas (Cloud - Recommended)
1. Tạo tài khoản miễn phí tại: https://www.mongodb.com/cloud/atlas
2. Tạo cluster mới (Free tier)
3. Tạo database user
4. Whitelist IP address: `0.0.0.0/0` (cho phép tất cả)
5. Lấy connection string

### Bước 2: Setup Backend Server

1. **Di chuyển vào thư mục server:**
```bash
cd server
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file .env từ .env.example:**
```bash
copy .env.example .env
```

4. **Cấu hình .env file:**
```env
PORT=5000
NODE_ENV=development

# MongoDB - Chọn 1 trong 2:
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/songphuong_db

# Hoặc MongoDB Atlas (recommended):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/songphuong_db

# JWT Secret - Thay đổi thành chuỗi ngẫu nhiên mạnh
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_EXPIRE=7d

# CORS - URL của frontend
CORS_ORIGIN=http://localhost:8000
```

5. **Khởi động server:**

Development mode (auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server sẽ chạy tại `http://localhost:5000`

### Bước 3: Tích hợp Frontend

1. **Thêm scripts vào index.html** (trước tag `</body>`):
```html
<!-- API Client -->
<script src="js/api-client.js"></script>
<!-- Auth Module -->
<script src="js/auth-module.js"></script>
<!-- Auth CSS -->
<link rel="stylesheet" href="css/auth-modal.css">
```

2. **Thêm nút đăng nhập vào header** (trong file `index.html`):
```html
<!-- Trong header-container, thêm sau search hoặc cart -->
<button class="login-button-header" onclick="authModule.showLoginModal()">
    <i class="icon ion-person"></i>
    <span id="userNameDisplay">Đăng nhập</span>
</button>
```

### Bước 4: Test hệ thống

1. **Health check server:**
```
GET http://localhost:5000/api/health
```

2. **Đăng ký tài khoản mới:**
- Mở app
- Click nút "Đăng nhập"
- Chuyển sang tab "Đăng ký"
- Điền thông tin và submit

3. **Đăng nhập:**
- Click "Đăng nhập"
- Nhập email và password
- Submit

## 📚 API Endpoints

### Authentication
```
POST /api/auth/register     - Đăng ký tài khoản mới
POST /api/auth/login        - Đăng nhập
GET  /api/auth/me           - Lấy thông tin user hiện tại (cần token)
PUT  /api/auth/updateprofile - Cập nhật profile (cần token)
PUT  /api/auth/updatepassword - Đổi mật khẩu (cần token)
GET  /api/auth/logout       - Đăng xuất (cần token)
```

### Orders
```
GET  /api/orders            - Lấy danh sách đơn hàng (cần token)
POST /api/orders            - Tạo đơn hàng mới (cần token)
GET  /api/orders/:id        - Chi tiết đơn hàng (cần token)
PUT  /api/orders/:id        - Cập nhật đơn hàng (admin only)
PUT  /api/orders/:id/cancel - Hủy đơn hàng (cần token)
```

## 🔐 Authentication Flow

1. User đăng ký/đăng nhập
2. Server trả về JWT token
3. Token được lưu trong localStorage
4. Mọi request sau đó gửi token trong header: `Authorization: Bearer <token>`
5. Server verify token và trả về dữ liệu

## 💾 Database Schema

### User Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  fullName: String,
  phone: String,
  address: String,
  birthday: Date,
  avatar: String,
  memberTier: String, // Đồng, Bạc, Vàng, Bạch Kim, Kim Cương
  totalSpending: Number,
  loyaltyPoints: Number,
  isActive: Boolean,
  isVerified: Boolean,
  role: String, // user, admin
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```javascript
{
  user: ObjectId (ref User),
  orderNumber: String, // Auto-generated: SP20260124001
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  discount: Number,
  total: Number,
  shippingAddress: { ... },
  paymentMethod: String,
  paymentStatus: String,
  status: String, // pending, confirmed, processing, shipping, delivered, cancelled
  trackingNumber: String,
  pointsEarned: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Frontend Integration

### Kiểm tra user đã login:
```javascript
if (api.isAuthenticated()) {
    // User đã đăng nhập
    const user = api.getUserFromToken();
    console.log(user);
} else {
    // User chưa đăng nhập
    authModule.showLoginModal();
}
```

### Tạo đơn hàng:
```javascript
const orderData = {
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
    tax: 0,
    shipping: 50000,
    discount: 0,
    total: 15050000,
    shippingAddress: {
        fullName: "Nguyễn Văn A",
        phone: "0912345678",
        address: "123 Nguyễn Văn Linh",
        city: "TP.HCM"
    },
    paymentMethod: "cod"
};

try {
    const result = await api.createOrder(orderData);
    console.log('Order created:', result);
} catch (error) {
    console.error('Error:', error);
}
```

## 🔧 Troubleshooting

### Lỗi kết nối MongoDB:
- Kiểm tra MongoDB service đang chạy
- Kiểm tra MONGODB_URI trong .env
- Nếu dùng Atlas, kiểm tra IP whitelist

### Lỗi CORS:
- Kiểm tra CORS_ORIGIN trong .env
- Đảm bảo frontend chạy đúng port

### Token không hoạt động:
- Kiểm tra JWT_SECRET trong .env
- Clear localStorage và đăng nhập lại
- Kiểm tra token format trong header

## 📝 Next Steps

1. **Tích hợp giỏ hàng với database:**
   - Chuyển từ localStorage sang API
   - Sync cart khi user login

2. **Thêm tính năng:**
   - Reset password
   - Email verification
   - Social login (Facebook, Google)
   - Admin dashboard

3. **Deploy:**
   - Deploy backend lên Heroku/Railway/Render
   - Deploy frontend lên Vercel
   - Cấu hình CORS và URLs

## 💡 Tips

- **Development**: Sử dụng `npm run dev` cho hot-reload
- **Security**: Đổi JWT_SECRET trước khi deploy
- **Database**: Backup database định kỳ
- **Testing**: Test tất cả endpoints trước khi deploy

## 📞 Support

Nếu gặp vấn đề, check:
1. Server logs trong terminal
2. Browser console (F12)
3. Network tab để xem API requests/responses
4. MongoDB logs
