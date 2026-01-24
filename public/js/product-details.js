/**
 * Product Details Page JavaScript
 * Song Phương - Chi tiết sản phẩm
 * Tích hợp với ProductManager để load 9,926 sản phẩm từ database
 */

// Sample Product Data (Fallback khi ProductManager chưa load xong)
const sampleProducts = {
    "1": {
        id: 1,
        title: "Bàn Phím Cơ Machenike K500B-B87 (TKL 87 phím, Rainbow, Red/Blue Switch, Đen)",
        sku: "132433",
        warranty: "12 tháng",
        rating: 5,
        originalPrice: 689000,
        salePrice: 499000,
        images: [
            "https://product.hstatic.net/200000722513/product/ban-phim-co-machenike-k500b-b87_1_grande.jpg",
            "https://product.hstatic.net/200000722513/product/ban-phim-co-machenike-k500b-b87_2_grande.jpg",
            "https://product.hstatic.net/200000722513/product/ban-phim-co-machenike-k500b-b87_3_grande.jpg",
            "https://product.hstatic.net/200000722513/product/ban-phim-co-machenike-k500b-b87_4_grande.jpg",
            "https://product.hstatic.net/200000722513/product/ban-phim-co-machenike-k500b-b87_5_grande.jpg"
        ],
        shortDescription: [
            "Bàn Phím Cơ Machenike K500B-B87",
            "Thương hiệu: Machenike",
            "Kiểu: Bàn phím cơ",
            "Kết nối: USB",
            "Kiểu kết nối: Có dây",
            "Layout: TKL 87 phím",
            "Switch: Red/Blue Switch",
            "LED: Rainbow RGB"
        ],
        specifications: [
            { label: "Thương hiệu", value: "Machenike" },
            { label: "Model", value: "K500B-B87" },
            { label: "Loại bàn phím", value: "Bàn phím cơ" },
            { label: "Layout", value: "TKL 87 phím" },
            { label: "Switch", value: "Red/Blue Switch" },
            { label: "Kết nối", value: "USB có dây" },
            { label: "LED", value: "Rainbow RGB" },
            { label: "Màu sắc", value: "Đen" },
            { label: "Kích thước", value: "355 x 135 x 40mm" },
            { label: "Trọng lượng", value: "850g" }
        ],
        fullDescription: `
            <h3>Giới thiệu Bàn Phím Cơ Machenike K500B-B87</h3>
            <p>Bàn Phím Cơ Machenike K500B-B87 là sự lựa chọn hoàn hảo cho game thủ và người dùng văn phòng yêu thích trải nghiệm gõ phím cơ học chất lượng cao với mức giá phải chăng.</p>
            
            <h3>Thiết kế TKL 87 phím gọn gàng</h3>
            <p>Với thiết kế TKL (Tenkeyless) 87 phím, bàn phím loại bỏ phần numpad giúp tiết kiệm không gian bàn làm việc, đồng thời cho phép di chuột thoải mái hơn khi chơi game.</p>
            
            <h3>Switch cơ học chất lượng</h3>
            <p>Được trang bị switch Red/Blue với độ bền cao lên đến 50 triệu lần nhấn, mang lại cảm giác gõ chính xác và phản hồi tốt.</p>
            
            <h3>LED Rainbow RGB</h3>
            <p>Hệ thống đèn LED Rainbow RGB tạo hiệu ứng ánh sáng đa màu sắc, làm nổi bật góc làm việc và gaming của bạn.</p>
            
            <h3>Tính năng nổi bật</h3>
            <ul>
                <li>Switch cơ học Red/Blue độ bền 50 triệu lần nhấn</li>
                <li>LED Rainbow RGB đẹp mắt</li>
                <li>Thiết kế TKL 87 phím gọn gàng</li>
                <li>Kết nối USB có dây ổn định</li>
                <li>Chân đế có thể điều chỉnh độ nghiêng</li>
                <li>Keycap chất lượng cao, chống mòn</li>
            </ul>
        `,
        reviews: [
            {
                name: "Nguyễn Văn A",
                date: "15/12/2025",
                rating: 5,
                content: "Bàn phím rất đẹp, gõ êm, LED sáng đẹp. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop tiếp!"
            },
            {
                name: "Trần Thị B",
                date: "10/12/2025",
                rating: 5,
                content: "Mình dùng để làm việc và chơi game đều ổn. Switch Red rất êm, không gây ồn. Recommend cho mọi người!"
            },
            {
                name: "Lê Văn C",
                date: "05/12/2025",
                rating: 4,
                content: "Bàn phím đẹp, giá tốt. Chỉ tiếc là không có phần mềm điều khiển LED riêng."
            }
        ],
        avgRating: 4.8,
        totalReviews: 12
    },
    "2": {
        id: 2,
        title: "RAM Adata XPG D35G 16GB DDR5 5600MHz RGB",
        sku: "145678",
        warranty: "36 tháng",
        rating: 5,
        originalPrice: 1450000,
        salePrice: 1250000,
        images: [
            "https://product.hstatic.net/200000722513/product/ram-adata-xpg-d35g-16gb-ddr5-5600mhz-rgb_1_e81a2113b38e4ef99e13c84a0c95ed72_grande.png"
        ],
        shortDescription: [
            "RAM Adata XPG D35G 16GB",
            "Thương hiệu: Adata",
            "Dung lượng: 16GB",
            "Loại RAM: DDR5",
            "Bus: 5600MHz",
            "LED: RGB"
        ],
        specifications: [
            { label: "Thương hiệu", value: "Adata" },
            { label: "Model", value: "XPG D35G" },
            { label: "Dung lượng", value: "16GB" },
            { label: "Loại RAM", value: "DDR5" },
            { label: "Bus", value: "5600MHz" },
            { label: "LED", value: "RGB" },
            { label: "Điện áp", value: "1.25V" }
        ],
        fullDescription: `
            <h3>RAM Adata XPG D35G 16GB DDR5 5600MHz RGB</h3>
            <p>RAM DDR5 thế hệ mới với tốc độ cao và LED RGB đẹp mắt, hoàn hảo cho các hệ thống gaming và workstation hiệu năng cao.</p>
            
            <h3>Hiệu năng DDR5 vượt trội</h3>
            <p>Với bus 5600MHz, RAM mang lại băng thông và tốc độ truyền dữ liệu vượt trội so với DDR4, giúp tăng hiệu năng hệ thống đáng kể.</p>
            
            <h3>Thiết kế LED RGB</h3>
            <p>Hệ thống đèn LED RGB tích hợp tạo hiệu ứng ánh sáng đẹp mắt, đồng bộ với các phần mềm điều khiển LED phổ biến.</p>
        `,
        reviews: [
            {
                name: "Phạm Văn D",
                date: "20/12/2025",
                rating: 5,
                content: "RAM chạy rất ổn định, LED đẹp. Giá tốt so với các hãng khác!"
            }
        ],
        avgRating: 4.5,
        totalReviews: 8
    },
    "3": {
        id: 3,
        title: "CPU Intel Core i7-14700K 20 Cores",
        sku: "156789",
        warranty: "36 tháng",
        rating: 5,
        originalPrice: 9500000,
        salePrice: null,
        images: [
            "https://product.hstatic.net/200000722513/product/cpu-intel-core-i7-14700k_1_e76e83e4c0a84f82ba16bb15ae3f7ec4_grande.png"
        ],
        shortDescription: [
            "CPU Intel Core i7-14700K",
            "Thương hiệu: Intel",
            "Số nhân: 20 Cores (8P + 12E)",
            "Số luồng: 28 Threads",
            "Xung nhịp cơ bản: 3.4GHz",
            "Xung nhịp Turbo: 5.6GHz",
            "Socket: LGA 1700",
            "TDP: 125W"
        ],
        specifications: [
            { label: "Thương hiệu", value: "Intel" },
            { label: "Model", value: "Core i7-14700K" },
            { label: "Thế hệ", value: "14th Gen Raptor Lake Refresh" },
            { label: "Số nhân", value: "20 (8P + 12E)" },
            { label: "Số luồng", value: "28" },
            { label: "Xung cơ bản", value: "3.4GHz" },
            { label: "Xung Turbo", value: "5.6GHz" },
            { label: "Cache", value: "33MB" },
            { label: "Socket", value: "LGA 1700" },
            { label: "TDP", value: "125W" }
        ],
        fullDescription: `
            <h3>Intel Core i7-14700K - Hiệu năng mạnh mẽ</h3>
            <p>CPU Intel Core i7-14700K thuộc thế hệ 14 Raptor Lake Refresh, mang đến hiệu năng vượt trội cho gaming và các tác vụ đa nhiệm nặng.</p>
            
            <h3>Kiến trúc lai độc đáo</h3>
            <p>Với 8 nhân hiệu năng (P-Cores) và 12 nhân tiết kiệm (E-Cores), CPU cân bằng hoàn hảo giữa hiệu năng cao và tiết kiệm điện năng.</p>
            
            <h3>Xung nhịp Turbo 5.6GHz</h3>
            <p>Khả năng Turbo lên đến 5.6GHz giúp đáp ứng mọi tác vụ đòi hỏi hiệu năng đơn nhân cao.</p>
        `,
        reviews: [],
        avgRating: 4.9,
        totalReviews: 15
    },
    "4": {
        id: 4,
        title: "SSD Samsung 990 Pro 2TB NVMe Gen4",
        sku: "167890",
        warranty: "60 tháng",
        rating: 5,
        originalPrice: 3690000,
        salePrice: 3290000,
        images: [
            "https://product.hstatic.net/200000722513/product/ssd-samsung-990-pro-2tb-nvme-gen4_1_f7a55fd6fd584d4f8d5a8d40e93e28e8_grande.png"
        ],
        shortDescription: [
            "SSD Samsung 990 Pro 2TB",
            "Thương hiệu: Samsung",
            "Dung lượng: 2TB",
            "Chuẩn kết nối: NVMe PCIe Gen4",
            "Tốc độ đọc: 7,450 MB/s",
            "Tốc độ ghi: 6,900 MB/s",
            "Form factor: M.2 2280"
        ],
        specifications: [
            { label: "Thương hiệu", value: "Samsung" },
            { label: "Model", value: "990 Pro" },
            { label: "Dung lượng", value: "2TB" },
            { label: "Chuẩn kết nối", value: "NVMe PCIe 4.0 x4" },
            { label: "Tốc độ đọc", value: "7,450 MB/s" },
            { label: "Tốc độ ghi", value: "6,900 MB/s" },
            { label: "Form Factor", value: "M.2 2280" },
            { label: "NAND", value: "Samsung V-NAND 3-bit MLC" }
        ],
        fullDescription: `
            <h3>Samsung 990 Pro - Ổ SSD PCIe 4.0 hàng đầu</h3>
            <p>Samsung 990 Pro là ổ SSD NVMe Gen4 flagship của Samsung, mang đến tốc độ đọc ghi nhanh nhất trong phân khúc.</p>
            
            <h3>Tốc độ siêu nhanh</h3>
            <p>Với tốc độ đọc lên đến 7,450 MB/s và ghi 6,900 MB/s, 990 Pro là lựa chọn hoàn hảo cho gaming và các tác vụ chuyên nghiệp.</p>
        `,
        reviews: [],
        avgRating: 4.7,
        totalReviews: 23
    },
    "5": {
        id: 5,
        title: "RAM Corsair Vengeance RGB 32GB DDR5 6000MHz",
        sku: "178901",
        warranty: "Lifetime",
        rating: 4,
        originalPrice: 2390000,
        salePrice: 2150000,
        images: [
            "https://product.hstatic.net/200000722513/product/ram-corsair-vengeance-rgb-32gb-ddr5-6000mhz_1_c5c32e45b02c44c8b8e5a7b6c5e55d22_grande.png"
        ],
        shortDescription: [
            "RAM Corsair Vengeance RGB 32GB (2x16GB)",
            "Thương hiệu: Corsair",
            "Dung lượng: 32GB (2x16GB)",
            "Loại RAM: DDR5",
            "Bus: 6000MHz",
            "LED: RGB",
            "Bảo hành: Trọn đời"
        ],
        specifications: [
            { label: "Thương hiệu", value: "Corsair" },
            { label: "Model", value: "Vengeance RGB" },
            { label: "Dung lượng", value: "32GB (2x16GB)" },
            { label: "Loại RAM", value: "DDR5" },
            { label: "Bus", value: "6000MHz" },
            { label: "LED", value: "RGB" },
            { label: "Timing", value: "CL36" },
            { label: "Điện áp", value: "1.35V" }
        ],
        fullDescription: `
            <h3>Corsair Vengeance RGB DDR5</h3>
            <p>RAM DDR5 hiệu năng cao từ Corsair với LED RGB và khả năng ép xung tuyệt vời.</p>
        `,
        reviews: [],
        avgRating: 4.6,
        totalReviews: 18
    }
};

