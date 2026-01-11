# Hướng Dẫn Sử Dụng Thuộc Tính Ẩn Sản Phẩm (Hidden Attributes)

## Giới Thiệu

File `product-hidden-attributes.js` cung cấp hệ thống quản lý **thuộc tính ẩn** cho sản phẩm, cho phép phân mục và lọc sản phẩm một cách dễ dàng và linh hoạt. 

### Các Thuộc Tính Ẩn Bao Gồm:
- **mainCategoryId**: ID danh mục chính
- **subCategoryId**: ID danh mục phụ
- **category**: Tên danh mục chính
- **subCategory**: Tên danh mục phụ
- **brand**: Thương hiệu
- **brandId**: ID thương hiệu (slugified)
- **tags**: Mảng các tag (gaming, office, design, etc.)
- **priceRangeId**: Khoảng giá
- **sellingPrice**: Giá bán
- **regularPrice**: Giá gốc
- **isPromotion**: Có phải khuyến mãi
- **isNew**: Sản phẩm mới
- **isBestseller**: Bán chạy
- **discount**: Phần trăm giảm giá
- **hidden**: Ẩn khỏi hiển thị

---

## Cách Sử Dụng

### 1. Lấy Thuộc Tính Ẩn của Một Sản Phẩm

```javascript
// Giả sử product = {n: "Laptop MSI...", s: "123456", c: "Laptop - Máy Tính Xách Tay", ...}
const attributes = ProductHiddenAttributes.getHiddenAttributes(product.s, product);

console.log(attributes.category);        // "Laptop - Máy Tính Xách Tay"
console.log(attributes.subCategory);     // "Laptop Theo Hãng"
console.log(attributes.brand);           // "MSI"
console.log(attributes.tags);            // ["laptop", "gaming", "high-end", ...]
console.log(attributes.isPromotion);     // true/false
console.log(attributes.discount);        // 15 (%)
```

### 2. Lọc Sản Phẩm Theo Danh Mục Phụ

```javascript
// Lọc tất cả sản phẩm Gaming
const gamingLaptops = ProductHiddenAttributes.filterBySubCategory(
    products,
    'Laptop Gaming'
);
```

### 3. Lọc Sản Phẩm Theo Thương Hiệu

```javascript
// Lọc tất cả sản phẩm ASUS
const asusProducts = ProductHiddenAttributes.filterByBrand(
    products,
    'ASUS'
);
```

### 4. Lọc Sản Phẩm Theo Tag

```javascript
// Lọc tất cả sản phẩm có tag "gaming"
const gamingProducts = ProductHiddenAttributes.filterByTag(
    products,
    'gaming'
);

// Tags phổ biến: gaming, office, design, workstation, mini, laptop, desktop, 
// wireless, mechanical, rgb, premium, budget-friendly, high-performance, etc.
```

### 5. Lọc Sản Phẩm Theo Khoảng Giá

```javascript
// Lọc sản phẩm từ 10 - 20 triệu đồng
const priceFiltered = ProductHiddenAttributes.filterByPriceRange(
    products,
    10000000,
    20000000
);
```

### 6. Tìm Kiếm Theo Nhiều Tiêu Chí (Recommended)

```javascript
// Tìm sản phẩm phù hợp với nhiều tiêu chí
const results = ProductHiddenAttributes.searchByMultipleCriteria(products, {
    category: 'Laptop - Máy Tính Xách Tay',
    subCategory: 'Laptop Gaming',
    brand: 'ASUS',
    tags: ['gaming', 'high-performance'],
    priceMin: 20000000,
    priceMax: 50000000,
    isPromotion: true    // Chỉ hiển thị sản phẩm đang giảm giá
});

console.log(results); // Mảng sản phẩm phù hợp tất cả tiêu chí
```

### 7. Lấy Thống Kê Sản Phẩm

