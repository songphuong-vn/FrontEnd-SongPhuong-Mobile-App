# 🧪 Hướng dẫn Kiểm thử

## Checklist Kiểm thử

### ✅ 1. Cart Badge Tests

**Mục tiêu**: Đảm bảo badge hiển thị/ẩn đúng

**Steps**:
```javascript
// 1. Xóa localStorage cart
localStorage.removeItem('cartItems');
localStorage.removeItem('sp_cart');
location.reload();

// 2. Kiểm tra badge ẩn
const badge = document.querySelector('.cart-badge');
console.log('Badge visible:', badge.classList.contains('visible')); // Should be false
console.log('Display:', window.getComputedStyle(badge).display); // Should be 'none'

// 3. Thêm sản phẩm vào giỏ
// Click vào nút "Mua" của bất kỳ sản phẩm nào

// 4. Kiểm tra badge hiển thị
console.log('Badge visible:', badge.classList.contains('visible')); // Should be true
console.log('Count:', badge.textContent); // Should be > 0

// 5. Xóa sản phẩm
// Mở cart và xóa tất cả items

// 6. Kiểm tra badge ẩn lại
console.log('Badge visible:', badge.classList.contains('visible')); // Should be false
```

**Expected Results**:
- ✅ Badge ẩn khi cart trống (display: none)
- ✅ Badge hiển thị khi có items (display: flex)
- ✅ Count cập nhật đúng
- ✅ Badge có class 'visible' khi count > 0

---

### ✅ 2. Cart Overlay Z-Index Tests

**Mục tiêu**: Đảm bảo cart overlay không bị che bởi elements khác

**Steps**:
```javascript
// 1. Kiểm tra z-index của cart overlay
const overlay = document.querySelector('.cart-overlay');
console.log('Z-Index:', window.getComputedStyle(overlay).zIndex); // Should be 2000

// 2. Kiểm tra z-index của header
const header = document.querySelector('.song-phuong-header');
console.log('Header Z-Index:', window.getComputedStyle(header).zIndex); // Should be < 2000

// 3. Mở cart
openCart();

// 4. Kiểm tra overlay active
console.log('Overlay active:', overlay.classList.contains('active')); // Should be true

// 5. Click vào backdrop để đóng
// Click vào vùng tối bên ngoài cart panel

// 6. Kiểm tra overlay đóng
console.log('Overlay active:', overlay.classList.contains('active')); // Should be false
```

**Expected Results**:
- ✅ Cart overlay z-index = 2000
- ✅ Cart panel hiển thị đúng
- ✅ Backdrop click đóng cart
- ✅ Không bị che bởi header hay modal khác

---

### ✅ 3. Login Flow Tests

**Mục tiêu**: Đảm bảo login hoạt động và hiển thị notification

**Steps**:
```javascript
// 1. Đăng xuất (nếu đã login)
api.removeToken();
api.removeUser();
location.reload();

// 2. Chuyển sang tab Profile
switchNav('profile');

// 3. Nhập credentials
// Username: user
// Password: 123456

// 4. Click "Đăng nhập"
// Quan sát notification hiển thị

// 5. Kiểm tra auth state
console.log('Is authenticated:', api.isAuthenticated()); // Should be true
console.log('User:', api.getUserFromToken()); // Should have user object

// 6. Kiểm tra profile view cập nhật
const loginState = document.getElementById('profile-login-state');
const loggedState = document.getElementById('profile-logged-state');
console.log('Login form hidden:', loginState.style.display === 'none'); // Should be true
console.log('Profile shown:', loggedState.style.display === 'block'); // Should be true
```

**Expected Results**:
- ✅ Login thành công với credentials đúng
- ✅ showNotification('Đăng nhập thành công!', 'success') hiển thị
- ✅ Profile view cập nhật KHÔNG reload trang
- ✅ User data hiển thị đúng

---

### ✅ 4. Notification System Tests

