/**
 * Ánh xạ Sản phẩm -> Danh Mục (Category Product Mapping)
 * Sử dụng để phân loại sản phẩm vào các danh mục phù hợp
 * Dựa trên trường 'c' (category) từ products-lite.json
 * 
 * ĐÃ ĐỒNG BỘ VỚI DATABASE: 71 categories từ products-lite.json
 */

const PRODUCT_CATEGORY_MAPPING = {
    // ========================================
    // PC SONG PHƯƠNG (PC Gaming, PC Văn Phòng, PC AI...)
    // ========================================
    "PC Gaming": "PC Song Phương > PC Gaming",
    "PC Văn Phòng": "PC Song Phương > PC Văn Phòng",
    "PC Khuyến Mãi": "PC Song Phương > PC Khuyến Mãi",
    "Máy tính PC AI": "PC Song Phương > Máy tính PC AI",
    
    // ========================================
    // MÁY TÍNH TRỌN BỘ (Máy Bộ, iGAME...)
    // ========================================
    "Máy Bộ Theo Hãng": "Máy Tính Trọn Bộ > Máy Bộ Theo Hãng",
    "Máy Bộ Theo Nhu Cầu": "Máy Tính Trọn Bộ > Máy Bộ Theo Nhu Cầu",
    "MÁY BỘ iGAME": "Máy Tính Trọn Bộ > Máy Bộ Theo Hãng",
    
    // ========================================
    // LAPTOP - MÁY TÍNH XÁCH TAY
    // ========================================
    "Laptop Theo Hãng": "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng",
    "Laptop Theo Nhu Cầu": "Laptop - Máy Tính Xách Tay > Laptop Theo Nhu Cầu",
    "Laptop Theo Giá": "Laptop - Máy Tính Xách Tay > Laptop Theo Giá",
    "Laptop Intel": "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng",
    
    // ========================================
    // LINH KIỆN MÁY TÍNH (CPU, Main, VGA, Ram, SSD, PSU, Case)
    // ========================================
    "CPU - Bộ vi xử lý": "Linh Kiện Máy Tính > CPU - Bộ vi xử lý",
    "Main - Bo Mạch Chủ": "Linh Kiện Máy Tính > Main - Bo Mạch Chủ",
    "VGA - Card Màn Hình": "Linh Kiện Máy Tính > VGA - Card Màn Hình",
    "Vga Intel": "Linh Kiện Máy Tính > VGA - Card Màn Hình",
    "Ram - Bộ nhớ đệm": "Linh Kiện Máy Tính > Ram - Bộ nhớ đệm",
    "SSD - HDD": "Linh Kiện Máy Tính > SSD - HDD",
    "PSU - Nguồn máy tính": "Linh Kiện Máy Tính > PSU - Nguồn máy tính",
    "Case - Vỏ máy tính": "Linh Kiện Máy Tính > Case - Vỏ máy tính",
    
    // ========================================
    // TẢN NHIỆT - COOLING
    // ========================================
    "Tản Nhiệt Theo Hãng": "Tản Nhiệt - Cooling > Tản Nhiệt Theo Hãng",
    "Tản Nhiệt Khí CPU": "Tản Nhiệt - Cooling > Tản Nhiệt Khí CPU",
    "Tản Nhiệt Nước CPU": "Tản Nhiệt - Cooling > Tản Nhiệt Nước CPU",
    "Fan Thùng Case": "Tản Nhiệt - Cooling > Fan Thùng Case",
    "Phụ Kiện Tản Nhiệt": "Tản Nhiệt - Cooling > Phụ Kiện Tản Nhiệt",
    "Tản nhiệt Cougar": "Tản Nhiệt - Cooling > Tản Nhiệt Theo Hãng",
    
    // ========================================
    // MÀN HÌNH MÁY TÍNH
    // ========================================
    "Màn Hình Theo Hãng": "Màn Hình Máy Tính > Màn Hình Theo Hãng",
    "Màn Hình Theo Nhu Cầu": "Màn Hình Máy Tính > Màn Hình Theo Nhu Cầu",
    "Màn hình HKC": "Màn Hình Máy Tính > Màn Hình Theo Hãng",
    "Tivi - Màn hình TV": "Màn Hình Máy Tính > Màn Hình Theo Nhu Cầu",
    
    // ========================================
    // GAMING GEAR - PHÍM - CHUỘT
    // ========================================
    "Keyboard - Bàn Phím": "Gaming Gear-Phím-Chuột > Keyboard - Bàn Phím",
    "Phím Theo Nhu Cầu": "Gaming Gear-Phím-Chuột > Phím Theo Nhu Cầu",
    "Mouse - Chuột": "Gaming Gear-Phím-Chuột > Mouse - Chuột",
    "Chuột Theo Nhu Cầu": "Gaming Gear-Phím-Chuột > Chuột Theo Nhu Cầu",
    "Headphone - Tai Nghe": "Gaming Gear-Phím-Chuột > Headphone - Tai Nghe",
    "Tai Nghe Theo Nhu Cầu": "Gaming Gear-Phím-Chuột > Tai Nghe Theo Nhu Cầu",
    "Tai Nghe - Phone": "Gaming Gear-Phím-Chuột > Headphone - Tai Nghe",
    "Bàn-Ghế Gaming": "Gaming Gear-Phím-Chuột > Bàn-Ghế Gaming",
    "Máy Chơi Game": "Gaming Gear-Phím-Chuột > Máy Chơi Game",
    
    // ========================================
    // THIẾT BỊ ÂM THANH
    // ========================================
    "Loa Nghe Nhạc": "Thiết Bị Âm Thanh > Loa Nghe Nhạc",
    "Âm Thanh Các Hãng": "Thiết Bị Âm Thanh > Loa Nghe Nhạc",
    
    // ========================================
    // CAMERA AN NINH
    // ========================================
    "Camera Phân Loại": "Camera An Ninh > Camera Phân Loại",
    "Camera Theo Hãng": "Camera An Ninh > Camera Theo Hãng",
    "Camera Theo Nhu Cầu": "Camera An Ninh > Camera Theo Nhu Cầu",
    "Đầu Thu Camera": "Camera An Ninh > Đầu Thu Camera",
    
    // ========================================
    // THIẾT BỊ MẠNG LAN-WIFI
    // ========================================
    "TB Mạng Theo Hãng": "Thiết Bị Mạng Lan-Wifi > TB Mạng Theo Hãng",
    "TB Mạng Khác": "Thiết Bị Mạng Lan-Wifi > TB Mạng Khác",
    "TB Phát Sóng Wifi": "Thiết Bị Mạng Lan-Wifi > TB Phát Sóng Wifi",
    
    // ========================================
    // THIẾT BỊ VĂN PHÒNG
    // ========================================
    "Máy In - Photo": "Thiết Bị Văn Phòng > Máy In - Photo",
    "Máy In Theo Nhu Cầu": "Thiết Bị Văn Phòng > Máy In - Photo",
    "Máy VP Khác": "Thiết Bị Văn Phòng > Máy In - Photo",
    
    // ========================================
    // PHỤ KIỆN PC-LAPTOP-MOBILE
    // ========================================
    "Phụ kiện Laptop": "Phụ Kiện PC-Laptop-Mobile > Phụ kiện Laptop",
    "Phụ kiện Điện thoại": "Phụ Kiện PC-Laptop-Mobile > Phụ kiện Điện thoại",
    "Phụ kiện Máy tính PC": "Phụ Kiện PC-Laptop-Mobile > Phụ kiện Máy tính PC",
    "Phụ Kiện Khác": "Phụ Kiện PC-Laptop-Mobile > Phụ Kiện Khác",
    "Balo": "Phụ Kiện PC-Laptop-Mobile > Phụ kiện Laptop",
    
    // ========================================
    // DỊCH VỤ PC-LAPTOP
    // ========================================
    "Dịch vụ Máy tính PC": "Dịch Vụ PC-Laptop > Dịch vụ Máy tính PC",
    "Dịch vụ Laptop": "Dịch Vụ PC-Laptop > Dịch vụ Laptop",
    "Dịch vụ Camera": "Dịch Vụ PC-Laptop > Dịch vụ Camera",
    "Dịch vụ Phòng Game": "Dịch Vụ PC-Laptop > Dịch vụ Phòng Game",
    "Dịch vụ Mạng Lan-Wifi": "Dịch Vụ PC-Laptop > Dịch vụ Mạng Lan-Wifi",
    "Dịch vụ Máy In": "Dịch Vụ PC-Laptop > Dịch vụ Máy In",
    "Giá Dịch vụ": "Dịch Vụ PC-Laptop > Dịch vụ Máy tính PC",
    
    // ========================================
    // THIẾT BỊ PHÒNG GAME
    // ========================================
    "Linh Kiện Phòng Game": "Thiết Bị Phòng Game > Linh Kiện Phòng Game",
    "Server Game Net": "Thiết Bị Phòng Game > Server Game Net",
    
    // ========================================
    // THƯƠNG HIỆU (Hãng) - ánh xạ theo loại sản phẩm
    // ========================================
    "Apple": "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng",
    "Ajazz": "Gaming Gear-Phím-Chuột > Keyboard - Bàn Phím",
    "Evoxz": "Gaming Gear-Phím-Chuột > Keyboard - Bàn Phím",
    "Philips": "Màn Hình Máy Tính > Màn Hình Theo Hãng",
    
    // ========================================
    // KHÁC & SẢN PHẨM MỚI
    // ========================================
    "Sản phẩm mới": "Sản phẩm mới",
    "Thiết Bị Khác": "Thiết Bị Khác",
    "Khác": "Khác"
};