```javascript
// Lấy thống kê đầy đủ về tập hợp sản phẩm
const stats = ProductHiddenAttributes.getStatistics(products);

console.log(stats.totalProducts);           // Tổng số sản phẩm
console.log(stats.avgPrice);                // Giá trung bình
console.log(stats.totalValue);              // Tổng giá trị sản phẩm
console.log(stats.discountedProducts);      // Số sản phẩm đang giảm giá
console.log(stats.categoriesObj);           // {categoryName: count, ...}
console.log(stats.brandsObj);               // {brandName: count, ...}
console.log(stats.tagsObj);                 // {tagName: count, ...}
```

### 8. Debug Thông Tin Sản Phẩm

```javascript
// In thông tin chi tiết của một sản phẩm ra console
ProductHiddenAttributes.debugProduct(product);

// Output:
// 📦 Product: Laptop ASUS ROG Gaming...
// SKU: 123456
// Category: Laptop - Máy Tính Xách Tay
// Sub Category: Laptop Gaming
// Brand: ASUS
// Price: 35000000
// Price Range: 30-50m
// Tags: ['laptop', 'gaming', 'high-performance', 'rgb']
// Is Promotion: true
// Discount: 15%
```

---

## Ví Dụ Thực Tế

### Ví Dụ 1: Hiển Thị Sản Phẩm Gaming Dưới 20 Triệu

```javascript
async function displayAffordableGamingLaptops() {
    // Giả sử products đã được load từ ProductManager
    const filtered = ProductHiddenAttributes.searchByMultipleCriteria(
        window.ProductManager?.products || [],
        {
            subCategory: 'Laptop Gaming',
            priceMax: 20000000
        }
    );
    
    displayProducts(filtered);
}
```

### Ví Dụ 2: Lọc Sản Phẩm Khuyến Mãi Theo Danh Mục

```javascript
function getPromotionProductsByCategory(categoryName) {
    const stats = ProductHiddenAttributes.searchByMultipleCriteria(
        window.ProductManager?.products || [],
        {
            category: categoryName,
            isPromotion: true
        }
    );
    
    // Sắp xếp theo % giảm giá (cao nhất trước)
    return stats.sort((a, b) => {
        const discountA = ProductHiddenAttributes.getHiddenAttributes(a.s, a).discount;
        const discountB = ProductHiddenAttributes.getHiddenAttributes(b.s, b).discount;
        return discountB - discountA;
    });
}
```

### Ví Dụ 3: Xây Dựng Filter UI Động

```javascript
function buildDynamicFilters() {
    const products = window.ProductManager?.products || [];
    const stats = ProductHiddenAttributes.getStatistics(products);
    
    // Thương hiệu
    const brands = Object.entries(stats.brandsObj)
        .filter(([brand]) => brand !== '')
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);
    
    // Tags
    const topTags = Object.entries(stats.tagsObj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
    
    // Hiển thị bộ lọc
    displayBrandFilter(brands);
    displayTagFilter(topTags);
    displayCategoryFilter(Object.entries(stats.categoriesObj));
}
```

### Ví Dụ 4: Tự Động Cập Nhật Danh Mục Phụ Từ Dữ Liệu

```javascript
function autoUpdateSubCategories() {
    const products = window.ProductManager?.products || [];
    const subCategoryMap = new Map();
    
    products.forEach(product => {
        const attrs = ProductHiddenAttributes.getHiddenAttributes(product.s, product);
        if (!subCategoryMap.has(attrs.subCategory)) {
            subCategoryMap.set(attrs.subCategory, {
                id: attrs.subCategoryId,
                name: attrs.subCategory,
                count: 0
            });
        }
        subCategoryMap.get(attrs.subCategory).count++;
    });
    
    console.table(Object.fromEntries(subCategoryMap));
}
```

---

## Danh Sách Ánh Xạ (Mapping)

### Danh Mục Chính

