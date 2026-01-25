# Hướng dẫn Deploy Production

## 1. Cấu hình Backend API URL

Mở file `js/api-client.js` và cập nhật URL backend production:

```javascript
// Dòng 3
const API_BASE_URL = 'https://your-backend-api.com/api'; // Thay bằng URL backend thật
```

## 2. Cấu hình Warranty API Endpoint

Mở file `js/warranty-loader.js` và cập nhật endpoint warranty:

```javascript
// Dòng 42
const warrantyRes = await api.request('/warranty/products');
```

Đảm bảo backend có endpoint này trả về format:
```json
{
  "success": true,
  "data": [
    {
      "productName": "Tên sản phẩm",
      "serialNumber": "SN123456",
      "purchaseDate": "2024-01-15T00:00:00.000Z",
      "warrantyEndDate": "2026-01-15T00:00:00.000Z"
    }
  ]
}
```

## 3. Deploy lên Vercel

1. Push code lên Git repository
2. Kết nối với Vercel
3. Deploy tự động

File `vercel.json` đã được cấu hình SPA routing - mọi route sẽ fallback về `index.html`

## 4. Kiểm tra sau khi deploy

- Đăng nhập: Phải gọi API backend thật
- Trang bảo hành: Yêu cầu đăng nhập, hiển thị dữ liệu từ backend
- Không còn Mock Data

## 5. Lưu ý

- **KHÔNG CÒN MOCK DATA**: App giờ chỉ hoạt động với backend thật
- Nếu backend chưa sẵn sàng, user sẽ thấy lỗi rõ ràng thay vì dữ liệu giả
- Trang bảo hành yêu cầu đăng nhập bắt buộc
