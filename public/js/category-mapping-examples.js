/**
 * Integration Examples - Tích hợp Category Mapping vào App
 * 
 * Các ví dụ cụ thể về cách sử dụng hệ thống ánh xạ trong thực tế
 */

// ============================================
// 1. LỌCẢN PHẨM KHI CLICK VÀO DANH MỤC
// ============================================

/**
 * Xử lý khi user click vào một danh mục trong sidebar
 * @param {string} categoryPath - Đường dẫn danh mục (ví dụ: "PC Song Phương > PC Gaming")
 */
function onCategoryClick(categoryPath) {
    console.log(`Lọc theo danh mục: ${categoryPath}`);
    
    // Lọc sản phẩm
    const filteredProducts = filterProductsByExactCategory(
        ProductManager.products,
        categoryPath
    );
    
    console.log(`Tìm thấy ${filteredProducts.length} sản phẩm`);
    
    // Hiển thị sản phẩm
    displayFilteredProducts(filteredProducts);
    
    // Đóng sidebar
    closeSidebar();
    
    // Cập nhật tiêu đề
    updatePageTitle(categoryPath);
}

/**
 * Hiển thị danh sách sản phẩm đã lọc
 * @param {Array} products - Danh sách sản phẩm
 */
function displayFilteredProducts(products) {
    const container = document.getElementById('products-container');
    
    if (!container) {
        console.error('Products container không tìm thấy');
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Render products
    if (products.length === 0) {
        container.innerHTML = '<div class="no-products">Không có sản phẩm</div>';
        return;
    }
    
    products.forEach(product => {
        const html = createProductCard(product);
        container.insertAdjacentHTML('beforeend', html);
    });
}

// ============================================
// 2. CẬP NHẬT SIDEBAR ĐỘNG
// ============================================

/**
 * Tạo danh mục con khi user click vào danh mục cha
 * @param {string} parentCategory - Tên danh mục cha
 */
function showSubcategoriesForParent(parentCategory) {
    console.log(`Hiển thị danh mục con của: ${parentCategory}`);
    
    // Lấy danh mục con
    const subcategories = getSubCategoriesForParent(
        ProductManager.products,
        parentCategory
    );
    
    console.log(`Danh mục con: ${subcategories.join(', ')}`);
    
    // Render danh mục con
    renderSubcategoryMenu(parentCategory, subcategories);
}

/**
 * Render menu danh mục con
 * @param {string} parentCategory - Danh mục cha
 * @param {Array} subcategories - Danh sách danh mục con
 */
function renderSubcategoryMenu(parentCategory, subcategories) {
    const container = document.querySelector('.sidebar-submenu');
    
    if (!container) {
        console.error('Submenu container không tìm thấy');
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Thêm nút "Tất cả"
    const allButton = document.createElement('div');
    allButton.className = 'submenu-item';
    allButton.textContent = `Tất cả ${parentCategory}`;
    allButton.onclick = () => {
        const products = filterProductsByParentCategory(
            ProductManager.products,
            parentCategory
        );
        displayFilteredProducts(products);
    };
    container.appendChild(allButton);
    
    // Thêm danh mục con
    subcategories.forEach(subcat => {
        const item = document.createElement('div');
        item.className = 'submenu-item';
        item.textContent = subcat;
        item.onclick = () => {
            const categoryPath = `${parentCategory} > ${subcat}`;
            onCategoryClick(categoryPath);
        };
        container.appendChild(item);
    });
}

// ============================================
// 3. HIỂN THỊ SỐ LƯỢNG SẢN PHẨM
// ============================================

/**
 * Cập nhật badge số lượng sản phẩm trong danh mục
 */
function updateCategoryBadges() {
    const counts = getProductCountByCategory(ProductManager.products);
    
    Object.entries(counts).forEach(([categoryPath, count]) => {
        // Tìm element có data-category matching
        const badge = document.querySelector(
            `[data-category-path="${categoryPath}"] .badge`
        );
        
        if (badge) {
            badge.textContent = count;
        }
    });
}

/**
 * Hiển thị số lượng sản phẩm bên cạnh danh mục cha
 */
function displayParentCategoryCounts() {
    const parentCategories = [
        "PC Song Phương",
        "Máy Tính Trọn Bộ",
        "Laptop - Máy Tính Xách Tay",
        "Linh Kiện Máy Tính",
        "Màn Hình Máy Tính",
        "Gaming Gear-Phím-Chuột",
        "Dịch Vụ PC-Laptop"
    ];
    
    parentCategories.forEach(parent => {
        const products = filterProductsByParentCategory(
            ProductManager.products,
            parent
        );
        
        const countLabel = document.querySelector(
            `[data-parent-category="${parent}"] .product-count`
        );
        
        if (countLabel) {
            countLabel.textContent = `(${products.length})`;
        }
    });
}

// ============================================
// 4. KIỂM TRA VÀ XỬ LÝ SẢN PHẨM CHƯA PHÂN LOẠI
// ============================================

/**
 * Kiểm tra và cảnh báo sản phẩm chưa phân loại
 */
function checkUncategorizedProducts() {
    const uncategorized = getUncategorizedProducts(ProductManager.products);
    
    if (uncategorized.length > 0) {
        console.warn(`⚠️ Cảnh báo: ${uncategorized.length} sản phẩm chưa phân loại!`);
        
        // Hiển thị một số ví dụ
        console.table(
            uncategorized.slice(0, 5).map(p => ({
                SKU: p.s,
                Name: p.n.substring(0, 50),
                Category: p.c
            }))
        );
        
        // Hiển thị notification nếu trong admin mode
        if (isAdminMode) {
            showNotification(
                `${uncategorized.length} sản phẩm chưa phân loại`,
                'warning',
                5000
            );
        }
    }
}

/**
 * Tạo báo cáo chi tiết về phân loại
 */
function generateAndDisplayCategoryReport() {
    console.log("\n╔══════════════════════════════════════════╗");
    console.log("║   PRODUCT CATEGORY MAPPING REPORT        ║");
    console.log("╚══════════════════════════════════════════╝\n");
    
    const products = ProductManager.products;
    const counts = getProductCountByCategory(products);
    const uncategorized = getUncategorizedProducts(products);
    
    // Tổng sản phẩm
    console.log(`📊 Tổng sản phẩm: ${products.length}`);
    
    // Sản phẩm được phân loại
    const categorized = products.length - uncategorized.length;
    const percentage = ((categorized / products.length) * 100).toFixed(2);
    console.log(`✅ Sản phẩm được phân loại: ${categorized} (${percentage}%)`);
    
    // Sản phẩm chưa phân loại
    console.log(`❌ Sản phẩm chưa phân loại: ${uncategorized.length}`);
    
    // Top 10 danh mục
    console.log("\n📌 Top 10 danh mục (theo số lượng sản phẩm):");
    Object.entries(counts)
        .filter(([cat]) => cat !== "Khác")
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([category, count], index) => {
            const bar = '█'.repeat(Math.floor(count / 5));
            console.log(`  ${index + 1}. ${category.padEnd(50)} ${bar} ${count}`);
        });
    
    // Danh mục ít sản phẩm nhất
    console.log("\n📍 Danh mục ít sản phẩm nhất:");
    Object.entries(counts)
        .filter(([cat]) => cat !== "Khác")
        .sort((a, b) => a[1] - b[1])
        .slice(0, 5)
        .forEach(([category, count]) => {
            console.log(`  • ${category}: ${count} sản phẩm`);
        });
}

// ============================================
// 5. TÌM KIẾM NÂNG CAO
// ============================================

/**
 * Tìm kiếm sản phẩm trong một danh mục cụ thể
 * @param {string} query - Từ khóa tìm kiếm
 * @param {string} categoryPath - Danh mục cụ thể (optional)
 * @returns {Array} - Danh sách sản phẩm tìm được
 */
function searchProductsInCategory(query, categoryPath = null) {
    let products = ProductManager.products;
    
    // Lọc theo danh mục nếu được chỉ định
    if (categoryPath) {
        products = filterProductsByExactCategory(products, categoryPath);
    }
    
    // Tìm kiếm
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
        p.n.toLowerCase().includes(lowerQuery) ||
        (p.b && p.b.toLowerCase().includes(lowerQuery)) ||
        p.s.includes(query)
    );
}