/**
 * Hàm lấy danh mục phân cấp từ trường 'c' của sản phẩm
 * @param {string} productCategory - Trường 'c' từ sản phẩm (ví dụ: "PC Gaming")
 * @returns {string} - Đường dẫn danh mục (ví dụ: "PC Song Phương > PC Gaming")
 */
function getCategoryPath(productCategory) {
    if (!productCategory) {
        return "Khác";
    }
    
    // Tìm kiếm ánh xạ trực tiếp
    if (PRODUCT_CATEGORY_MAPPING[productCategory]) {
        return PRODUCT_CATEGORY_MAPPING[productCategory];
    }
    
    // Nếu không tìm thấy, trả về "Khác"
    return "Khác";
}

/**
 * Hàm lọc sản phẩm theo danh mục cha
 * @param {Array} products - Danh sách sản phẩm
 * @param {string} parentCategory - Tên danh mục cha (ví dụ: "PC Song Phương")
 * @returns {Array} - Danh sách sản phẩm thuộc danh mục cha
 */
function filterProductsByParentCategory(products, parentCategory) {
    if (!Array.isArray(products)) return [];
    
    return products.filter(product => {
        const path = getCategoryPath(product.c);
        return path.startsWith(parentCategory);
    });
}

/**
 * Hàm lọc sản phẩm theo đường dẫn danh mục hoàn chỉnh
 * @param {Array} products - Danh sách sản phẩm
 * @param {string} categoryPath - Đường dẫn danh mục (ví dụ: "PC Song Phương > PC Gaming")
 * @returns {Array} - Danh sách sản phẩm
 */
