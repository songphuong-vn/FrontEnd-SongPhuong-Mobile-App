# 🏗️ Cấu trúc Project - Login System

## 📁 Tổng quan thư mục

```
SP-MOBILE-APP/
├── server/                          # Backend API Server
│   ├── config/
│   │   └── database.js              # MongoDB connection config
│   ├── controllers/
│   │   ├── authController.js        # Auth logic (register, login, etc)
│   │   └── orderController.js       # Order management logic
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication & authorization
│   ├── models/
│   │   ├── User.js                  # User schema & member tier logic
│   │   └── Order.js                 # Order schema & auto-numbering
│   ├── routes/
│   │   ├── auth.js                  # Auth endpoints routing
│   │   └── orders.js                # Order endpoints routing
│   ├── .env.example                 # Environment variables template
│   ├── .env                         # Your actual config (create from .env.example)
│   ├── .gitignore                   # Ignore node_modules, .env, etc
│   ├── package.json                 # Dependencies & scripts
│   └── server.js                    # Main Express app entry point
│
├── js/
│   ├── api-client.js                # Frontend API client với JWT handling
│   ├── auth-module.js               # Login/Register UI & logic
│   ├── app.js                       # Existing main app logic
│   └── ...                          # Other existing JS files
│
├── css/
│   ├── auth-modal.css               # Login/Register modal styles
│   └── ...                          # Other existing CSS files
│
├── index.html                       # Main HTML (đã tích hợp login button)
├── start-server.bat                 # Quick start script (Windows)
├── QUICK_START.md                   # Hướng dẫn nhanh
└── README_LOGIN_SYSTEM.md           # Full documentation

```

## 🔄 Data Flow

### Authentication Flow
```
1. User fills login form
   ↓
2. Frontend (auth-module.js) → POST /api/auth/login
   ↓
3. Backend (authController.js)
   ├── Validate credentials
   ├── Check password with bcrypt
   └── Generate JWT token
   ↓
4. Response: { success: true, token: "...", user: {...} }
   ↓
5. Frontend stores token in localStorage
   ↓
6. All future requests include: Authorization: Bearer <token>
```

### Order Creation Flow
```
1. User completes checkout
   ↓
2. Frontend → POST /api/orders with JWT token
   ↓
3. Backend (orderController.js)
   ├── Verify JWT token (auth middleware)
   ├── Create order with auto-generated number
   ├── Calculate points earned
   └── Save to MongoDB
   ↓
4. If order delivered:
   ├── Update user's totalSpending
   ├── Add loyalty points
   └── Update member tier
```

## 🔑 Key Files Explained

### Backend

#### `server/server.js`
- Main Express application
- Setup middleware (CORS, Helmet, Rate limiting)
- Mount routes
- Global error handling
- Graceful shutdown

#### `server/models/User.js`
- User schema với Mongoose
- Password hashing (pre-save hook)
- Member tier calculation
- Virtual field: pointsToNextTier

#### `server/middleware/auth.js`
- `protect()`: Verify JWT token
- `authorize()`: Check user roles
- `generateToken()`: Create JWT
- `sendTokenResponse()`: Send token to client

#### `server/controllers/authController.js`
- `register()`: Create new user account
- `login()`: Authenticate user
- `getMe()`: Get current user info
- `updateProfile()`: Update user data
- `updatePassword()`: Change password
- Validation middleware with express-validator

### Frontend

#### `js/api-client.js`
- `APIClient` class for API communication
- Token management (localStorage)
- Request wrapper with auto-retry
- Methods for all API endpoints:
  - `login()`, `register()`
  - `getMe()`, `updateProfile()`
  - `createOrder()`, `getMyOrders()`

#### `js/auth-module.js`
- `AuthModule` class for UI
- `showLoginModal()`: Display login/register modal
- `handleLogin()`: Process login form
- `handleRegister()`: Process registration
- `loadUserProfile()`: Fetch & display user data
- Form validation & error handling

#### `css/auth-modal.css`
- Modal overlay & content styles
- Form input styles
- Button animations
- Social login buttons
- Responsive design
- Dark mode support

## 🔐 Security Features