/**
 * Advanced search - Tìm kiếm trong danh mục cha
 */
function advancedSearchByParentCategory(query, parentCategory) {
    const products = filterProductsByParentCategory(
        ProductManager.products,
        parentCategory
    );
    
    return searchProductsInCategory(query, null, products);
}

// ============================================
// 6. INIT & STARTUP
// ============================================

/**
 * Khởi tạo hệ thống phân loại khi app load
 */
async function initializeCategorySystem() {
    console.log("🚀 Khởi tạo hệ thống phân loại...");
    
    // Chờ ProductManager load xong
    await ProductManager.init();
    
    // Kiểm tra sản phẩm chưa phân loại
    checkUncategorizedProducts();
    
    // Cập nhật badge số lượng
    updateCategoryBadges();
    
    // Hiển thị số lượng trong danh mục cha
    displayParentCategoryCounts();
    
    // Nếu là dev mode, hiển thị báo cáo
    if (window.isDevelopment) {
        generateAndDisplayCategoryReport();
    }
    
    console.log("✅ Hệ thống phân loại đã sẵn sàng!");
}

// ============================================
// 7. DEBUG HELPERS
// ============================================

/**
 * Helper function để debug - Hiển thị tất cả danh mục và số lượng
 */
function debugShowAllCategories() {
    const counts = getProductCountByCategory(ProductManager.products);
    
    console.group("📁 TẤT CẢ DANH MỤC");
    
    const parentCategories = new Set();
    Object.keys(counts).forEach(path => {
        const parts = path.split(" > ");
        if (parts.length > 0) {
            parentCategories.add(parts[0]);
        }
    });
    
    Array.from(parentCategories).sort().forEach(parent => {
        console.group(`📦 ${parent}`);
        
        Object.entries(counts).forEach(([category, count]) => {
            if (category.startsWith(parent)) {
                const subcat = category.replace(`${parent} > `, "");
                console.log(`  ${subcat}: ${count}`);
            }
        });
        
        console.groupEnd();
    });
    
    console.groupEnd();
}

