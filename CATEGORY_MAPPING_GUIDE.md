# Hệ Thống Ánh Xạ Sản Phẩm - Danh Mục (Product Category Mapping)

## Tổng Quan

Hệ thống ánh xạ sản phẩm-danh mục giúp liên kết chính xác các sản phẩm từ database với cấu trúc danh mục phân cấp 3 tầng. Điều này giải quyết vấn đề phân loại sản phẩm không chính xác.

## Cấu Trúc

### File Chính
- **`js/category-product-mapping.js`** - Chứa logic ánh xạ và các hàm lọc

### Cách Hoạt Động

1. **Dữ liệu sản phẩm** có trường `c` (category) với các giá trị như:
   - "PC Gaming"
   - "Laptop Theo Hãng"
   - "Main - Bo Mạch Chủ"
   - etc.

2. **File mapping** chứa bảng ánh xạ `PRODUCT_CATEGORY_MAPPING`:
   ```javascript
   {
       "PC Gaming": "PC Song Phương > PC Gaming",
       "Laptop Theo Hãng": "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng",
       ...
   }
   ```

3. **Các hàm tiện ích** cho phép:
   - Lấy đường dẫn danh mục đầy đủ từ SKU sản phẩm
   - Lọc sản phẩm theo danh mục cha
   - Lọc sản phẩm theo danh mục con chính xác
   - Liệt kê danh mục con của một danh mục cha
   - Thống kê số lượng sản phẩm
   - Tìm các sản phẩm không được phân loại

## API Functions

### 1. `getCategoryPath(productCategory)`
Lấy đường dẫn danh mục đầy đủ từ trường `c` của sản phẩm.

**Tham số:**
- `productCategory` (string): Giá trị của trường `c` từ sản phẩm

**Trả về:**
- (string): Đường dẫn danh mục (ví dụ: "PC Song Phương > PC Gaming")

**Ví dụ:**
```javascript
const path = getCategoryPath("PC Gaming");
// Kết quả: "PC Song Phương > PC Gaming"
```

### 2. `filterProductsByParentCategory(products, parentCategory)`
Lọc tất cả sản phẩm thuộc một danh mục cha.

**Tham số:**
- `products` (Array): Danh sách sản phẩm
- `parentCategory` (string): Tên danh mục cha

**Trả về:**
- (Array): Danh sách sản phẩm

**Ví dụ:**
```javascript
const pcProducts = filterProductsByParentCategory(products, "PC Song Phương");
```

### 3. `filterProductsByExactCategory(products, categoryPath)`
Lọc sản phẩm theo danh mục con chính xác.

**Tham số:**
- `products` (Array): Danh sách sản phẩm
- `categoryPath` (string): Đường dẫn danh mục chính xác

**Trả về:**
- (Array): Danh sách sản phẩm

**Ví dụ:**
```javascript
const gamingPCs = filterProductsByExactCategory(
    products, 
    "PC Song Phương > PC Gaming"
);
```

### 4. `getSubCategoriesForParent(products, parentCategory)`
Lấy tất cả danh mục con của một danh mục cha.

**Tham số:**
- `products` (Array): Danh sách sản phẩm
- `parentCategory` (string): Tên danh mục cha

**Trả về:**
- (Array): Danh sách tên danh mục con (sorted)

**Ví dụ:**
```javascript
const subcats = getSubCategoriesForParent(products, "Linh Kiện Máy Tính");
// Kết quả: ["CPU - Bộ vi xử lý", "Main - Bo Mạch Chủ", "VGA - Card Màn Hình", ...]
```

### 5. `getProductCountByCategory(products)`
Thống kê số lượng sản phẩm theo danh mục.

**Tham số:**
- `products` (Array): Danh sách sản phẩm

**Trả về:**
- (Object): Object với key là đường dẫn danh mục, value là số lượng

**Ví dụ:**
```javascript
const counts = getProductCountByCategory(products);
// Kết quả: {
//   "PC Song Phương > PC Gaming": 45,
//   "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng": 128,
//   ...
// }
```

### 6. `getUncategorizedProducts(products)`
Lấy danh sách sản phẩm không được phân loại (trong "Khác").

**Tham số:**
- `products` (Array): Danh sách sản phẩm

**Trả về:**
- (Array): Danh sách sản phẩm

**Ví dụ:**
```javascript
const uncategorized = getUncategorizedProducts(products);
console.log(`Có ${uncategorized.length} sản phẩm chưa phân loại`);
```

### 7. `getUniqueCategoryFields(products)`
Lấy tất cả các giá trị duy nhất của trường `c` từ sản phẩm.

**Tham số:**
- `products` (Array): Danh sách sản phẩm

**Trả về:**
- (Array): Danh sách các giá trị (sorted)

**Ví dụ:**
```javascript
const uniqueCats = getUniqueCategoryFields(products);
```

### 8. `generateCategoryReport(products)`
Tạo báo cáo chi tiết về phân loại sản phẩm (in ra console).

**Tham số:**
- `products` (Array): Danh sách sản phẩm

**Ví dụ:**
```javascript
generateCategoryReport(ProductManager.products);
```

**Output mẫu:**
```
=== PRODUCT CATEGORY REPORT ===

Total Products: 9926

--- Products by Category ---
PC Gaming: 145
Laptop Theo Hãng: 230
...

--- Uncategorized Products: 12 ---
- SKU: 12345, Category: "Unknown Category", Name: ...

--- Unique Category Fields ---
Total unique fields: 47
"PC Gaming" -> "PC Song Phương > PC Gaming"
...
```