**Mục tiêu**: Đảm bảo toast notifications hoạt động

**Steps**:
```javascript
// 1. Test success notification
showNotification('Test success message', 'success');

// 2. Test error notification
showNotification('Test error message', 'error');

// 3. Test info notification
showNotification('Test info message', 'info');

// 4. Kiểm tra toast container
const container = document.getElementById('toast-container');
console.log('Toast container exists:', !!container); // Should be true

// 5. Kiểm tra toast auto-dismiss
// Wait 3 seconds, toast should disappear
```

**Expected Results**:
- ✅ Toast hiển thị với icon và màu đúng
- ✅ Toast tự động biến mất sau 3s
- ✅ Multiple toasts stack correctly
- ✅ Animation smooth

---

## 🚀 Quick Test Script

Chạy trong Console:

```javascript
// Full test suite
(async function testAll() {
    console.log('🧪 Starting Full Test Suite...\n');
    
    // 1. Cart Badge Test
    console.log('1️⃣ Testing Cart Badge...');
    localStorage.removeItem('cartItems');
    const badge = document.querySelector('.cart-badge');
    console.assert(!badge.classList.contains('visible'), 'Badge should be hidden when cart empty');
    console.log('✅ Cart Badge Test Passed\n');
    
    // 2. Z-Index Test
    console.log('2️⃣ Testing Z-Index...');
    const overlay = document.querySelector('.cart-overlay');
    const zIndex = parseInt(window.getComputedStyle(overlay).zIndex);
    console.assert(zIndex >= 2000, 'Cart overlay z-index should be >= 2000');
    console.log('✅ Z-Index Test Passed\n');
    
    // 3. Notification Test
    console.log('3️⃣ Testing Notifications...');
    if (typeof showNotification === 'function') {
        showNotification('Test notification', 'success');
        console.log('✅ Notification Test Passed\n');
    }
    
    // 4. Auth Test
    console.log('4️⃣ Testing Auth...');
    if (typeof api !== 'undefined') {
        console.log('API Client:', api.isAuthenticated() ? 'Authenticated' : 'Not authenticated');
        console.log('✅ Auth Test Passed\n');
    }
    
    console.log('🎉 All Tests Completed!');
})();
```

---

## 📋 Manual Test Checklist

- [ ] Cart badge ẩn khi count = 0
- [ ] Cart badge hiển thị khi count > 0
- [ ] Cart overlay mở được khi click icon
- [ ] Cart overlay z-index đủ cao (2000)
- [ ] Login hiển thị success notification
- [ ] Login KHÔNG reload trang
- [ ] Profile view cập nhật ngay sau login
- [ ] Logout hoạt động đúng
- [ ] Toast notifications hiển thị đúng màu
- [ ] Toast auto-dismiss sau 3s

---

## 🐛 Common Issues & Fixes

### Issue 1: Badge không ẩn khi cart trống
**Fix**: Kiểm tra CSS có class `.cart-badge.visible`

### Issue 2: Cart overlay bị che
**Fix**: Kiểm tra z-index trong `style.css`

### Issue 3: Login dùng alert() thay vì toast
**Fix**: Đã sửa trong `auth-module.js` dùng `showNotification()`

### Issue 4: Profile không cập nhật sau login
**Fix**: Kiểm tra `checkAuthState()` được gọi sau login

---

## 📞 Support

Nếu có lỗi, kiểm tra:
1. Console có error không?
2. Network tab có request fail không?
3. localStorage có data đúng không?

**Debug Commands**:
```javascript
// Check cart data
console.log('Cart:', localStorage.getItem('cartItems'));

// Check auth
console.log('Token:', localStorage.getItem('authToken'));
console.log('User:', localStorage.getItem('user'));

// Check badge
const badge = document.querySelector('.cart-badge');
console.log('Badge:', {
    visible: badge.classList.contains('visible'),
    count: badge.textContent,
    display: window.getComputedStyle(badge).display
});
```