/**
 * Chuyển đổi sản phẩm từ ProductManager sang format hiển thị
 */
function convertToDisplayFormat(product) {
    // Tạo placeholder image dựa trên danh mục
    const categoryImages = {
        'CPU - Bộ vi xử lý': 'https://product.hstatic.net/200000722513/product/cpu-placeholder_grande.png',
        'VGA - Card Màn Hình': 'https://product.hstatic.net/200000722513/product/vga-placeholder_grande.png',
        'Ram - Bộ nhớ đệm': 'https://product.hstatic.net/200000722513/product/ram-placeholder_grande.png',
        'Main - Bo Mạch Chủ': 'https://product.hstatic.net/200000722513/product/mainboard-placeholder_grande.png',
        'SSD - HDD': 'https://product.hstatic.net/200000722513/product/ssd-placeholder_grande.png',
        'default': '../icons/product-default-logo.jpg'
    };
    
    const placeholderImage = categoryImages[product.category] || categoryImages['default'];
    
    // Parse short description từ HTML - giữ nguyên HTML
    let shortDescHTML = '';
    if (product.shortDesc) {
        // Dùng trực tiếp HTML từ database
        shortDescHTML = product.shortDesc;
    } else {
        // Fallback nếu không có shortDesc
        const items = [
            product.title,
            product.brand ? `Thương hiệu: ${product.brand}` : null,
            product.category ? `Danh mục: ${product.category}` : null,
            product.subCategory ? `Loại: ${product.subCategory}` : null,
        ].filter(item => item);
        shortDescHTML = '<ul>' + items.map(item => `<li>${item}</li>`).join('') + '</ul>';
    }
    
    // Tạo specifications từ thông tin có sẵn
    const specs = [];
    if (product.brand) specs.push({ label: 'Thương hiệu', value: product.brand });
    if (product.category) specs.push({ label: 'Danh mục', value: product.category });
    if (product.subCategory) specs.push({ label: 'Loại sản phẩm', value: product.subCategory });
    specs.push({ label: 'SKU', value: product.sku });
    if (product.onSale) specs.push({ label: 'Khuyến mãi', value: `Giảm ${product.discountPercent}%` });
    
    // Sử dụng fullDesc từ database hoặc tạo mặc định
    let fullDescHTML = '';
    if (product.fullDesc) {
        // Dùng trực tiếp HTML từ database
        fullDescHTML = product.fullDesc;
    } else {
        // Fallback
        fullDescHTML = `
            <h3>${product.title}</h3>
            <p>Sản phẩm chính hãng từ ${product.brand || 'Song Phương'}.</p>
            <p><strong>Danh mục:</strong> ${product.category || 'Linh kiện máy tính'}</p>
            ${product.subCategory ? `<p><strong>Phân loại:</strong> ${product.subCategory}</p>` : ''}
            <p>Vui lòng liên hệ để được tư vấn chi tiết về sản phẩm.</p>
        `;
    }
    
    return {
        id: product.id,
        title: product.title || product.name,
        sku: product.sku,
        warranty: '12 tháng', // Mặc định
        rating: 5, // Auto 5 sao cho mọi sản phẩm
        originalPrice: product.originalPrice || product.rp || 0,
        salePrice: product.salePrice || product.sp || null,
        images: [placeholderImage],
        shortDescriptionHTML: shortDescHTML, // HTML gốc
        specifications: specs,
        fullDescription: fullDescHTML, // HTML gốc
        reviews: [
            {
                name: 'Khách hàng Song Phương',
                date: new Date().toLocaleDateString('vi-VN'),
                rating: 5,
                content: 'Sản phẩm chất lượng, giá tốt. Đánh giá 5 sao!'
            }
        ],
        avgRating: 5.0,
        totalReviews: 1, // Auto 1 đánh giá 5 sao
        // Giữ lại thông tin gốc
        _original: product
    };
}