## Cách Sử Dụng

### Cơ Bản

```javascript
// Lấy danh sách sản phẩm từ ProductManager
const products = ProductManager.products;

// Lọc sản phẩm theo danh mục cha
const laptops = filterProductsByParentCategory(
    products, 
    "Laptop - Máy Tính Xách Tay"
);

// Lọc theo danh mục con chính xác
const laptopAsus = filterProductsByExactCategory(
    products,
    "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng"
);
```

### Hiển thị Danh Mục Động

```javascript
// Lấy danh mục con của "Linh Kiện Máy Tính"
const components = getSubCategoriesForParent(
    products,
    "Linh Kiện Máy Tính"
);

// Render dropdown
components.forEach(subcat => {
    console.log(`- ${subcat}`);
});
```

### Kiểm Tra Phân Loại

```javascript
// Tạo báo cáo
generateCategoryReport(products);

// Tìm sản phẩm chưa phân loại
const uncategorized = getUncategorizedProducts(products);
if (uncategorized.length > 0) {
    console.warn(`Cảnh báo: ${uncategorized.length} sản phẩm chưa phân loại!`);
    uncategorized.forEach(p => {
        console.log(`SKU: ${p.s}, Category: "${p.c}"`);
    });
}
```

## Tích Hợp với App.js

Trong `app.js`, có thể sử dụng các hàm này để:

1. **Lọc sản phẩm khi click vào danh mục:**
```javascript
function filterProductsByCategory(categoryPath) {
    const filtered = filterProductsByExactCategory(
        ProductManager.products,
        categoryPath
    );
    displayProducts(filtered);
}
```

2. **Cập nhật sidebar động:**
```javascript
function updateSidebarSubcategories(parentCategory) {
    const subcats = getSubCategoriesForParent(
        ProductManager.products,
        parentCategory
    );
    renderSubcategoryList(subcats);
}
```

3. **Hiển thị số lượng sản phẩm:**
```javascript
function displayCategoryCounts() {
    const counts = getProductCountByCategory(ProductManager.products);
    Object.entries(counts).forEach(([category, count]) => {
        const badge = document.querySelector(`[data-category="${category}"]`);
        if (badge) badge.textContent = count;
    });
}
```

## Bản Đồ Ánh Xạ Hiện Tại

### PC Song Phương
- "PC Gaming" → "PC Song Phương > PC Gaming"
- "PC Văn Phòng" → "PC Song Phương > PC Văn Phòng"
- "PC Đồ Họa" → "PC Song Phương > PC Đồ Họa"
- "Máy tính PC AI" → "PC Song Phương > Máy tính PC AI"

### Máy Tính Trọn Bộ
- "Máy Bộ Theo Hãng" → "Máy Tính Trọn Bộ > Máy Bộ Theo Hãng"
- "Máy Bộ Theo Nhu Cầu" → "Máy Tính Trọn Bộ > Máy Bộ Theo Nhu Cầu"

### Laptop - Máy Tính Xách Tay
- "Laptop Theo Hãng" → "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng"
- "Laptop Theo Nhu Cầu" → "Laptop - Máy Tính Xách Tay > Laptop Theo Nhu Cầu"
- "Laptop Theo Giá" → "Laptop - Máy Tính Xách Tay > Laptop Theo Giá"
- "Laptop Theo LCD" → "Laptop - Máy Tính Xách Tay > Laptop Theo LCD"

### Linh Kiện Máy Tính
- "CPU - Bộ vi xử lý"
- "Main - Bo Mạch Chủ"
- "VGA - Card Màn Hình"
- "Ram - Bộ nhớ đệm"
- "SSD - HDD"
- "PSU - Nguồn máy tính"
- "Case - Vỏ máy tính"
- "Tản Nhiệt Theo Hãng"

### Màn Hình Máy Tính
- "Màn Hình Theo Hãng"
- "Màn Hình Theo Nhu Cầu"

### Gaming Gear - Phím - Chuột
- "Keyboard - Bàn Phím"
- "Mouse - Chuột"
- "Headphone - Tai Nghe"
- "Bàn-Ghế Gaming"
- "Loa Nghe Nhạc"
- "Phụ Kiện Khác"
- "Phụ kiện Máy tính PC"

### Dịch Vụ PC - Laptop
- "Máy In - Photo"
- "Phụ kiện Laptop"
- "Phụ kiện Điện thoại"

## Troubleshooting

### Sản phẩm không được tìm thấy?
1. Chạy `generateCategoryReport()` để xem sản phẩm nào chưa được map
2. Thêm entry mới vào `PRODUCT_CATEGORY_MAPPING`
3. Reload trang

### Danh mục không hiển thị?
1. Kiểm tra xem danh mục cha có tồn tại không
2. Chạy `getSubCategoriesForParent()` để debug
3. Xem browser console cho lỗi

### Số lượng sản phẩm không chính xác?
1. Chạy `getProductCountByCategory()` để verify
2. Kiểm tra xem có sản phẩm nào chưa được load từ database
3. Đảm bảo `ProductManager.products` đã được load đầy đủ

## Các Cập Nhật Trong Tương Lai

- [ ] Thêm support cho danh mục 4 tầng
- [ ] Tích hợp caching để tăng performance
- [ ] Thêm search trong danh mục
- [ ] Hỗ trợ cho multiple categories mỗi sản phẩm
- [ ] Analytics cho category usage