function filterProductsByExactCategory(products, categoryPath) {
    if (!Array.isArray(products)) return [];
    
    return products.filter(product => {
        const path = getCategoryPath(product.c);
        return path === categoryPath;
    });
}

/**
 * Hàm lấy tất cả danh mục con của một danh mục cha
 * @param {Array} products - Danh sách sản phẩm
 * @param {string} parentCategory - Tên danh mục cha
 * @returns {Array} - Danh sách danh mục con (unique)
 */
function getSubCategoriesForParent(products, parentCategory) {
    if (!Array.isArray(products)) return [];
    
    const subCategories = new Set();
    
    products.forEach(product => {
        const path = getCategoryPath(product.c);
        if (path.startsWith(parentCategory)) {
            const parts = path.split(" > ");
            if (parts.length > 1) {
                subCategories.add(parts[1]);
            }
        }
    });
    
    return Array.from(subCategories).sort();
}

/**
 * Hàm thống kê số lượng sản phẩm theo danh mục
 * @param {Array} products - Danh sách sản phẩm
 * @returns {Object} - Object chứa số lượng sản phẩm theo danh mục
 */
function getProductCountByCategory(products) {
    if (!Array.isArray(products)) return {};
    
    const counts = {};
    
    products.forEach(product => {
        const path = getCategoryPath(product.c);
        counts[path] = (counts[path] || 0) + 1;
    });
    
    return counts;
}

/**
 * Hàm kiểm tra sản phẩm không được phân loại
 * @param {Array} products - Danh sách sản phẩm
 * @returns {Array} - Danh sách sản phẩm trong danh mục "Khác"
 */
function getUncategorizedProducts(products) {
    if (!Array.isArray(products)) return [];
    
    return products.filter(product => {
        const path = getCategoryPath(product.c);
        return path === "Khác";
    });
}

/**
 * Hàm lấy tất cả các trường category duy nhất từ sản phẩm
 * @param {Array} products - Danh sách sản phẩm
 * @returns {Array} - Danh sách các trường 'c' duy nhất
 */
function getUniqueCategoryFields(products) {
    if (!Array.isArray(products)) return [];
    
    const categories = new Set();
    
    products.forEach(product => {
        if (product.c) {
            categories.add(product.c);
        }
    });
    
    return Array.from(categories).sort();
}

/**
 * Hàm xuất báo cáo phân loại
 * Giúp kiểm tra xem có sản phẩm nào không được phân loại đúng
 */
function generateCategoryReport(products) {
    console.log("=== PRODUCT CATEGORY REPORT ===\n");
    
    // Tổng sản phẩm
    console.log("Total Products:", products.length);
    
    // Tổng sản phẩm theo danh mục
    console.log("\n--- Products by Category ---");
    const counts = getProductCountByCategory(products);
    Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, count]) => {
            console.log(`${category}: ${count}`);
        });
    
    // Sản phẩm không được phân loại
    const uncategorized = getUncategorizedProducts(products);
    console.log(`\n--- Uncategorized Products: ${uncategorized.length} ---`);
    if (uncategorized.length > 0) {
        uncategorized.slice(0, 10).forEach(product => {
            console.log(`- SKU: ${product.s}, Category: "${product.c}", Name: ${product.n}`);
        });
        if (uncategorized.length > 10) {
            console.log(`... and ${uncategorized.length - 10} more`);
        }
    }
    
    // Các trường category duy nhất
    console.log("\n--- Unique Category Fields ---");
    const uniqueCategories = getUniqueCategoryFields(products);
    console.log(`Total unique fields: ${uniqueCategories.length}`);
    uniqueCategories.forEach(cat => {
        const mapped = PRODUCT_CATEGORY_MAPPING[cat] || "NOT MAPPED";
        console.log(`"${cat}" -> "${mapped}"`);
    });
}