// Global variables
let currentProduct = null;
let selectedRating = 5;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initProductPage();
    setupStarSelect();
});

// Initialize product page - đợi ProductManager load xong
async function initProductPage() {
    // Hiện loading
    showLoading();
    
    try {
        // Đợi ProductManager sẵn sàng
        if (window.ProductManager && !ProductManager.isLoaded) {
            await ProductManager.init();
        }
        
        // Load sản phẩm (await vì là async function)
        await loadProductDetails();
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        hideLoading();
        showErrorPage('Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại.');
    }
}

// Hiển thị trang lỗi
function showErrorPage(message) {
    const container = document.querySelector('.product-details-container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 50px; color: #e74c3c; margin-bottom: 15px;"></i>
                <h2 style="color: #666;">Có lỗi xảy ra</h2>
                <p style="color: #888;">${message}</p>
                <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #2e308a; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                    Thử lại
                </button>
                <button onclick="goBack()" style="margin-top: 15px; padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Quay lại
                </button>
            </div>
        `;
    }
}

// Get product ID or SKU from URL
function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    const sku = urlParams.get('sku');
    const productId = urlParams.get('productId');
    const id = urlParams.get('id');
    
    const result = sku || productId || id || '1';
    
    console.log('=== getProductId Debug ===');
    console.log('Full URL:', window.location.href);
    console.log('Search params:', window.location.search);
    console.log('sku param:', sku);
    console.log('productId param:', productId);
    console.log('id param:', id);
    console.log('Final result:', result);
    
    return result;
}

// Hiển thị loading
function showLoading() {
    const container = document.querySelector('.product-details-container');
    if (container) {
        // Ẩn nội dung chính
        container.style.opacity = '0.3';
        container.style.pointerEvents = 'none';
        
        // Tạo overlay loading nếu chưa có
        let loadingOverlay = document.getElementById('productLoadingOverlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'productLoadingOverlay';
            loadingOverlay.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                text-align: center;
            `;
            loadingOverlay.innerHTML = `
                <div style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #2e308a; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p style="color: #666;">Đang tải sản phẩm...</p>
                <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
            `;
            document.body.appendChild(loadingOverlay);
        }
    }
}

