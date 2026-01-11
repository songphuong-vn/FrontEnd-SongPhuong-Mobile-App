# Hướng Dẫn Tích Hợp Category Mapping vào App.js

## Tổng Quan

Hệ thống phân loại sản phẩm đã được tạo với 3 file chính:

1. **`category-product-mapping.js`** - Logic ánh xạ cơ bản
2. **`category-mapping-examples.js`** - Ví dụ tích hợp và helper functions
3. **`CATEGORY_MAPPING_GUIDE.md`** - Hướng dẫn chi tiết API

## Các Bước Tích Hợp

### Step 1: Thêm vào HTML

Các file đã được thêm vào `index.html` với thứ tự đúng:
```html
<script src="js/products-data.js"></script>
<script src="js/product-manager.js"></script>
<script src="js/categories-data.js"></script>
<script src="js/category-product-mapping.js"></script>
<script src="js/product-hidden-attributes.js"></script>
```

### Step 2: Thêm Examples vào HTML (Optional)

Nếu muốn sử dụng các helper functions, thêm vào `index.html`:
```html
<!-- Category Mapping Examples (optional for using helpers) -->
<script src="js/category-mapping-examples.js"></script>
```

### Step 3: Cập Nhật App.js

Trong `app.js`, thêm các đoạn code sau:

#### A. Khởi tạo hệ thống lọc

```javascript
// Thêm vào hàm init của app.js
async function initApp() {
    // ... existing code ...
    
    // Khởi tạo hệ thống phân loại
    await ProductManager.init();
    setupCategoryFiltering();
    
    // ... rest of code ...
}

function setupCategoryFiltering() {
    // Lấy tất cả nút danh mục
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const categoryPath = this.getAttribute('data-category-path');
            filterAndDisplayProducts(categoryPath);
        });
    });
}
```

#### B. Hàm lọc sản phẩm

```javascript
function filterAndDisplayProducts(categoryPath) {
    // Lọc sản phẩm theo danh mục
    const filtered = filterProductsByExactCategory(
        ProductManager.products,
        categoryPath
    );
    
    // Hiển thị sản phẩm
    displayProducts(filtered);
    
    // Cập nhật active state
    updateActiveCategory(categoryPath);
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function displayProducts(products) {
    const container = document.getElementById('products-grid');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Không có sản phẩm trong danh mục này</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <div class="product-image">
            <img src="${product.img || 'icons/product-placeholder.png'}" alt="${product.n}">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.n}</h3>
            <p class="product-price">${formatPrice(product.sp)}₫</p>
            <button class="btn-add-to-cart" onclick="addToCart('${product.s}')">
                Thêm vào giỏ
            </button>
        </div>
    `;
    return div;
}
```

#### C. Cập nhật sidebar

```javascript
function buildSidebarCategories() {
    const sidebar = document.querySelector('.sidebar-content');
    
    if (!sidebar || !CATEGORIES) return;
    
    sidebar.innerHTML = '';
    
    CATEGORIES.forEach(category => {
        // Tạo item danh mục cha
        const parentItem = document.createElement('div');
        parentItem.className = 'sidebar-parent-item';
        
        const parentBtn = document.createElement('button');
        parentBtn.className = 'parent-btn';
        parentBtn.innerHTML = `
            <span class="cat-icon"><i class="${category.icon}"></i></span>
            <span class="cat-name">${category.name}</span>
            <span class="cat-count">(${getProductCountForParent(category.name)})</span>
        `;
        
        // Xử lý click trên danh mục cha
        parentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSubcategories(parentItem, category.name);
        });
        
        parentItem.appendChild(parentBtn);
        
        // Tạo container cho danh mục con
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'sidebar-children';
        childrenContainer.style.display = 'none';
        
        // Danh mục con
        category.children.forEach(child => {
            const childItem = document.createElement('a');
            childItem.className = 'sidebar-child-item';
            childItem.href = '#';
            childItem.textContent = child.name;
            
            childItem.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryPath = `${category.name} > ${child.name}`;
                filterAndDisplayProducts(categoryPath);
            });
            
            childrenContainer.appendChild(childItem);
        });
        
        parentItem.appendChild(childrenContainer);
        sidebar.appendChild(parentItem);
    });
}

function toggleSubcategories(parentItem, categoryName) {
    const container = parentItem.querySelector('.sidebar-children');
    const isVisible = container.style.display !== 'none';
    
    container.style.display = isVisible ? 'none' : 'block';
    parentItem.classList.toggle('active', !isVisible);
}