### Backend
✅ **Password Security**
- Bcrypt hashing (salt rounds: 10)
- Passwords never returned in API responses
- Password validation (min 6 chars)

✅ **JWT Authentication**
- Secure token generation
- Configurable expiration
- Token verification on protected routes
- Role-based authorization

✅ **Security Middleware**
- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting (100 req/15min)
- Express validator for input sanitization

✅ **Database Security**
- Mongoose schema validation
- Input sanitization
- Unique constraints
- Indexed fields for performance

### Frontend
✅ **Token Management**
- Secure localStorage storage
- Auto-include in requests
- Clear on logout
- Refresh handling

✅ **Input Validation**
- Client-side validation
- Format checking (email, phone)
- Password strength
- Agreement checkboxes

## 📊 Database Collections

### users
```javascript
{
  _id: ObjectId,
  username: String (unique, lowercase),
  email: String (unique, lowercase),
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

### orders
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: users),
  orderNumber: String, // SP20260124001 (auto-generated)
  items: [{
    productId: String,
    productName: String,
    productImage: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  discount: Number,
  total: Number,
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    district: String,
    ward: String,
    note: String
  },
  paymentMethod: String, // cod, bank_transfer, credit_card, momo, zalopay
  paymentStatus: String, // pending, paid, failed, refunded
  paidAt: Date,
  status: String, // pending, confirmed, processing, shipping, delivered, cancelled
  trackingNumber: String,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  pointsEarned: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Member Tier System

| Tier | Spending Required | Benefits |
|------|------------------|----------|
| Đồng | 0 VNĐ | Basic member |
| Bạc | 5,000,000 VNĐ | 2% discount |
| Vàng | 10,000,000 VNĐ | 5% discount + Priority support |
| Bạch Kim | 25,000,000 VNĐ | 8% discount + Free shipping |
| Kim Cương | 50,000,000 VNĐ | 10% discount + VIP perks |

**Automatic tier upgrade** when order is delivered!

## 🔄 State Management

### LocalStorage Keys
```javascript
'authToken'         // JWT token
'user'              // User object (cached)
'userAvatar'        // Avatar base64 (existing)
'userContactInfo'   // Contact info (existing)
'sp_cart'           // Shopping cart (existing)
```

### Token Structure
```javascript
{
  id: "user_id_here",
  iat: 1234567890,  // Issued at
  exp: 1234567890   // Expires at
}
```

## 🚀 Deployment Checklist

### Backend
- [ ] Set strong JWT_SECRET in production
- [ ] Use MongoDB Atlas or production MongoDB
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS_ORIGIN
- [ ] Enable MongoDB authentication
- [ ] Setup monitoring & logging
- [ ] Configure backup strategy

### Frontend
- [ ] Update API_BASE_URL in api-client.js
- [ ] Enable HTTPS
- [ ] Minify JS/CSS
- [ ] Optimize images
- [ ] Setup CDN for static assets
- [ ] Configure service worker
- [ ] Test on multiple devices

## 📈 Performance Optimization

### Backend
- MongoDB indexes on frequently queried fields
- Connection pooling
- Response caching for static data
- Rate limiting to prevent abuse
- Gzip compression

### Frontend
- Lazy load modals
- Cache user data
- Debounce API calls
- Optimize bundle size
- Use CDN for libraries

## 🐛 Common Issues & Solutions

### "MongooseServerSelectionError"
→ MongoDB not running or wrong connection string in .env

### "JsonWebTokenError: jwt malformed"
→ Clear localStorage and re-login

### "CORS policy error"
→ Check CORS_ORIGIN in server/.env matches frontend URL

### "Error: listen EADDRINUSE"
→ Port 5000 already in use, change PORT in .env or kill process

## 📚 Learning Resources

- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB University](https://university.mongodb.com/)
- [JWT.io](https://jwt.io/) - JWT debugger
- [Postman](https://www.postman.com/) - API testing

## 🎨 UI/UX Highlights

- **Modern design** with gradients & shadows
- **Smooth animations** for better UX
- **Responsive layout** works on all devices
- **Dark mode support** for AMOLED screens
- **Loading states** for better feedback
- **Error messages** in Vietnamese
- **Social login buttons** (UI ready for implementation)

---

**Happy Coding! 🚀**