// Ẩn loading
function hideLoading() {
    const container = document.querySelector('.product-details-container');
    if (container) {
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
    }
    
    const loadingOverlay = document.getElementById('productLoadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Load product details - tích hợp ProductManager
async function loadProductDetails() {
    const productId = getProductId();
    console.log('=== loadProductDetails ===');
    console.log('🔍 Đang tìm sản phẩm với ID/SKU:', productId);
    
    // Ưu tiên tìm từ ProductManager (database 9,926 sản phẩm)
    if (window.ProductManager && ProductManager.isLoaded) {
        console.log('ProductManager available with', ProductManager.products.length, 'products');
        
        // Thử tìm theo SKU trước
        let productBase = ProductManager.getProductBySku(productId);
        console.log('Search by SKU result:', productBase ? `Found: ${productBase.title}` : 'Not found');
        
        // Nếu không tìm thấy theo SKU, thử tìm theo ID
        if (!productBase) {
            productBase = ProductManager.getProductById(productId);
            console.log('Search by ID result:', productBase ? `Found: ${productBase.title}` : 'Not found');
        }
        
        // Nếu tìm thấy, chuyển đổi và hiển thị ngay
        if (productBase) {
            console.log('✅ Tìm thấy sản phẩm trong database:');
            console.log('  - SKU:', productBase.sku);
            console.log('  - Title:', productBase.title);
            console.log('  - Price:', productBase.displayPrice);
            
            // Hiển thị ngay với thông tin cơ bản
            currentProduct = convertToDisplayFormat(productBase);
            renderProductPage();
            
            // Lazy load mô tả chi tiết (background, không block UI)
            loadDetailedDescription(productBase.sku);
            return;
        } else {
            console.warn('⚠️ Không tìm thấy sản phẩm trong ProductManager');
        }
    } else {
        console.warn('⚠️ ProductManager not available or not loaded');
    }
    
    // Fallback: tìm trong sampleProducts nếu không có trong database
    if (!currentProduct) {
        console.log('Trying fallback to sampleProducts...');
        currentProduct = sampleProducts[productId];
        if (currentProduct) {
            console.log('✅ Found in sampleProducts:', currentProduct.title);
            renderProductPage();
            return;
        }
    }
    
    // Không tìm thấy sản phẩm
    console.error('❌ Product not found anywhere!');
    document.querySelector('.product-details-container').innerHTML = `
        <div style="text-align: center; padding: 50px 20px;">
            <i class="fas fa-exclamation-circle" style="font-size: 50px; color: #ccc; margin-bottom: 15px;"></i>
            <h2 style="color: #666;">Không tìm thấy sản phẩm</h2>
            <p style="color: #888;">Sản phẩm với ID/SKU "${productId}" không tồn tại trong hệ thống.</p>
            <p style="color: #888; font-size: 13px; margin-top: 10px;">Tổng sản phẩm trong database: ${ProductManager?.products?.length || 0}</p>
            <button onclick="goBack()" style="margin-top: 15px; padding: 10px 20px; background: #2e308a; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Quay lại trang chủ
            </button>
        </div>
    `;
}

// Lazy load mô tả chi tiết (không block UI)
async function loadDetailedDescription(sku) {
    try {
        const details = await ProductManager.loadProductDetails(sku);
        if (details) {
            // Cập nhật mô tả nếu load được
            if (details.sd) {
                const shortDescList = parseShortDescription(details.sd);
                if (shortDescList.length > 0) {
                    currentProduct.shortDescription = shortDescList;
                    loadShortDescription();
                }
            }
            if (details.fd) {
                const cleanHTML = sanitizeFullHTML(details.fd);
                currentProduct.fullDescription = cleanHTML;
                const fullDescEl = document.getElementById('productFullDescription');
                if (fullDescEl) {
                    fullDescEl.innerHTML = cleanHTML;
                }
            }
        }
    } catch (error) {
        console.log('Không thể tải mô tả chi tiết:', error);
        // Không sao, tiếp tục với thông tin cơ bản
    }
}

// Parse short description từ HTML
function parseShortDescription(htmlString) {
    if (!htmlString) return [];
    const liMatches = htmlString.match(/<li[^>]*>([^<]*)<\/li>/gi);
    if (liMatches) {
        return liMatches.map(li => li.replace(/<[^>]*>/g, '').trim()).filter(text => text);
    }
    const cleaned = htmlString.replace(/<[^>]*>/g, '\n').trim();
    return cleaned.split('\n').map(s => s.trim()).filter(s => s && s.length > 0);
}

// Làm sạch HTML mô tả đầy đủ từ CSV/Database (giữ link ảnh, cấu trúc HTML)
function sanitizeFullHTML(raw) {
    if (!raw) return '';
    let html = String(raw);
    
    // 1. Sửa dấu "" -> " do CSV escape trong thuộc tính (href="", src="", style="", v.v.)
    html = html.replace(/""/g, '"');
    
    // 2. Xóa \r literal nếu có
    html = html.replace(/\\r/g, '');
    
    // 3. Kiểm tra xem HTML có cấu trúc (thẻ block/inline) hay chỉ là text thuần
    const hasHTMLTags = /<(p|h[1-6]|ul|ol|li|div|table|br|a|img|span|strong|em)\b/i.test(html);
    
    if (hasHTMLTags) {
        // HTML có cấu trúc: \n chỉ là line separator trong CSV, xóa bỏ
        // Nhưng giữ lại khoảng cách giữa các đoạn văn bản bằng cách thay \n\n thành <br><br>
        // và \n đơn thành khoảng trắng (để không dính chữ)
        html = html.replace(/\\n\\n/g, '<br><br>');  // 2 dòng trống -> xuống 2 dòng
        html = html.replace(/\\n/g, ' ');            // 1 dòng -> khoảng trắng
        html = html.replace(/\r?\n/g, '');           // Xóa newline thật (từ file)
    } else {
        // Text thuần: chuyển \n thành <br> để giữ xuống dòng
        html = html.replace(/\\n/g, '<br>');
        html = html.replace(/\r?\n/g, '<br>');
    }
    
    // 4. Dọn dẹp khoảng trắng thừa (nhiều space liên tiếp -> 1 space)
    html = html.replace(/  +/g, ' ');
    
    // 5. Xóa khoảng trắng trước/sau thẻ block để tránh space thừa
    html = html.replace(/\s*(<\/?(?:p|h[1-6]|ul|ol|li|div|table|tr|td|th|br)[^>]*>)\s*/gi, '$1');
    
    return html.trim();
}

// Render trang sản phẩm
function renderProductPage() {
    // Kiểm tra currentProduct tồn tại
    if (!currentProduct) {
        console.error('❌ currentProduct is null');
        showErrorPage('Không tìm thấy thông tin sản phẩm');
        return;
    }
    
    // Set page title
    document.title = currentProduct.title + " | Song Phương";
    
    // Load images
    loadProductImages();
    
    // Load product info
    const titleEl = document.getElementById('productTitle');
    const skuEl = document.getElementById('productSku');
    const warrantyEl = document.getElementById('productWarranty');
    
    if (titleEl) titleEl.textContent = currentProduct.title;
    if (skuEl) skuEl.textContent = currentProduct.sku;
    if (warrantyEl) warrantyEl.textContent = currentProduct.warranty;
    
    // Load rating
    loadProductRating();
    
    // Load short description
    loadShortDescription();
    
    // Load prices
    loadPrices();
    
    // Load specifications
    loadSpecifications();
    
    // Load full description
    const fullDescEl = document.getElementById('productFullDescription');
    if (fullDescEl) {
        const sourceHTML = currentProduct.fullDescription || '<p>Thông tin chi tiết đang cập nhật...</p>';
        const cleanHTML = sanitizeFullHTML(sourceHTML);
        fullDescEl.innerHTML = cleanHTML;
    }
    
    // Load reviews
    loadReviews();
    
    // Ẩn loading sau khi render xong
    hideLoading();
}

// Load product images
function loadProductImages() {
    const mainImage = document.getElementById('mainProductImage');
    
    // Kiểm tra element tồn tại
    if (!mainImage) {
        console.warn('⚠️ Không tìm thấy mainProductImage element');
        return;
    }
    
    // Xác định đường dẫn ảnh
    let imageSrc = '../icons/product-default-logo.jpg'; // Ảnh mặc định
    
    // Nếu có ảnh từ database, dùng ảnh đó
    if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
        imageSrc = currentProduct.images[0];
    }
    
    // Set main image
    mainImage.src = imageSrc;
    mainImage.alt = currentProduct ? currentProduct.title : 'Sản phẩm';
    mainImage.onerror = function() {
        // Nếu load ảnh lỗi, dùng ảnh mặc định
        this.src = '../icons/product-default-logo.jpg';
    };
    
    // Không load thumbnails - bỏ phần gallery
    const thumbnailGallery = document.getElementById('thumbnailGallery');
    if (thumbnailGallery) {
        thumbnailGallery.innerHTML = ''; // Xóa thumbnails
        thumbnailGallery.style.display = 'none'; // Ẩn gallery
    }
}

// Select thumbnail (không dùng nữa nhưng giữ lại để tránh lỗi)
function selectThumbnail(index) {
    // Không làm gì vì không có thumbnails
}

// Load product rating stars
function loadProductRating() {
    const ratingContainer = document.getElementById('productRating');
    if (!ratingContainer) {
        console.warn('⚠️ Không tìm thấy productRating element');
        return;
    }
    
    ratingContainer.innerHTML = '';
    
    const rating = currentProduct ? currentProduct.rating || 5 : 5;
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        if (i > rating) {
            star.classList.add('empty');
        }
        ratingContainer.appendChild(star);
    }
}