/**
 * Helper - Tìm sản phẩm bằng SKU và hiển thị category path
 */
function debugFindProductBySkuAndShowCategory(sku) {
    const product = ProductManager.products.find(p => p.s === sku);
    
    if (!product) {
        console.error(`Không tìm thấy sản phẩm với SKU: ${sku}`);
        return;
    }
    
    const categoryPath = getCategoryPath(product.c);
    console.log(`SKU: ${sku}`);
    console.log(`Tên: ${product.n}`);
    console.log(`Category field (c): "${product.c}"`);
    console.log(`Category path: "${categoryPath}"`);
}

/**
 * Helper - Hiển thị mapping từ category field để debug
 */
function debugShowMappingForField(categoryField) {
    const mapped = getCategoryPath(categoryField);
    console.log(`"${categoryField}" -> "${mapped}"`);
    
    // Lấy số lượng sản phẩm
    const count = ProductManager.products.filter(
        p => p.c === categoryField
    ).length;
    console.log(`Số lượng sản phẩm: ${count}`);
}

// ============================================
// EXPORT (nếu cần dùng module)
// ============================================

// Uncomment nếu sử dụng ES6 modules
/*
export {
    onCategoryClick,
    displayFilteredProducts,
    showSubcategoriesForParent,
    renderSubcategoryMenu,
    updateCategoryBadges,
    displayParentCategoryCounts,
    checkUncategorizedProducts,
    generateAndDisplayCategoryReport,
    searchProductsInCategory,
    advancedSearchByParentCategory,
    initializeCategorySystem,
    debugShowAllCategories,
    debugFindProductBySkuAndShowCategory,
    debugShowMappingForField
};
*/
// Đã xóa file này vì không còn sử dụng.