function getProductCountForParent(parentCategory) {
    const products = filterProductsByParentCategory(
        ProductManager.products,
        parentCategory
    );
    return products.length;
}
```

#### D. Hiển thị số lượng sản phẩm (badges)

```javascript
function updateProductCountBadges() {
    const counts = getProductCountByCategory(ProductManager.products);
    
    Object.entries(counts).forEach(([categoryPath, count]) => {
        // Tìm badge tương ứng
        const badge = document.querySelector(
            `[data-category-path="${categoryPath}"] .count-badge`
        );
        
        if (badge) {
            badge.textContent = count;
        }
    });
}
```

#### E. Kiểm tra sản phẩm chưa phân loại

```javascript
function monitorUncategorizedProducts() {
    const uncategorized = getUncategorizedProducts(ProductManager.products);
    
    if (uncategorized.length > 0) {
        console.warn(`⚠️ Cảnh báo: ${uncategorized.length} sản phẩm chưa phân loại`);
        
        // Nếu là admin, hiển thị thông báo
        if (isAdminUser) {
            showAdminAlert(
                `${uncategorized.length} sản phẩm chưa phân loại. Chi tiết trong console.`,
                'warning'
            );
        }
    }
}
```

### Step 4: Cập Nhật CSS (Nếu Cần)

Thêm các style cho categories:

```css
/* Sidebar Categories */
.sidebar-parent-item {
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.parent-btn {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 15px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    transition: background 0.2s;
}

.parent-btn:hover {
    background: #f5f5f5;
}

.parent-btn .cat-icon {
    display: inline-block;
    width: 24px;
    margin-right: 10px;
    font-size: 16px;
}

.parent-btn .cat-count {
    margin-left: auto;
    font-size: 12px;
    color: #999;
}

.sidebar-children {
    padding: 0 15px 10px 40px;
}

.sidebar-child-item {
    display: block;
    padding: 8px 0;
    color: #666;
    text-decoration: none;
    font-size: 13px;
    cursor: pointer;
    transition: color 0.2s;
}

.sidebar-child-item:hover {
    color: #e74c3c;
}

.sidebar-parent-item.active .parent-btn {
    background: #f5f5f5;
    color: #e74c3c;
}

/* Products Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    padding: 15px;
}

.product-card {
    border: 1px solid #eee;
    border-radius: 5px;
    overflow: hidden;
    transition: box-shadow 0.2s;
    cursor: pointer;
}

.product-card:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.product-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-image img {
    max-width: 100%;
    max-height: 100%;
}

.product-info {
    padding: 10px;
}

.product-name {
    margin: 0 0 5px 0;
    font-size: 13px;
    height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.product-price {
    margin: 5px 0;
    font-size: 14px;
    font-weight: bold;
    color: #e74c3c;
}

.btn-add-to-cart {
    width: 100%;
    padding: 8px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    transition: background 0.2s;
}

.btn-add-to-cart:hover {
    background: #c0392b;
}
```

### Step 5: Testing

Thêm đoạn code này vào browser console để test:

```javascript
// Test 1: Kiểm tra hệ thống
console.log("Total products:", ProductManager.products.length);

// Test 2: Lọc sản phẩm PC Gaming
const pcGaming = filterProductsByExactCategory(
    ProductManager.products,
    "PC Song Phương > PC Gaming"
);
console.log("PC Gaming products:", pcGaming.length);

// Test 3: Danh mục con của "Linh Kiện Máy Tính"
const components = getSubCategoriesForParent(
    ProductManager.products,
    "Linh Kiện Máy Tính"
);
console.log("Component subcategories:", components);

// Test 4: Kiểm tra sản phẩm chưa phân loại
const uncategorized = getUncategorizedProducts(ProductManager.products);
console.log("Uncategorized products:", uncategorized.length);

// Test 5: Sinh báo cáo
generateCategoryReport(ProductManager.products);
```

## Performance Tips

1. **Cache kết quả lọc:**
```javascript
const categoryCache = new Map();

function filterProductsByExactCategoryWithCache(products, categoryPath) {
    const key = categoryPath;
    
    if (!categoryCache.has(key)) {
        const result = filterProductsByExactCategory(products, categoryPath);
        categoryCache.set(key, result);
    }
    
    return categoryCache.get(key);
}
```

2. **Lazy load sản phẩm:**
```javascript
function lazyLoadProducts(products, pageSize = 20) {
    let currentPage = 0;
    
    function loadMore() {
        const start = currentPage * pageSize;
        const end = start + pageSize;
        const chunk = products.slice(start, end);
        
        displayProducts(chunk);
        currentPage++;
        
        return end < products.length;
    }
    
    return { loadMore };
}
```

## Troubleshooting

### Sản phẩm không hiển thị?
1. Kiểm tra `ProductManager.products` có data không
2. Chạy `generateCategoryReport()` để xem mapping
3. Kiểm tra categoryPath chính xác

### Performance chậm?
1. Sử dụng caching (xem Performance Tips)
2. Implement pagination
3. Lazy load images

### Mapping không đúng?
1. Chạy `debugShowAllCategories()`
2. Kiểm tra PRODUCT_CATEGORY_MAPPING trong category-product-mapping.js
3. Thêm entry mới nếu cần

## File Reference

```
SP-MOBILE-APP/
├── js/
│   ├── category-product-mapping.js (Chính - Không sửa)
│   ├── category-mapping-examples.js (Helper functions - Optional)
│   ├── app.js (Sửa - Tích hợp theo hướng dẫn)
│   └── ... (other files)
├── CATEGORY_MAPPING_GUIDE.md (API docs)
└── CATEGORY_INTEGRATION_GUIDE.md (File này)
```

## Khôi Phục Nếu Có Lỗi

Nếu gặp lỗi, có thể:

1. Clear cache browser
2. Reset index.html về version trước
3. Xóa category-product-mapping.js nếu cần
4. Reload trang

## Liên Hệ & Hỗ Trợ

Nếu cần giúp đỡ:
- Chạy `generateCategoryReport()` trong console
- Kiểm tra browser developer tools (F12)
- Xem CATEGORY_MAPPING_GUIDE.md để hiểu API