| Tên | ID |
|-----|-----|
| PC Song Phương | 1 |
| Máy Tính Trọn Bộ | 2 |
| Laptop - Máy Tính Xách Tay | 3 |
| Linh Kiện Máy Tính | 4 |
| Ngoại Vi - Phụ Kiện | 5 |
| Màn Hình | 6 |
| Mạng - Bảo Mật - Lưu Điện | 7 |
| Bàn - Ghế Gaming | 8 |
| Khác | 9 |

### Khoảng Giá

| Khoảng | ID | Min | Max |
|--------|-----|-----|------|
| Dưới 5 triệu | under-5m | 0 | 5M |
| 5 - 10 triệu | 5-10m | 5M | 10M |
| 10 - 20 triệu | 10-20m | 10M | 20M |
| 20 - 30 triệu | 20-30m | 20M | 30M |
| 30 - 50 triệu | 30-50m | 30M | 50M |
| Trên 50 triệu | above-50m | 50M | ∞ |

### Tags Phổ Biến

- `gaming` - Sản phẩm chuyên dụng chơi game
- `office` - Sản phẩm văn phòng
- `design` - Sản phẩm đồ họa/thiết kế
- `workstation` - Trạm làm việc chuyên nghiệp
- `mini` - Kích thước mini/nhỏ gọn
- `laptop` - Laptop/xách tay
- `desktop` - Máy bộ/để bàn
- `wireless` - Không dây
- `mechanical` - Cơ học (bàn phím, chuột)
- `rgb` - Có đèn LED RGB
- `premium` - Hạng cao cấp (> 30M)
- `budget-friendly` - Giá rẻ (< 5M)
- `high-performance` - Hiệu năng cao
- `portable` - Dễ mang theo
- `liquid-cooled` - Tản nhiệt nước
- `air-cooled` - Tản nhiệt khí

---

## Lưu Ý Quan Trọng

1. **Cache**: Hệ thống tự động cache thuộc tính ẩn để tăng tốc độ. Nếu muốn clear cache:
   ```javascript
   ProductHiddenAttributes.attributesMap.clear();
   ```

2. **Thương hiệu**: Danh sách thương hiệu được tự động slugify (ví dụ: "Western Digital" → "western-digital")

3. **Tags**: Tags được tự động tạo từ tên sản phẩm, danh mục, và thương hiệu. Bạn có thể mở rộng logic `generateTags()` để thêm logic tùy chỉnh.

4. **Giá**: Nếu sản phẩm không có giá bán (sp), hệ thống sẽ sử dụng giá gốc (rp).

5. **Performance**: Với 10,000+ sản phẩm, việc filter lần đầu có thể mất vài ms. Cache sẽ giảm tải cho lần sau.

---

## Tích Hợp Với App.js

Để sử dụng trong `app.js`, bạn có thể thêm:

```javascript
// Khi filter sản phẩm theo danh mục
function filterProductsByCategory(categoryName) {
    const filtered = ProductHiddenAttributes.searchByMultipleCriteria(
        ProductManager.products,
        { subCategory: categoryName }
    );
    displayFilteredProducts(filtered);
}

// Khi tìm kiếm nâng cao
function advancedSearch(filters) {
    const results = ProductHiddenAttributes.searchByMultipleCriteria(
        ProductManager.products,
        filters
    );
    return results;
}
```

---

## Hỗ Trợ & Phát Triển

Nếu muốn mở rộng hệ thống:

1. **Thêm Tag mới**: Cập nhật `COMMON_TAGS` array và logic `generateTags()`
2. **Thêm Thương hiệu**: Cập nhật `BRAND_MAP`
3. **Thêm Danh mục**: Cập nhật `SUB_CATEGORY_MAP`
4. **Thêm thuộc tính**: Sửa đổi `extractAttributes()` method

Tất cả các thay đổi sẽ tự động áp dụng cho tất cả sản phẩm nhờ cache được rebuild khi cần.
