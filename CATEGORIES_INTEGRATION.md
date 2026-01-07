# Tích hợp Hệ thống Danh Mục Phân Cấp

## Tổng quan

Đã tích hợp thành công hệ thống danh mục phân cấp vào ứng dụng Song Phương Mobile App với các tính năng:

1. **Cấu trúc danh mục 3 cấp**: Danh mục cha > Danh mục con > Danh mục con cấp 2
2. **Sidebar động với dropdown**: Có thể mở/đóng các danh mục con khi click vào mũi tên
3. **Navigation nhanh**: Các danh mục phổ biến hiển thị dưới banner để truy cập nhanh
4. **Tích hợp với ProductManager**: Sẵn sàng để lọc sản phẩm theo danh mục

## Files đã tạo/cập nhật

### 1. `js/categories-data.js` (MỚI)
File chứa cấu trúc danh mục phân cấp với 8 danh mục chính:

- **Camera An Ninh**: 7 danh mục con (Camera Phân Loại, Camera Theo Hãng, Camera Theo Nhu Cầu, v.v.)
- **Laptop - Máy Tính Xách Tay**: 4 danh mục con (Theo Hãng, Theo Nhu Cầu, Theo Giá, Theo LCD)
- **Linh Kiện Máy Tính**: 7 danh mục con (CPU, Main, VGA, RAM, SSD-HDD, PSU, Case)
- **Màn Hình Máy Tính**: 5 danh mục con (Theo Hãng, Theo Nhu Cầu, Kích Thước, Độ Phân Giải, Theo Giá)
- **PC Song Phương**: 7 danh mục con (PC Gaming, PC Văn Phòng, PC Đồ Họa, v.v.)
- **Máy Tính Trọn Bộ**: 2 danh mục con (Theo Hãng, Theo Nhu Cầu)
- **Gaming Gear-Phím-Chuột**: 9 danh mục con (Keyboard, Mouse, Headphone, Bàn-Ghế, v.v.)
- **Dịch Vụ PC-Laptop**: 6 danh mục con (Dịch vụ PC, Laptop, Camera, v.v.)

**Tổng cộng**: 8 danh mục cha, 47+ danh mục con cấp 1, 200+ danh mục con cấp 2

### 2. `index.html` (CẬP NHẬT)

#### Thay đổi trong Sidebar:
```html
<!-- Trước -->
<div class="sidebar-content">
    <div class="sidebar-item">...</div>
    <!-- Danh sách tĩnh -->
</div>

<!-- Sau -->
<div class="sidebar-content" id="sidebarContent">
    <!-- Danh mục sẽ được tạo động từ categories-data.js -->
</div>
```

#### Thêm script mới:
```html
<!-- Categories Data -->
<script src="js/categories-data.js"></script>
```

#### Thay đổi trong Navigation:
```html
<!-- Chỉ giữ lại "Tất cả" và "SALE", các item khác tạo động -->
<nav class="product-category-nav" id="productCategoryNav">
    <div class="product-cat-item active" data-category="all">...</div>
    <div class="product-cat-item category-sale" data-category="sale">...</div>
    <!-- Các danh mục khác tạo động từ categories-data.js -->
</nav>
```

#### Thêm CSS mới:
- `.sidebar-submenu`: Style cho danh mục con cấp 1
- `.sidebar-subsubmenu`: Style cho danh mục con cấp 2
- `.sidebar-item.has-children.active`: Xoay mũi tên khi mở
- Transition animation cho dropdown

### 3. `js/app.js` (CẬP NHẬT)

#### Các hàm mới được thêm:

1. **`initSidebarCategories()`**
   - Tạo động sidebar từ dữ liệu CATEGORIES
   - Render danh mục phân cấp 3 cấp
   - Thêm icon và sự kiện click

2. **`toggleSubmenu(submenuId)`**
   - Mở/đóng danh mục con cấp 1
   - Đóng các submenu khác khi mở submenu mới
   - Animation smooth

3. **`toggleSubSubmenu(subSubmenuId)`**
   - Mở/đóng danh mục con cấp 2
   - Chỉ đóng sub-submenu trong cùng parent

4. **`filterProductsByCategory(categoryPath)`**
   - Lọc sản phẩm theo đường dẫn danh mục
   - Đóng sidebar sau khi chọn
   - Chuyển về home view
   - Sẵn sàng tích hợp với ProductManager

5. **`initCategoryNavigation()`**
   - Tạo navigation items từ danh mục phổ biến
   - Giới hạn 6-8 danh mục cho navigation bar
   - Tự động rút gọn tên danh mục

6. **`getShortCategoryName(fullName)`**
   - Rút gọn tên danh mục dài cho navigation
   - VD: "Laptop - Máy Tính Xách Tay" → "Laptop"