// Load short description bullets
function loadShortDescription() {
    const bulletsContainer = document.getElementById('descriptionBullets');
    if (!bulletsContainer) {
        console.warn('⚠️ Không tìm thấy descriptionBullets element');
        return;
    }
    
    // Render HTML trực tiếp từ database và clean \n
    if (currentProduct && currentProduct.shortDescriptionHTML) {
        // Loại bỏ \n literal và khoảng trắng thừa
        let cleanHTML = currentProduct.shortDescriptionHTML
            .replace(/\\n/g, '')  // Xóa \n literal
            .replace(/\n/g, '')   // Xóa newline thật
            .trim();
        bulletsContainer.innerHTML = cleanHTML;
    } else {
        bulletsContainer.innerHTML = '<li>Thông tin sản phẩm đang cập nhật...</li>';
    }
}

// Toggle description expand/collapse
function toggleDescription() {
    const bullets = document.getElementById('descriptionBullets');
    const btn = document.getElementById('expandDescBtn');
    const btnText = document.getElementById('expandBtnText');
    const btnIcon = document.getElementById('expandBtnIcon');
    
    bullets.classList.toggle('expanded');
    btn.classList.toggle('expanded');
    
    if (bullets.classList.contains('expanded')) {
        btnText.textContent = 'THU GỌN';
    } else {
        btnText.textContent = 'XEM THÊM';
    }
}