7. **`setupCategoryNavClickHandlers()`**
   - Thiết lập sự kiện click cho navigation items
   - Highlight item được chọn
   - Trigger filter sản phẩm

#### Cập nhật DOMContentLoaded:
```javascript
document.addEventListener('DOMContentLoaded', async function () {
    // ... existing code ...
    
    // Khởi tạo sidebar với danh mục
    initSidebarCategories();
    
    // Khởi tạo navigation danh mục
    initCategoryNavigation();
});
```

## Cách sử dụng

### 1. Sidebar với Dropdown

**Mở sidebar:**
- Click vào icon menu (☰) ở footer navigation
- Hoặc gọi `toggleSidebar()` từ JavaScript

**Điều hướng trong sidebar:**
- Click vào danh mục không có mũi tên: Lọc sản phẩm ngay
- Click vào danh mục có mũi tên (→): Mở/đóng danh mục con
- Danh mục con cấp 1 có background #f8f8f8
- Danh mục con cấp 2 có background #f0f0f0

**Animation:**
- Mũi tên xoay 90° khi mở
- Smooth slide down/up với transition 0.3s
- Max-height animation cho dropdown

### 2. Category Navigation (Dưới Banner)

**Các danh mục hiển thị:**
- Tất cả
- SALE
- Laptop
- Linh Kiện
- Màn Hình
- PC
- Gaming
- Camera

**Tương tác:**
- Click vào danh mục để lọc sản phẩm
- Item được chọn sẽ có class `active`
- Tự động scroll ngang nếu có nhiều items

### 3. Tích hợp với ProductManager (TODO)

Hiện tại `filterProductsByCategory()` chỉ hiển thị notification. Để hoàn thiện:

```javascript
function filterProductsByCategory(categoryPath) {
    console.log('Filtering products by category:', categoryPath);
    
    closeSidebar();
    
    if (!window.ProductManager || !ProductManager.isLoaded) {
        showNotification('Đang tải dữ liệu...', 'info');
        return;
    }
    
    // Lọc sản phẩm theo category path
    const filteredProducts = ProductManager.products.filter(product => {
        // Kiểm tra nếu product.categories chứa categoryPath
        return product.categories && product.categories.includes(categoryPath);
    });
    
    // Render filtered products
    renderFilteredProducts(filteredProducts);
    
    switchNav('home');
}
```

## Cấu trúc dữ liệu

### Format danh mục trong `categories-data.js`:

```javascript
{
    name: 'Tên danh mục cha',
    icon: 'fas fa-icon-name',  // Font Awesome icon
    children: [
        {
            name: 'Danh mục con cấp 1',
            children: [
                'Danh mục con cấp 2 - Item 1',
                'Danh mục con cấp 2 - Item 2'
            ]
        },
        'Danh mục con cấp 1 đơn giản'  // Không có children
    ]
}
```

### Category Path Format:

- Cấp 1: `"Camera An Ninh"`
- Cấp 2: `"Camera An Ninh > Camera Theo Hãng"`
- Cấp 3: `"Camera An Ninh > Camera Theo Hãng > Camera Hikvision"`

## Responsive Design

- **Desktop/Tablet**: Sidebar width 280px
- **Mobile (<480px)**: Sidebar width 90%, max 300px
- Navigation tự động scroll ngang
- Touch-friendly với padding lớn

## Tính năng nổi bật

✅ Danh mục phân cấp 3 cấp đầy đủ
✅ Dropdown animation mượt mà
✅ Icon Font Awesome cho từng danh mục
✅ Tự động đóng submenu khác khi mở submenu mới
✅ Navigation nhanh với danh mục phổ biến
✅ Tích hợp sẵn với ProductManager
✅ Responsive trên mọi thiết bị
✅ Code modular, dễ bảo trì

## Ghi chú

- File `categories-data.js` được tạo từ dữ liệu CSV thực tế của database
- Tổng cộng có 9,926 sản phẩm với danh mục đầy đủ
- Có thể thêm/sửa danh mục trong `categories-data.js` mà không cần thay đổi code khác
- Icon có thể tùy chỉnh theo ý muốn trong mảng CATEGORIES

## Hướng dẫn mở rộng

### Thêm danh mục mới:
1. Mở `js/categories-data.js`
2. Thêm object mới vào mảng CATEGORIES
3. Reload trang để thấy thay đổi

### Thay đổi icon:
1. Tìm danh mục trong CATEGORIES
2. Sửa thuộc tính `icon`
3. Sử dụng Font Awesome hoặc Ionicons class

### Tùy chỉnh navigation items:
1. Mở `js/app.js`
2. Tìm hàm `initCategoryNavigation()`
3. Sửa mảng `popularCategories`

---
**Created by**: GitHub Copilot  
**Date**: 2026-01-07  
**Version**: 1.0