// Load prices
function loadPrices() {
    const originalPriceEl = document.getElementById('originalPrice');
    const salePriceEl = document.getElementById('salePrice');
    const salePriceRow = document.getElementById('salePriceRow');
    
    if (!originalPriceEl) {
        console.warn('⚠️ Không tìm thấy price elements');
        return;
    }
    
    if (currentProduct.salePrice && currentProduct.salePrice < currentProduct.originalPrice) {
        // Has sale price
        originalPriceEl.textContent = formatPrice(currentProduct.originalPrice);
        originalPriceEl.classList.remove('no-sale');
        if (salePriceEl) salePriceEl.textContent = formatPrice(currentProduct.salePrice);
        if (salePriceRow) salePriceRow.style.display = 'flex';
    } else {
        // No sale price
        originalPriceEl.textContent = formatPrice(currentProduct.originalPrice);
        originalPriceEl.classList.add('no-sale');
        if (salePriceRow) salePriceRow.style.display = 'none';
    }
}

// Format price
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' đ';
}

// Load specifications
function loadSpecifications() {
    const specsTable = document.getElementById('specsTable');
    if (!specsTable) {
        console.warn('⚠️ Không tìm thấy specsTable element');
        return;
    }
    
    specsTable.innerHTML = '';
    
    if (currentProduct && currentProduct.specifications && currentProduct.specifications.length > 0) {
        currentProduct.specifications.forEach(spec => {
            const row = document.createElement('div');
            row.className = 'spec-row';
            row.innerHTML = `
                <div class="spec-label">${spec.label}</div>
                <div class="spec-value">${spec.value}</div>
            `;
            specsTable.appendChild(row);
        });
    }
}

// Load reviews
function loadReviews() {
    // Update rating summary
    const avgRatingEl = document.getElementById('avgRating');
    const totalReviewsEl = document.getElementById('totalReviews');
    
    if (avgRatingEl && currentProduct && currentProduct.avgRating) {
        avgRatingEl.textContent = currentProduct.avgRating;
    }
    if (totalReviewsEl && currentProduct && currentProduct.totalReviews) {
        totalReviewsEl.textContent = currentProduct.totalReviews + ' đánh giá';
    }
    
    // Load review list
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) {
        console.warn('⚠️ Không tìm thấy reviewsList element');
        return;
    }
    
    reviewsList.innerHTML = '';
    
    if (!currentProduct || !currentProduct.reviews || currentProduct.reviews.length === 0) {
        reviewsList.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #888;">
                <i class="fas fa-comment-slash" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
        `;
        return;
    }
    
    currentProduct.reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += `<i class="fas fa-star${i > review.rating ? ' empty' : ''}"></i>`;
        }
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <span class="reviewer-name">${review.name}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-stars">
                    ${starsHtml}
                </div>
            </div>
            <div class="review-content">${review.content}</div>
        `;
        
        reviewsList.appendChild(reviewItem);
    });
}

// Quantity functions
// Simple cart stored in localStorage
function getCart() {
    try {
        const raw = localStorage.getItem('sp_cart');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('sp_cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;
    const cart = getCart();
    const total = cart.reduce((s, item) => s + (item.qty || 0), 0);
    badge.textContent = total;
}

function addToCartById(productId, qty = 1) {
    const prod = sampleProducts[String(productId)] || currentProduct;
    if (!prod) {
        alert('Không tìm thấy sản phẩm để thêm vào giỏ hàng.');
        return;
    }

    const cart = getCart();
    const existing = cart.find(i => i.id === prod.id);
    const price = (prod.salePrice && prod.salePrice < prod.originalPrice) ? prod.salePrice : prod.originalPrice;

    if (existing) {
        existing.qty = (existing.qty || 0) + qty;
    } else {
        cart.push({
            id: prod.id,
            title: prod.title,
            price: price,
            qty: qty,
            image: (prod.images && prod.images[0]) || ''
        });
    }

    saveCart(cart);
    updateCartBadge();
}

// Action functions
function addToCart() {
    // Add single item to cart
    addToCartById(currentProduct.id, 1);
    // Small visual confirmation
    alert('Đã thêm 1 sản phẩm vào giỏ hàng!');
}

// Update badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);

function callConsult() {
    window.location.href = 'tel:02633999979';
}

function openZalo() {
    window.open('https://zalo.me/02633999979', '_blank');
}

function scrollToSpecs() {
    // kept for backward compatibility; open modal instead
    openSpecsModal();
}

// Specs modal handlers
function openSpecsModal() {
    const modal = document.getElementById('specsModal');
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    // prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeSpecsModal() {
    const modal = document.getElementById('specsModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Close specs modal when clicking outside content or pressing ESC
document.addEventListener('click', function(e) {
    const modal = document.getElementById('specsModal');
    if (!modal || !modal.classList.contains('active')) return;
    const content = modal.querySelector('.specs-modal-content');
    if (content && !content.contains(e.target) && !e.target.classList.contains('btn-view-specs')) {
        closeSpecsModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSpecsModal();
    }
});

function goBack() {
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        window.history.back();
    } else {
        window.location.href = '../index.html';
    }
}

// Review modal functions
function openReviewForm() {
    document.getElementById('reviewModal').classList.add('active');
}

function closeReviewForm() {
    document.getElementById('reviewModal').classList.remove('active');
}

function setupStarSelect() {
    const stars = document.querySelectorAll('#starSelect i');
    stars.forEach((star, index) => {
        star.onclick = function() {
            selectedRating = index + 1;
            updateStarSelect();
        };
    });
    updateStarSelect();
}

function updateStarSelect() {
    const stars = document.querySelectorAll('#starSelect i');
    stars.forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitReview() {
    const name = document.getElementById('reviewerName').value.trim();
    const content = document.getElementById('reviewContent').value.trim();
    
    if (!name) {
        alert('Vui lòng nhập họ tên!');
        return;
    }
    
    if (!content) {
        alert('Vui lòng nhập nội dung đánh giá!');
        return;
    }
    
    // Add new review to current product
    const today = new Date();
    const dateStr = today.toLocaleDateString('vi-VN');
    
    currentProduct.reviews.unshift({
        name: name,
        date: dateStr,
        rating: selectedRating,
        content: content
    });
    
    currentProduct.totalReviews++;
    
    // Reload reviews
    loadReviews();
    
    // Close modal
    closeReviewForm();
    
    // Reset form
    document.getElementById('reviewerName').value = '';
    document.getElementById('reviewContent').value = '';
    selectedRating = 5;
    updateStarSelect();
    
    alert('Cảm ơn bạn đã đánh giá sản phẩm!');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('reviewModal');
    if (e.target === modal) {
        closeReviewForm();
    }
});
