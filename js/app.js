// ===========================
// SONG PHUONG MOBILE APP - JAVASCRIPT
// Tích hợp ProductManager với 9,926 sản phẩm từ database
// ===========================

/**
 * Lock Screen Orientation to Portrait
 * Note: Often requires the app to be run in a Native/App Wrapper environment.
 */
async function lockOrientation() {
    try {
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('portrait');
        }
    } catch (error) {
        console.log('Orientation lock failed or not supported:', error);
    }
}

// Run orientation lock immediately on load
lockOrientation();

// ===========================
// GLOBAL STATE & HELPERS
// ===========================
let cartItems = []; // Global cart items
let currentCategoryFilter = null; // Global category filter for home rendering

// Helper: Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Helper: Show Notification
function showNotification(message, type = 'info') {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="icon ion-${type === 'success' ? 'checkmark-circled' : (type === 'error' ? 'alert-circled' : 'information-circled')}"></i>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Khởi tạo tìm kiếm sản phẩm
 */
function initProductSearch() {
    const searchInput = document.querySelector('.header-search-fixed .search-input');
    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', function (e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        searchTimeout = setTimeout(() => {
            if (query.length >= 2 && window.ProductManager && ProductManager.isLoaded) {
                showSearchResults(query);
            } else {
                hideSearchResults();
            }
        }, 300);
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                showSearchResults(query);
            }
        }
    });
}

/**
 * Hiển thị kết quả tìm kiếm
 */
function showSearchResults(query) {
    if (!window.ProductManager || !ProductManager.isLoaded) return;

    const results = ProductManager.searchProducts(query, { limit: 10 });

    // Tạo hoặc lấy container kết quả
    let resultsContainer = document.getElementById('searchResultsDropdown');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResultsDropdown';
        resultsContainer.style.cssText = `
            position: fixed;
            top: 60px;
            left: 8px;
            right: 8px;
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            box-shadow: 0 6px 24px rgba(0,0,0,0.12);
            z-index: 999;
            max-height: 320px;
            overflow-y: auto;
            padding: 8px 0;
        `;
        document.body.appendChild(resultsContainer);
    }

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div style="padding: 16px; text-align: center; color: #999;">Không tìm thấy sản phẩm</div>';
        return;
    }

    resultsContainer.innerHTML = results.map(p => `
        <div class="search-result-item" onclick="window.location.href='pages/product-details.html?sku=${encodeURIComponent(p.sku)}'" style="display: flex; align-items: center; padding: 10px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
            <img src="${p.image && (p.image.startsWith('http') ? p.image : 'https://product.hstatic.net/200000722513/product/' + p.image)}" 
                 alt="${p.title}" 
                 style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; margin-right: 12px;"
                 onerror="this.src='https://placehold.co/48x48/f0f0f0/999?text=No'">
            <div style="flex: 1; min-width: 0;">
                <div style="font-size: 13px; font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
                <div style="font-size: 12px; color: #e60000; font-weight: 600;">${ProductManager.formatPrice(p.displayPrice)}</div>
            </div>
        </div>
    `).join('');
}

/**
 * Ẩn kết quả tìm kiếm
 */
function hideSearchResults() {
    const resultsContainer = document.getElementById('searchResultsDropdown');
    if (resultsContainer) {
        resultsContainer.remove();
    }
}

// ===========================
// MOCK DATA FOR ORDERS/DELIVERIES/REVIEWS
// ===========================
const mockOrders = [];
const mockReviews = [];

// ===========================
// INFINITE SCROLL HOME FEED
// ===========================

// Poster images để xen kẽ trong feed
const HOME_POSTER_IMAGES = [
    'https://i.pinimg.com/736x/b3/2a/39/b32a392528f8447b5d6fce33728739f2.jpg',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=600&fit=crop',
];

const HOME_POSTER_FALLBACK = 'https://placehold.co/270x480/222/fff?text=POSTER';

// Trạng thái feed để hỗ trợ infinite scroll
const homeFeedState = {
    initialized: false,
    container: null,
    sortedBigToSmall: [],
    sortedSmallToBig: [],
    bigIndex: 0,
    smallIndex: 0,
    seenCounts: new Map(), // SKU -> số lần xuất hiện (max 2)
    patternCursor: 0, // Duy trì nhịp 2 lớn : 1 nhỏ
    itemsSincePoster: 0,
    posterIndex: 0,
    posterInterval: 6,
    renderedCount: 0,
};

let homeInfiniteScrollSetup = false;
let currentTab = 'home'; // Mặc định là home vì trang chủ hiển thị đầu tiên

// Chuyển SKU sang số để ưu tiên sản phẩm mới (SKU lớn hơn)
function parseSkuNumber(sku) {
    const num = parseInt(String(sku || '').replace(/\D/g, ''), 10);
    return Number.isFinite(num) ? num : 0;
}

/**
 * Lấy batch sản phẩm (2 SKU lớn : 1 SKU nhỏ), mỗi SKU tối đa 2 lần
 */
function getNextProductsBatch(batchSize = 15) {
    const result = [];
    let safety = 0;

    while (result.length < batchSize && safety < batchSize * 6) {
        const slot = homeFeedState.patternCursor % 3; // 0,1 => big ; 2 => small
        let candidate = null;

        if (slot < 2) {
            candidate = pickNextProduct('big');
        } else {
            candidate = pickNextProduct('small');
        }

        if (!candidate) {
            candidate = pickNextProduct('big') || pickNextProduct('small');
        }

        homeFeedState.patternCursor += 1;

        if (candidate) {
            result.push(candidate);
        }

        safety += 1;
    }

    return result;
}

function pickNextProduct(type) {
    const list = type === 'big' ? homeFeedState.sortedBigToSmall : homeFeedState.sortedSmallToBig;
    if (!list.length) return null;

    const indexKey = type === 'big' ? 'bigIndex' : 'smallIndex';
    let attempts = 0;

    while (attempts < list.length) {
        const candidate = list[homeFeedState[indexKey] % list.length];
        homeFeedState[indexKey] += 1;

        const sku = candidate?.sku;
        if (!sku) {
            attempts += 1;
            continue;
        }

        const count = homeFeedState.seenCounts.get(sku) || 0;
        if (count < 2) {
            homeFeedState.seenCounts.set(sku, count + 1);
            return candidate;
        }

        attempts += 1;
    }

    return null;
}

function renderPosterCard() {
    const posterUrl = HOME_POSTER_IMAGES[homeFeedState.posterIndex % HOME_POSTER_IMAGES.length];
    homeFeedState.posterIndex += 1;

    return `
        <div class="product-item poster promo-banner" data-category="promo">
            <div class="product-image">
                <img src="${posterUrl}" 
                     alt="Poster"
                     loading="lazy"
                     onerror="this.src='${HOME_POSTER_FALLBACK}'">
            </div>
        </div>
    `;
}

function buildProductCard(product, index) {
    const hasDiscount = product.onSale || product.displayPrice < product.originalPrice;
    const discountPercent = product.discountPercent ||
        (hasDiscount ? Math.round(((product.originalPrice - product.displayPrice) / product.originalPrice) * 100) : 0);

    const categorySlug = (product.mainCategory || product.category || 'other').toLowerCase().replace(/\s+/g, '-');
    const escapedSku = (product.sku || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const escapedTitle = (product.title || '').replace(/"/g, '&quot;');

    let imageUrl = 'https://placehold.co/200x200/f0f0f0/999?text=No+Image';
    if (product.image) {
        if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
            imageUrl = product.image;
        } else {
            imageUrl = `https://product.hstatic.net/200000722513/product/${product.image}`;
        }
    }

    const rating = product.rating || 5;
    const starsHTML = Array.from({ length: 5 }, (_, i) =>
        i < rating ? '<i class="icon ion-android-star" style="color: #ffc107;"></i>' : '<i class="icon ion-android-star-outline" style="color: #ddd;"></i>'
    ).join('');

    return `
        <div class="product-item square" 
             data-category="${categorySlug}" 
             data-sku="${escapedSku}" 
             data-product-title="${escapedTitle}"
             data-index="${index}">
            <div class="product-image">
                ${hasDiscount && discountPercent > 0 ? `<span class="product-discount">-${discountPercent}%</span>` : ''}
                ${product.onSale ? `<span class="product-tag sale">Khuyến mãi</span>` : ''}
                <img src="${imageUrl}" 
                     alt="${escapedTitle}"
                     loading="lazy"
                     onerror="this.src='https://placehold.co/200x200/f0f0f0/999?text=No+Image'">
            </div>
            <div class="product-info">
                <div class="product-sku" style="font-size: 11px; color: #999; margin: 0;">SKU: ${product.sku}</div>
                <div class="product-name"><strong>${product.title}</strong></div>
                <div class="product-rating" style="margin: 0; font-size: 14px;">
                    ${starsHTML}
                </div>
                <div class="product-price-wrapper">
                    ${hasDiscount && product.originalPrice ? `<div class="product-old-price" style="font-size: 13px; color: #999; text-decoration: line-through; margin-bottom: 0;">${ProductManager.formatPrice(product.originalPrice)}</div>` : ''}
                    <div class="product-price" style="font-size: 16px; font-weight: 700; color: #e60000;">${ProductManager.formatPrice(product.displayPrice)}</div>
                </div>
            </div>
        </div>
    `;
}

function appendHomeProductsBatch(batchSize = 15) {
    if (!homeFeedState.initialized || !homeFeedState.container) return 0;

    const products = getNextProductsBatch(batchSize);
    if (!products.length) return 0;

    let html = '';
    products.forEach((product) => {
        if (homeFeedState.itemsSincePoster >= homeFeedState.posterInterval) {
            html += renderPosterCard();
            homeFeedState.itemsSincePoster = 0;
        }

        html += buildProductCard(product, homeFeedState.renderedCount);
        homeFeedState.itemsSincePoster += 1;
        homeFeedState.renderedCount += 1;
    });

    homeFeedState.container.insertAdjacentHTML('beforeend', html);
    return products.length;
}

function resetHomeFeed(allProducts, container) {
    homeFeedState.container = container;

    // Create a copy to shuffle
    const shuffled = [...allProducts];

    // Fisher-Yates Shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Split into two random lists for "Big" and "Small" streams
    // This maintains the 2:1 pattern logic but with randomized content
    const midPoint = Math.ceil(shuffled.length * 0.6); // 60% for "Big" stream
    homeFeedState.sortedBigToSmall = shuffled.slice(0, midPoint);
    homeFeedState.sortedSmallToBig = shuffled.slice(midPoint);

    homeFeedState.bigIndex = 0;
    homeFeedState.smallIndex = 0;
    homeFeedState.seenCounts = new Map();
    homeFeedState.patternCursor = 0;
    homeFeedState.itemsSincePoster = 0;
    homeFeedState.posterIndex = Math.floor(Math.random() * HOME_POSTER_IMAGES.length); // Random start poster
    homeFeedState.renderedCount = 0;
    homeFeedState.initialized = true;
    container.innerHTML = '';
}

/**
 * Render sản phẩm từ ProductManager vào trang home (hỗ trợ infinite scroll)
 */
function renderHomeProducts(options = {}) {
    const { reset = true, reason = 'default' } = options;
    console.log('=== renderHomeProducts called ===', { reset, reason });

    const container = document.getElementById('productsContainer');

    if (!container) {
        console.error('❌ productsContainer not found!');
        return;
    }

    if (!window.ProductManager || !ProductManager.isLoaded) {
        console.warn('⚠️ ProductManager not ready');
        return;
    }

    let allProducts = ProductManager.products.filter(p => p.displayPrice > 0 && p.originalPrice > 0);

    // Áp dụng bộ lọc danh mục nếu có
    if (currentCategoryFilter && currentCategoryFilter !== 'all') {
        const filter = currentCategoryFilter;
        if (filter === 'Sản Phẩm Khuyến Mãi' || filter === 'sale') {
            allProducts = allProducts.filter(p => p.onSale || (p.discountPercent && p.discountPercent > 0));
        } else {
            allProducts = allProducts.filter(p => {
                const cat = (p.category || '').trim();
                const sub = (p.subCategory || '').trim();
                return (
                    cat === filter ||
                    sub === filter ||
                    cat.includes(filter) ||
                    sub.includes(filter)
                );
            });
        }
    }

    if (!allProducts.length) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; width: 100%;">
                <i class="icon ion-alert-circled" style="font-size: 48px; color: #999;"></i>
                <p style="color: #999; margin-top: 15px; font-size: 14px;">Không có sản phẩm</p>
            </div>
        `;
        return;
    }

    if (reset || !homeFeedState.initialized) {
        resetHomeFeed(allProducts, container);
    }

    const appended = appendHomeProductsBatch(18);
    setupProductClickHandlers();
    setupHomeInfiniteScroll();
    initProductCategoryNav();

    console.log(`✅ Appended ${appended} products (total rendered: ${homeFeedState.renderedCount})`);
}

function setupHomeInfiniteScroll() {
    if (homeInfiniteScrollSetup) return;

    const scrollContent = document.querySelector('.scroll-content');
    if (!scrollContent) return;

    scrollContent.addEventListener('scroll', () => {
        if (!homeFeedState.initialized) return;
        const homeViewActive = document.getElementById('home-view')?.classList.contains('active');
        if (!homeViewActive) return;

        const nearBottom = scrollContent.scrollTop + scrollContent.clientHeight >= scrollContent.scrollHeight - 300;
        if (nearBottom) {
            const appended = appendHomeProductsBatch(12);
            if (appended > 0) {
                console.log(`📥 Infinite scroll appended ${appended} products (total ${homeFeedState.renderedCount})`);
            }
        }
    });

    homeInfiniteScrollSetup = true;
}

/**
 * Toggle Sidebar Menu (Danh mục)
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebarContainer');
    const overlay = document.getElementById('sidebarOverlay');

    if (!sidebar || !overlay) {
        console.error('Sidebar elements not found');
        return;
    }

    const isOpen = sidebar.classList.contains('active');

    if (isOpen) {
        // Đóng sidebar
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    } else {
        // Mở sidebar
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close Sidebar (gọi từ overlay hoặc nút đóng)
 */
function closeSidebar() {
    const sidebar = document.getElementById('sidebarContainer');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
}

/**
 * Khởi tạo sidebar với danh mục từ categories-data.js
 */
function initSidebarCategories() {
    const sidebarContent = document.getElementById('sidebarContent');
    if (!sidebarContent || !window.CATEGORIES) {
        console.error('Sidebar content or CATEGORIES not found');
        return;
    }

    let html = '';

    // Sản phẩm khuyến mãi (special item)
    html += `
        <div class="sidebar-item" onclick="filterProductsByCategory('Sản Phẩm Khuyến Mãi')">
            <i class="icon ion-pricetag text-red"></i>
            <span>Sản Phẩm Khuyến Mãi</span>
        </div>
    `;

    // Các danh mục chính với danh mục con
    CATEGORIES.forEach((category, catIndex) => {
        const hasChildren = category.children && category.children.length > 0;
        const categoryId = `cat-${catIndex}`;

        // Danh mục cha
        html += `
            <div class="sidebar-item ${hasChildren ? 'has-children' : ''}" 
                 onclick="${hasChildren ? `toggleSubmenu('${categoryId}')` : `filterProductsByCategory('${category.name}')`}">
                <i class="${category.icon || 'icon ion-grid'}"></i>
                <span>${category.name}</span>
                ${hasChildren ? '<i class="icon ion-ios-arrow-forward sidebar-item-arrow"></i>' : ''}
            </div>
        `;

        // Danh mục con (nếu có)
        if (hasChildren) {
            html += `<div class="sidebar-submenu" id="${categoryId}">`;

            category.children.forEach((child, childIndex) => {
                if (typeof child === 'string') {
                    // Danh mục con đơn giản
                    html += `
                        <div class="sidebar-submenu-item" onclick="filterProductsByCategory('${category.name} > ${child}')">
                            <span>${child}</span>
                        </div>
                    `;
                } else {
                    // Danh mục con có danh mục con cấp 2
                    const hasSubChildren = child.children && child.children.length > 0;
                    const subCategoryId = `${categoryId}-${childIndex}`;

                    html += `
                        <div class="sidebar-submenu-item ${hasSubChildren ? 'has-children' : ''}" 
                             onclick="${hasSubChildren ? `toggleSubSubmenu('${subCategoryId}')` : `filterProductsByCategory('${category.name} > ${child.name}')`}">
                            <span>${child.name}</span>
                            ${hasSubChildren ? '<i class="icon ion-ios-arrow-forward submenu-arrow"></i>' : ''}
                        </div>
                    `;

                    // Danh mục con cấp 2 (nếu có)
                    if (hasSubChildren) {
                        html += `<div class="sidebar-subsubmenu" id="${subCategoryId}">`;
                        child.children.forEach(subChild => {
                            html += `
                                <div class="sidebar-subsubmenu-item" 
                                     onclick="filterProductsByCategory('${category.name} > ${child.name} > ${subChild}')">
                                    ${subChild}
                                </div>
                            `;
                        });
                        html += `</div>`;
                    }
                }
            });

            html += `</div>`;
        }
    });

    sidebarContent.innerHTML = html;
}

/**
 * Toggle submenu (danh mục con cấp 1)
 */
function toggleSubmenu(submenuId) {
    event.stopPropagation();
    const submenu = document.getElementById(submenuId);
    const parentItem = submenu.previousElementSibling;

    if (!submenu) return;

    // Toggle active class
    const isActive = submenu.classList.contains('active');

    if (isActive) {
        submenu.classList.remove('active');
        parentItem.classList.remove('active');
    } else {
        // Đóng tất cả submenu khác
        document.querySelectorAll('.sidebar-submenu.active').forEach(item => {
            item.classList.remove('active');
            item.previousElementSibling.classList.remove('active');
        });

        submenu.classList.add('active');
        parentItem.classList.add('active');
    }
}

/**
 * Toggle sub-submenu (danh mục con cấp 2)
 */
function toggleSubSubmenu(subSubmenuId) {
    event.stopPropagation();
    const subSubmenu = document.getElementById(subSubmenuId);
    const parentItem = subSubmenu.previousElementSibling;

    if (!subSubmenu) return;

    // Toggle active class
    const isActive = subSubmenu.classList.contains('active');

    if (isActive) {
        subSubmenu.classList.remove('active');
        parentItem.classList.remove('active');
    } else {
        // Đóng tất cả sub-submenu khác trong cùng submenu
        const parentSubmenu = subSubmenu.closest('.sidebar-submenu');
        if (parentSubmenu) {
            parentSubmenu.querySelectorAll('.sidebar-subsubmenu.active').forEach(item => {
                item.classList.remove('active');
                item.previousElementSibling.classList.remove('active');
            });
        }

        subSubmenu.classList.add('active');
        parentItem.classList.add('active');
    }
}

/**
 * Lọc sản phẩm theo danh mục
 */
function filterProductsByCategory(categoryPath) {
    console.log('Filtering products by category:', categoryPath);
    // Đóng sidebar nếu có
    if (typeof closeSidebar === 'function') closeSidebar();

    // Cập nhật filter toàn cục
    currentCategoryFilter = categoryPath;
    showNotification(`Đang lọc sản phẩm: ${categoryPath}`, 'info');

    // Chuyển về home và render lại bằng pipeline chuẩn
    if (typeof switchNav === 'function') switchNav('home');
    renderHomeProducts({ reset: true, reason: 'category-filter' });
}


/**
 * Khởi tạo navigation danh mục dưới banner
 */
function initCategoryNavigation() {
    const navElement = document.getElementById('productCategoryNav');
    if (!navElement || !window.CATEGORIES) {
        console.error('Category navigation or CATEGORIES not found');
        return;
    }

    let html = `
        <div class="product-cat-item active" data-category="all">
            <i class="icon ion-grid cat-icon"></i>
            <span class="cat-label">Tất cả</span>
        </div>
        <div class="product-cat-item category-sale" data-category="sale">
            <i class="icon ion-pricetag cat-icon"></i>
            <span class="cat-label">SALE</span>
        </div>
    `;

    // Chọn 6-8 danh mục phổ biến nhất để hiển thị
    const popularCategories = [
        'Laptop - Máy Tính Xách Tay',
        'Linh Kiện Máy Tính',
        'Màn Hình Máy Tính',
        'PC Song Phương',
        'Gaming Gear-Phím-Chuột',
        'Camera An Ninh'
    ];

    popularCategories.forEach(catName => {
        const category = CATEGORIES.find(c => c.name === catName);
        if (category) {
            html += `
                <div class="product-cat-item" data-category="${catName}">
                    <i class="${category.icon || 'icon ion-grid'} cat-icon"></i>
                    <span class="cat-label">${getShortCategoryName(catName)}</span>
                </div>
            `;
        }
    });

    navElement.innerHTML = html;

    // Thiết lập sự kiện click cho navigation items
    setupCategoryNavClickHandlers();
}

/**
 * Rút gọn tên danh mục cho navigation
 */
function getShortCategoryName(fullName) {
    const shortNames = {
        'Máy Tính Trọn Bộ': 'Máy Bộ',
        'PC Song Phương': 'SP PC',
        'Laptop - Máy Tính Xách Tay': 'Laptop',
        'Linh Kiện Máy Tính': 'Linh Kiện',
        'Màn Hình Máy Tính': 'Màn Hình',
        'Gaming Gear-Phím-Chuột': 'Gaming Gears',
        'Camera An Ninh': 'Camera',
        'Dịch Vụ PC-Laptop': 'Dịch Vụ'
    };

    return shortNames[fullName] || fullName;
}

/**
 * Thiết lập sự kiện click cho category navigation
 */
function setupCategoryNavClickHandlers() {
    const navItems = document.querySelectorAll('.product-cat-item');

    navItems.forEach(item => {
        // Bỏ qua item đã có onclick inline
        if (item.getAttribute('onclick')) return;

        item.addEventListener('click', function () {
            // Remove active từ tất cả items
            navItems.forEach(i => i.classList.remove('active'));

            // Thêm active vào item được click
            this.classList.add('active');

            // Lấy category và filter
            const category = this.getAttribute('data-category');

            if (category === 'all') {
                // Hiển thị tất cả sản phẩm
                console.log('Showing all products');
                renderHomeProducts({ reset: true, reason: 'category-all' });
            } else if (category === 'sale') {
                // Lọc sản phẩm khuyến mãi
                console.log('Filtering sale products');
                filterProductsByCategory('Sản Phẩm Khuyến Mãi');
            } else {
                // Lọc theo danh mục
                filterProductsByCategory(category);
            }
        });
    });
}

/**
 * Switch Navigation Tabs
 * @param {string} tab - The tab name to switch to (home, build-pc, warranty, profile, notifications)
 * @param {Event} evt - Optional event object to prevent default behavior
 */
function switchNav(tab, evt) {
    // Prevent default behavior
    if (evt && evt.preventDefault) {
        evt.preventDefault();
    }

    // Nếu đang ở Home và nhấn Home lần nữa -> làm mới gợi ý sản phẩm
    const isHomeReclick = tab === 'home' && currentTab === 'home' && document.getElementById('home-view')?.classList.contains('active');
    if (isHomeReclick) {
        showNotification('Đang làm mới gợi ý sản phẩm...', 'info');
        renderHomeProducts({ reset: true, reason: 'home-tab-refresh' });
        const scrollContent = document.querySelector('.scroll-content');
        if (scrollContent) scrollContent.scrollTop = 0;
        return;
    }

    // Đóng sidebar nếu đang mở
    const sidebar = document.getElementById('sidebarContainer');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }

    // Load warranty content if needed
    if (tab === 'warranty') {
        loadWarrantyContent();
    }

    // Xóa class active khỏi tất cả các mục điều hướng
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Thêm class active vào mục tương ứng với tab
    navItems.forEach(item => {
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${tab}'`)) {
            item.classList.add('active');
        }
        // Trường hợp đặc biệt cho danh mục
        if (tab === 'category' && onclickAttr && onclickAttr.includes('toggleSidebar')) {
            item.classList.add('active');
        }
    });

    // Chuyển đổi hiển thị các View
    const views = document.querySelectorAll('.app-view');
    views.forEach(view => view.classList.remove('active'));

    const activeView = document.getElementById(`${tab}-view`);
    if (activeView) {
        activeView.classList.add('active');
        // Cuộn lên đầu trang khi chuyển tab
        const scrollContent = document.querySelector('.scroll-content');
        if (scrollContent) scrollContent.scrollTop = 0;
    }

    // Xử lý hiển thị Search Bar
    const searchBar = document.querySelector('.header-search-fixed');
    if (searchBar) {
        searchBar.style.display = (tab === 'home') ? 'flex' : 'none';
    }

    // Cập nhật tab hiện tại
    currentTab = tab;
}

/**
 * Setup event handlers cho các sản phẩm sử dụng event delegation
 * Chỉ setup 1 lần duy nhất để tránh duplicate listeners
 */
let productClickHandlerSetup = false;

function setupProductClickHandlers() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    // Nếu đã setup rồi thì không setup lại
    if (productClickHandlerSetup) {
        console.log('Product click handlers already setup, skipping...');
        return;
    }

    // Event delegation cho click vào sản phẩm
    container.addEventListener('click', function (e) {
        const productItem = e.target.closest('.product-item.square');

        if (!productItem) return;

        const clickedBuyButton = e.target.closest('.btn-buy');

        if (clickedBuyButton) {
            // Click vào nút Mua ngay
            e.preventDefault();
            e.stopPropagation();
            const productTitle = productItem.getAttribute('data-product-title');
            if (productTitle) {
                addToCart(productTitle);
            }
        } else {
            // Click vào bất kỳ đâu khác trong product item -> mở chi tiết
            const sku = productItem.getAttribute('data-sku');
            const index = productItem.getAttribute('data-index');
            const title = productItem.getAttribute('data-product-title');

            console.log('=== Product Click Debug ===');
            console.log('Index:', index);
            console.log('SKU from attribute:', sku);
            console.log('Title from attribute:', title);
            console.log('Product element:', productItem);

            if (sku) {
                handleProductClick(sku);
            } else {
                console.error('No SKU found on product item!');
            }
        }
    });

    productClickHandlerSetup = true;
    console.log('✅ Product click handlers setup complete');
}

/**
 * Xử lý click vào sản phẩm - điều hướng tới trang chi tiết
 */
function handleProductClick(sku) {
    console.log('=== handleProductClick called ===');
    console.log('SKU parameter:', sku);

    if (!sku || sku === 'undefined' || sku === 'null') {
        console.error('Invalid SKU:', sku);
        showNotification('Lỗi: Không thể lấy thông tin sản phẩm', 'error');
        return;
    }

    // Kiểm tra sản phẩm có tồn tại trong database
    if (window.ProductManager && ProductManager.isLoaded) {
        const product = ProductManager.getProductBySku(sku);
        console.log('Product found in database:', product ? `${product.sku} - ${product.title}` : 'NOT FOUND');

        if (!product) {
            console.error('Product not found for SKU:', sku);
            showNotification('Sản phẩm không tồn tại', 'error');
            return;
        }
    }

    console.log('Navigating to product details page with SKU:', sku);
    window.location.href = `pages/product-details.html?sku=${encodeURIComponent(sku)}`;
}

// RENDER UI SECTIONS
// ===========================
function renderOrders() {
    const list = document.getElementById('orders-list');
    const empty = document.getElementById('orders-empty');
    if (!list || !empty) return;

    list.innerHTML = '';
    if (!mockOrders.length) {
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    const statusMap = {
        'Hoàn thành': 'status-success',
        'Đang giao': 'status-info',
        'Chờ xử lý': 'status-warning',
    };

    mockOrders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = `
            <div class="order-card__header">
                <div class="order-meta">
                    <strong>${order.id}</strong>
                    <span>${order.date}</span>
                </div>
                <span class="status-badge ${statusMap[order.status] || 'status-muted'}">${order.status}</span>
            </div>
            <div class="order-items">${order.items.map(item => `<div>${item}</div>`).join('')}</div>
            <div class="order-total">
                <span>Tổng</span>
                <span>${formatCurrency(order.total)}</span>
            </div>
            <div class="order-actions">
                <button class="outline-button" onclick="openDeliveries()">Theo dõi</button>
                <button class="primary-button" onclick="showNotification('Chi tiết đơn hàng demo', 'info')">Xem chi tiết</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function renderDeliveries() {
    const list = document.getElementById('deliveries-list');
    const empty = document.getElementById('deliveries-empty');
    if (!list || !empty) return;
    list.innerHTML = '';
    const delivering = mockOrders.filter(o => o.status === 'Đang giao');
    if (!delivering.length) {
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    delivering.forEach(order => {
        const card = document.createElement('div');
        card.className = 'delivery-card';
        const steps = order.steps || [];
        const activeIndex = steps.length - 1;
        card.innerHTML = `
            <div class="delivery-card__header">
                <div class="delivery-meta">
                    <strong>${order.id}</strong>
                    <span>${order.date}</span>
                </div>
                <span class="status-badge status-info">Đang giao</span>
            </div>
            <div class="delivery-steps">
                ${steps.map((step, idx) => `<div class="delivery-step ${idx === activeIndex ? 'active' : ''}">${step}</div>`).join('')}
            </div>
            <div class="order-total" style="margin-top:12px;">
                <span>Tổng</span>
                <span>${formatCurrency(order.total)}</span>
            </div>
        `;
        list.appendChild(card);
    });
}

function renderReviews() {
    const list = document.getElementById('reviews-list');
    const empty = document.getElementById('reviews-empty');
    if (!list || !empty) return;
    list.innerHTML = '';

    if (!mockReviews.length) {
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    mockReviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-card__header">
                <div class="delivery-meta">
                    <strong>${review.product}</strong>
                    <span>${review.hint}</span>
                </div>
                <span class="status-badge status-muted">Chờ đánh giá</span>
            </div>
            <div class="review-body">
                <div class="star-row">
                    <i class="icon ion-ios-star-outline"></i>
                    <i class="icon ion-ios-star-outline"></i>
                    <i class="icon ion-ios-star-outline"></i>
                    <i class="icon ion-ios-star-outline"></i>
                    <i class="icon ion-ios-star-outline"></i>
                </div>
                <textarea class="review-textarea" placeholder="Chia sẻ cảm nhận của bạn..."></textarea>
                <div class="review-actions">
                    <button class="outline-button" onclick="showNotification('Bỏ qua tạm thời', 'info')">Để sau</button>
                    <button class="primary-button" onclick="showNotification('Gửi đánh giá demo', 'success')">Gửi đánh giá</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function syncActionBadges() {
    setBadgeValue('#ordersBadge', mockOrders.length);
    const delivering = mockOrders.filter(o => o.status === 'Đang giao').length;
    setBadgeValue('#deliveriesBadge', delivering);
    setBadgeValue('#reviewsBadge', mockReviews.length);
}

// CART UI
// ===========================
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;
    const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = totalQty;
}

function renderCart() {
    const list = document.getElementById('cart-items');
    const empty = document.getElementById('cart-empty');
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');
    if (!list || !empty || !subtotalEl || !shippingEl || !totalEl) return;

    list.innerHTML = '';
    if (!cartItems.length) {
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';
        cartItems.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item__info">
                    <div class="cart-item__name">${item.name}</div>
                    <div class="cart-item__price">${formatCurrency(item.price)}</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-button" onclick="changeCartQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-button" onclick="changeCartQty('${item.id}', 1)">+</button>
                </div>
            `;
            list.appendChild(row);
        });
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = cartItems.length ? 30000 : 0;
    const total = subtotal + shipping;
    subtotalEl.textContent = formatCurrency(subtotal);
    shippingEl.textContent = formatCurrency(shipping);
    totalEl.textContent = formatCurrency(total);
}

function changeCartQty(id, delta) {
    cartItems = cartItems.map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
        .filter(item => item.qty > 0);
    updateCartBadge();
    renderCart();
}

function openCart() {
    renderCart();
    updateCartBadge();
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.classList.add('active');
}

function closeCart() {
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.classList.remove('active');
}

// QUICK NAV HELPERS
function openOrders() { switchNav('orders'); }
function openDeliveries() { switchNav('deliveries'); }
function openReviews() { switchNav('reviews'); }

/**
 * Logic Product Category Navigation (Sticky Nav)
 */
function initProductCategoryNav() {
    const categoryNav = document.getElementById('productCategoryNav');
    const catItems = document.querySelectorAll('.product-cat-item');
    const productItems = document.querySelectorAll('.product-item');

    if (!categoryNav || catItems.length === 0) return;

    // ===== Swipe/Touch Handling =====
    let touchStartX = 0;
    let touchEndX = 0;
    let isScrolling = false;

    categoryNav.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isScrolling = false;
    }, { passive: true });

    categoryNav.addEventListener('touchmove', (e) => {
        // Nếu đã cuộn, không xử lý swipe
        if (Math.abs(e.changedTouches[0].screenX - touchStartX) > 5) {
            isScrolling = true;
        }
    }, { passive: true });

    categoryNav.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50; // Minimum distance to be considered a swipe
        const difference = touchStartX - touchEndX;

        // Chỉ xử lý swipe nếu không phải là cuộn thông thường
        if (!isScrolling) {
            return;
        }

        // Swipe trái (kéo sang trái) - Scroll phải
        if (difference > swipeThreshold) {
            categoryNav.scrollBy({
                left: 100,
                behavior: 'smooth'
            });
        }
        // Swipe phải (kéo sang phải) - Scroll trái
        else if (difference < -swipeThreshold) {
            categoryNav.scrollBy({
                left: -100,
                behavior: 'smooth'
            });
        }
    }, { passive: true });

    // Xử lý click vào các mục danh mục
    catItems.forEach(item => {
        item.addEventListener('click', () => {
            // Xóa active khỏi tất cả
            catItems.forEach(cat => cat.classList.remove('active'));
            // Thêm active vào mục được click
            item.classList.add('active');

            const category = item.getAttribute('data-category');
            filterProducts(category);

            // Cuộn mục được chọn vào giữa view
            item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });

    // Lọc sản phẩm theo danh mục
    function filterProducts(category) {
        productItems.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            const hasSaleTag = product.querySelector('.product-tag.sale') || product.querySelector('.product-discount');

            let shouldShow = false;
            if (category === 'all') {
                shouldShow = true;
            } else if (category === 'sale') {
                shouldShow = hasSaleTag;
            } else {
                shouldShow = (productCategory === category);
            }

            if (shouldShow) {
                product.style.display = '';
                product.style.animation = 'fadeIn 0.4s ease-out';
            } else {
                product.style.display = 'none';
            }
        });
    }
}

/**
 * Logic slider banner - Auto slide only
 */
function initBannerSlider() {
    const slider = document.querySelector('.banner-slider');
    const slides = document.querySelectorAll('.banner-link');
    const dots = document.querySelectorAll('.dot');

    if (!slider || slides.length === 0) return;

    let currentIndex = 0;
    let currentTranslate = 0;
    let autoSlideInterval;

    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
        slider.style.transition = 'transform 0.3s ease-out';
        const sliderWidth = slider.parentElement.offsetWidth;
        currentTranslate = currentIndex * -sliderWidth;
        setSliderPosition();
        updateDots();
    }

    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    // LOGIC AUTO SLIDE
    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            setPositionByIndex();
        }, 4000);
    }

    // Xử lý khi thay đổi kích thước màn hình
    window.addEventListener('resize', () => {
        setPositionByIndex();
    });

    // DOT CLICK
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            setPositionByIndex();
            startAutoSlide();
        });
    });

    // Khởi tạo
    setPositionByIndex();
    startAutoSlide();
}

// ===========================
// USER PROFILE FUNCTIONS
// ===========================

/**
 * Change Avatar Image
 */
function changeAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        // Kiểm tra loại file
        if (!file.type.startsWith('image/')) {
            showNotification('Vui lòng chọn file hình ảnh!', 'error');
            return;
        }

        // Kiểm tra kích thước file (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Kích thước ảnh không được vượt quá 5MB!', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const avatarImg = document.getElementById('userAvatar');
            if (avatarImg) {
                avatarImg.src = e.target.result;
                // Lưu avatar vào localStorage
                localStorage.setItem('userAvatar', e.target.result);
                showNotification('Đã cập nhật ảnh đại diện!', 'success');
            }
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Load saved avatar from localStorage
 */
function loadSavedAvatar() {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        const avatarImg = document.getElementById('userAvatar');
        if (avatarImg) {
            avatarImg.src = savedAvatar;
        }
    }
}

/**
 * Edit Contact Information
 */
function editContactInfo() {
    // Tạo modal chỉnh sửa thông tin
    const modal = document.createElement('div');
    modal.className = 'edit-contact-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeEditModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Chỉnh sửa thông tin</h3>
                <button class="modal-close" onclick="closeEditModal()">
                    <i class="icon ion-close"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Họ và tên</label>
                    <input type="text" id="editName" value="Nguyễn Văn A" placeholder="Nhập họ và tên">
                </div>
                <div class="form-group">
                    <label>Số điện thoại</label>
                    <input type="tel" id="editPhone" value="0912 345 678" placeholder="Nhập số điện thoại">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="editEmail" value="nguyenvana@email.com" placeholder="Nhập email">
                </div>
                <div class="form-group">
                    <label>Địa chỉ</label>
                    <textarea id="editAddress" rows="2" placeholder="Nhập địa chỉ">123 Nguyễn Văn Linh, Quận 7, TP.HCM</textarea>
                </div>
                <div class="form-group">
                    <label>Ngày sinh</label>
                    <input type="date" id="editBirthday" value="1990-03-15">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeEditModal()">Hủy</button>
                <button class="btn-save" onclick="saveContactInfo()">Lưu thay đổi</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Animation
    setTimeout(() => modal.classList.add('active'), 10);
}

/**
 * Close Edit Modal
 */
function closeEditModal() {
    const modal = document.querySelector('.edit-contact-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * Save Contact Information
 */
function saveContactInfo() {
    const name = document.getElementById('editName').value;
    const phone = document.getElementById('editPhone').value;
    const email = document.getElementById('editEmail').value;
    const address = document.getElementById('editAddress').value;
    const birthday = document.getElementById('editBirthday').value;

    // Cập nhật hiển thị trên trang
    const contactItems = document.querySelectorAll('.contact-item .contact-value');
    if (contactItems.length >= 4) {
        contactItems[0].textContent = phone;
        contactItems[1].textContent = email;
        contactItems[2].textContent = address;

        // Format ngày sinh
        const dateObj = new Date(birthday);
        const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
        contactItems[3].textContent = formattedDate;
    }

    // Cập nhật tên người dùng
    const userName = document.querySelector('.user-name');
    if (userName) userName.textContent = name;

    // Lưu vào localStorage
    const userInfo = { name, phone, email, address, birthday };
    localStorage.setItem('userContactInfo', JSON.stringify(userInfo));

    closeEditModal();
    showNotification('Đã lưu thông tin thành công!', 'success');
}

/**
 * Load saved contact info from localStorage
 */
function loadSavedContactInfo() {
    const saved = localStorage.getItem('userContactInfo');
    if (saved) {
        const userInfo = JSON.parse(saved);

        // Cập nhật hiển thị
        const contactItems = document.querySelectorAll('.contact-item .contact-value');
        if (contactItems.length >= 4) {
            contactItems[0].textContent = userInfo.phone;
            contactItems[1].textContent = userInfo.email;
            contactItems[2].textContent = userInfo.address;

            const dateObj = new Date(userInfo.birthday);
            const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
            contactItems[3].textContent = formattedDate;
        }

        const userName = document.querySelector('.user-name');
        if (userName) userName.textContent = userInfo.name;
    }
}

/**
 * Logout Function
 */
function logout() {
    // Hiển thị xác nhận đăng xuất
    const confirmModal = document.createElement('div');
    confirmModal.className = 'confirm-modal';
    confirmModal.innerHTML = `
        <div class="modal-overlay" onclick="closeConfirmModal()"></div>
        <div class="confirm-content">
            <div class="confirm-icon">
                <i class="icon ion-log-out"></i>
            </div>
            <h3>Đăng xuất</h3>
            <p>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</p>
            <div class="confirm-buttons">
                <button class="btn-cancel" onclick="closeConfirmModal()">Hủy</button>
                <button class="btn-confirm" onclick="confirmLogout()">Đăng xuất</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmModal);
    setTimeout(() => confirmModal.classList.add('active'), 10);
}

/**
 * Close Confirm Modal
 */
function closeConfirmModal() {
    const modal = document.querySelector('.confirm-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * Confirm Logout
 */
function confirmLogout() {
    // Xóa dữ liệu người dùng
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('userContactInfo');

    closeConfirmModal();
    showNotification('Đã đăng xuất thành công!', 'info');

    // Chuyển về trang chủ
    setTimeout(() => {
        switchNav('home');
    }, 500);
}

// Khởi tạo ProductManager và tìm kiếm
document.addEventListener('DOMContentLoaded', async function () {
    // Đợi ProductManager load
    if (window.ProductManager) {
        await ProductManager.init();
        console.log('✅ ProductManager đã sẵn sàng với', ProductManager.products.length, 'sản phẩm');

        // Hiện thống kê trong console
        const stats = ProductManager.getStats();
        console.log('📊 Thống kê:', stats);

        // Render sản phẩm lên trang chủ
        if (ProductManager.isLoaded && ProductManager.products.length > 0) {
            console.log('🏠 Đang render sản phẩm lên trang chủ...');
            renderHomeProducts({ reset: true, reason: 'initial-load' });
            setupProductClickHandlers();
            setupHomeInfiniteScroll();
        }
    }

    // Khởi tạo tìm kiếm
    initProductSearch();

    // Khởi tạo sidebar với danh mục
    initSidebarCategories();

    // Khởi tạo navigation danh mục
    initCategoryNavigation();
});

// Load user profile data
document.addEventListener('DOMContentLoaded', function () {
    loadSavedAvatar();
    loadSavedContactInfo();
});

// Khởi tạo UI mock cho Đơn hàng/Đang giao/Đánh giá và giỏ hàng
document.addEventListener('DOMContentLoaded', function () {
    renderOrders();
    renderDeliveries();
    renderReviews();
    updateCartBadge();
    renderCart();
    syncActionBadges();
});

// Hiệu ứng động
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
        }
    }

    /* Edit Contact Modal Styles */
    .edit-contact-modal,
    .confirm-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .edit-contact-modal.active,
    .confirm-modal.active {
        opacity: 1;
        visibility: visible;
    }

    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        position: relative;
        background: white;
        width: 90%;
        max-width: 400px;
        border-radius: 20px;
        overflow: hidden;
        transform: translateY(20px);
        transition: transform 0.3s ease;
    }

    .edit-contact-modal.active .modal-content {
        transform: translateY(0);
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        background: linear-gradient(135deg, #2e308a, #4a4cc9);
        color: white;
    }

    .modal-header h3 {
        margin: 0;
        font-size: 18px;
    }

    .modal-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 5px;
    }

    .modal-body {
        padding: 20px;
        max-height: 60vh;
        overflow-y: auto;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #333;
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        font-size: 14px;
        transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #2e308a;
    }

    .modal-footer {
        display: flex;
        gap: 10px;
        padding: 20px;
        background: #f8f9fa;
    }

    .btn-cancel,
    .btn-save,
    .btn-confirm {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-cancel {
        background: #e9ecef;
        color: #666;
    }

    .btn-save {
        background: linear-gradient(135deg, #2e308a, #4a4cc9);
        color: white;
    }

    .btn-confirm {
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white;
    }

    /* Confirm Modal */
    .confirm-content {
        position: relative;
        background: white;
        width: 85%;
        max-width: 320px;
        border-radius: 20px;
        padding: 30px;
        text-align: center;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }

    .confirm-modal.active .confirm-content {
        transform: scale(1);
    }

    .confirm-icon {
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, #fee2e2, #fecaca);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
    }

    .confirm-icon i {
        font-size: 32px;
        color: #dc3545;
    }

    .confirm-content h3 {
        margin: 0 0 10px;
        color: #333;
    }

    .confirm-content p {
        margin: 0 0 25px;
        color: #666;
        font-size: 14px;
    }

    .confirm-buttons {
        display: flex;
        gap: 10px;
    }
`;
document.head.appendChild(style);

// ===========================
// NEW PROFILE FEATURES
// ===========================

/**
 * Toggle Spending Visibility
 */
let spendingVisible = true;
function toggleSpendingVisibility() {
    const valueElement = document.getElementById('spendingValue');
    const iconElement = document.getElementById('spendingEyeIcon');

    if (!valueElement || !iconElement) return;

    if (spendingVisible) {
        // Hide spending
        valueElement.textContent = '••••••';
        iconElement.className = 'icon ion-eye-disabled';
        spendingVisible = false;
    } else {
        // Show spending
        valueElement.textContent = '24.5M';
        iconElement.className = 'icon ion-eye';
        spendingVisible = true;
    }
}

/**
 * Open Favorites Page
 */
function openFavorites() {
    showNotification('Tính năng Yêu thích đang được phát triển', 'info');
    // TODO: Navigate to favorites page
}

/**
 * Membership Tier Logic
 * Levels: Bronze -> Silver -> Gold -> Platinum -> Diamond
 */
const MEMBERSHIP_TIERS = [
    { name: 'Đồng', threshold: 0, color: '#cd7f32' },
    { name: 'Bạc', threshold: 1000, color: '#c0c0c0' },
    { name: 'Vàng', threshold: 3000, color: '#ffd700' },
    { name: 'Bạch Kim', threshold: 6000, color: '#e5e4e2' },
    { name: 'Kim Cương', threshold: 10000, color: '#b9f2ff' }
];

function calculateMembership(currentPoints) {
    let currentTierIndex = 0;

    // Find current tier
    for (let i = MEMBERSHIP_TIERS.length - 1; i >= 0; i--) {
        if (currentPoints >= MEMBERSHIP_TIERS[i].threshold) {
            currentTierIndex = i;
            break;
        }
    }

    const currentTier = MEMBERSHIP_TIERS[currentTierIndex];
    const nextTier = MEMBERSHIP_TIERS[currentTierIndex + 1] || null;

    let progressPercent = 100;
    let pointsNeeded = 0;

    if (nextTier) {
        const range = nextTier.threshold - currentTier.threshold;
        const progress = currentPoints - currentTier.threshold;
        progressPercent = Math.floor((progress / range) * 100);
        // Ensure at least 5% visibly filled if > 0
        if (progressPercent < 5 && progress > 0) progressPercent = 5;
        // Cap at 100%
        if (progressPercent > 100) progressPercent = 100;

        pointsNeeded = nextTier.threshold - currentPoints;
    }

    return {
        currentTierName: currentTier.name,
        nextTierName: nextTier ? nextTier.name : 'Max Level',
        progressPercent: progressPercent,
        pointsNeeded: pointsNeeded,
        isMaxLevel: !nextTier
    };
}

function initMembershipData() {
    // Simulated User Points (Example: 2450)
    // Note: Based on new tiers: Gold is 3000. So 2450 is Silver.
    // Let's adjust points to match the user's "Vàng" status in mockup or adjust tiers.
    // User mockup shows 2450 and "Vàng". So maybe Gold starts at 2000?
    // Let's override for now to match visual expectation of "Vàng"

    // Custom logic to match user request visuals
    const userPoints = 2450;

    // Let's use tiers: Dong(0), Bac(1000), Vang(2000), Bach Kim(5000), Kim Cuong(10000)
    const ADJUSTED_TIERS = [
        { name: 'Đồng', threshold: 0 },
        { name: 'Bạc', threshold: 1000 },
        { name: 'Vàng', threshold: 2000 },
        { name: 'Bạch Kim', threshold: 5000 },
        { name: 'Kim Cương', threshold: 10000 }
    ];

    let tierIdx = 0;
    for (let i = ADJUSTED_TIERS.length - 1; i >= 0; i--) {
        if (userPoints >= ADJUSTED_TIERS[i].threshold) {
            tierIdx = i;
            break;
        }
    }

    const curr = ADJUSTED_TIERS[tierIdx];
    const next = ADJUSTED_TIERS[tierIdx + 1];

    // Update UI
    const currentLabel = document.getElementById('currentTierLabel');
    const nextLabel = document.getElementById('nextTierLabel');
    const fill = document.getElementById('progressBarFill');
    const text = document.getElementById('progressText');
    const badge = document.querySelector('.user-member-badge');

    if (currentLabel) currentLabel.textContent = curr.name;

    if (next) {
        if (nextLabel) nextLabel.textContent = next.name;
        const range = next.threshold - curr.threshold;
        const earned = userPoints - curr.threshold;
        const pct = Math.min(100, Math.max(5, Math.floor((earned / range) * 100)));
        const needed = next.threshold - userPoints;

        if (fill) fill.style.width = `${pct}%`;
        if (text) text.textContent = `Còn ${needed} điểm`;
    } else {
        if (nextLabel) nextLabel.textContent = '';
        if (fill) fill.style.width = '100%';
        if (text) text.textContent = 'Max Level';
    }

    if (badge) badge.innerHTML = `${curr.name} <i class="icon ion-ribbon-b"></i>`;
}

// Toggle Visibility for Contact Info
function toggleAllContactInfo(btn) {
    const icon = btn.querySelector('.icon');
    const isHidden = icon.classList.contains('ion-eye-disabled');
    const values = document.querySelectorAll('.info-value.masked');

    if (isHidden) {
        // Show actual values
        icon.classList.remove('ion-eye-disabled');
        icon.classList.add('ion-eye');
        values.forEach(el => {
            el.textContent = el.getAttribute('data-value');
        });
    } else {
        // Mask values
        icon.classList.remove('ion-eye');
        icon.classList.add('ion-eye-disabled');
        values.forEach(el => {
            // Re-generate mask based on type (phone or email)
            const val = el.getAttribute('data-value');
            if (val.includes('@')) {
                // Email mask: keep 3 chars start, 4 chars end? or just simplify
                // Original: ngu*******@email.com
                // Simple logic: first 3 chars + *** + @ + domain
                const [user, domain] = val.split('@');
                const maskedUser = user.substring(0, 3) + '*******';
                el.textContent = maskedUser + '@' + domain;
            } else {
                // Phone mask: 091****678
                el.textContent = val.substring(0, 3) + '****' + val.substring(val.length - 3);
            }
        });
    }
}

// Call init on load
document.addEventListener('DOMContentLoaded', initMembershipData);

// ===========================
// NOTIFICATIONS FUNCTIONS
// ===========================

/**
 * Open Notifications Page
 */
function openNotifications() {
    switchNav('notifications');
}

/**
 * Filter Notifications by Type
 */
function filterNotifications(type) {
    const tabs = document.querySelectorAll('.notification-tab');
    const items = document.querySelectorAll('.notification-item');
    const emptyState = document.getElementById('notificationsEmpty');
    const notificationsList = document.getElementById('notificationsList');

    // Update active tab
    tabs.forEach(tab => {
        if (tab.getAttribute('data-filter') === type) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Filter items
    let visibleCount = 0;
    items.forEach(item => {
        const itemType = item.getAttribute('data-type');
        if (type === 'all' || itemType === type) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    // Show/hide empty state
    if (visibleCount === 0) {
        if (notificationsList) notificationsList.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
    } else {
        if (notificationsList) notificationsList.style.display = 'flex';
        if (emptyState) emptyState.style.display = 'none';
    }
}

/**
 * Mark All Notifications as Read
 */
function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');

    unreadItems.forEach(item => {
        item.classList.remove('unread');
        const badge = item.querySelector('.unread-badge');
        if (badge) {
            badge.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => badge.remove(), 300);
        }
    });

    showNotification('Đã đánh dấu tất cả là đã đọc', 'success');

    // Update notification badge count
    updateNotificationBadge();
}

/**
 * Mark Single Notification as Read
 */
function markAsRead(notificationElement) {
    if (notificationElement.classList.contains('unread')) {
        notificationElement.classList.remove('unread');
        const badge = notificationElement.querySelector('.unread-badge');
        if (badge) {
            badge.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => badge.remove(), 300);
        }
        // Update notification badge count
        updateNotificationBadge();
    }
}

/**
 * Update Notification Badge Count
 */
function updateNotificationBadge() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const badge = document.getElementById('notificationBadge');

    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Add click event to notification items
document.addEventListener('DOMContentLoaded', function () {
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function () {
            markAsRead(this);
        });
    });

    // Initialize notification badge count
    updateNotificationBadge();
});

// Add fadeOut animation
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(notificationStyle);

// Toggle Footer Section (Collapsible)
function toggleFooterSection(button) {
    const content = button.nextElementSibling;
    button.classList.toggle('active');
    content.classList.toggle('active');
}

// ===========================
// SETTINGS MODAL FUNCTIONS
// ===========================

/**
 * Open Profile Settings Modal
 */
function openProfileSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('active');
        // Lock body scroll
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close Profile Settings Modal
 */
function closeProfileSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('active');
        // Unlock body scroll
        document.body.style.overflow = '';
    }
}

// ===========================
// DYNAMIC FOOTER INJECTION
// ===========================

const footerHTML = `
<div class='profile-footer'>
    <!-- Collapsible Contact Sections -->
    <div class='footer-sections'>
        <!-- Chi nhánh Đà Lạt -->
        <div class='footer-section'>
            <button class='footer-section-header' onclick='toggleFooterSection(this)'>
                <span>SONG PHUONG - ĐÀ LẠT</span>
                <i class='icon ion-chevron-down'></i>
            </button>
            <div class='footer-section-content'>
                <p><i class='icon ion-ios-location'></i> 472-473 Phù Đổng Thiên Vương, P. Lâm Viên, Đà Lạt, Lâm Đồng</p>
                <p><i class='icon ion-ios-telephone'></i> Tel: 0263 999979 - 0849 585810</p>
                <p><i class='icon ion-ios-email'></i> Email: kinhoanh@songphuong.vn</p>
                <p><i class='icon ion-ios-clock'></i> 08h00 - 18h30 Thứ 2 đến CN</p>
            </div>
        </div>
        <!-- Chi nhánh HCM -->
        <div class='footer-section'>
            <button class='footer-section-header' onclick='toggleFooterSection(this)'>
                <span>SONG PHUONG - HCM</span>
                <i class='icon ion-chevron-down'></i>
            </button>
            <div class='footer-section-content'>
                <p><i class='icon ion-ios-location'></i> 694 Đặng Bệ, Phường Trung Mỹ Tây, TP HCM</p>
                <p><i class='icon ion-ios-telephone'></i> Tel: 0934 111369 - 0849 585810</p>
                <p><i class='icon ion-ios-email'></i> Email: kinhoanh@songphuong.vn</p>
                <p><i class='icon ion-ios-clock'></i> 08h00 - 20h30 Thứ 2 đến CN</p>
            </div>
        </div>
        <!-- Chi nhánh Nha Trang -->
        <div class='footer-section'>
            <button class='footer-section-header' onclick='toggleFooterSection(this)'>
                <span>SONG PHUONG - NHA TRANG</span>
                <i class='icon ion-chevron-down'></i>
            </button>
            <div class='footer-section-content'>
                <p><i class='icon ion-ios-location'></i> 01 Hòa Lư, Phường Nha Trang, Khánh Hòa</p>
                <p><i class='icon ion-ios-telephone'></i> Tel: 0905 616999 - 0849 585810</p>
                <p><i class='icon ion-ios-email'></i> Email: kinhoanh@songphuong.vn</p>
                <p><i class='icon ion-ios-clock'></i> 08h00 - 18h30 Thứ 2 đến CN</p>
            </div>
        </div>
        <!-- Chi nhánh Cần Thơ -->
        <div class='footer-section'>
            <button class='footer-section-header' onclick='toggleFooterSection(this)'>
                <span>TTBH SONG PHUONG - CẦN THƠ</span>
                <i class='icon ion-chevron-down'></i>
            </button>
            <div class='footer-section-content'>
                <p><i class='icon ion-ios-location'></i> 30 Nguyễn Văn Linh, P. Hưng Lợi, Ninh Kiều, Cần Thơ</p>
                <p><i class='icon ion-ios-telephone'></i> Tel: 0799 919 911</p>
                <p><i class='icon ion-ios-email'></i> Email: baohanhct@songphuong.vn</p>
                <p><i class='icon ion-ios-clock'></i> 08h00 - 18h30 Thứ 2 đến CN</p>
            </div>
        </div>
        <!-- Chi nhánh Đà Nẵng -->
        <div class='footer-section'>
            <button class='footer-section-header' onclick='toggleFooterSection(this)'>
                <span>TTBH SONG PHUONG - ĐÀ NẴNG</span>
                <i class='icon ion-chevron-down'></i>
            </button>
            <div class='footer-section-content'>
                <p><i class='icon ion-ios-location'></i> 40A Hàm Nghi, Q. Thanh Khê, TP Đà Nẵng</p>
                <p><i class='icon ion-ios-telephone'></i> Tel: 0236 3835566</p>
                <p><i class='icon ion-ios-email'></i> Email: baohanhdn@songphuong.vn</p>
                <p><i class='icon ion-ios-clock'></i> 08h00 - 18h30 Thứ 2 đến CN</p>
            </div>
        </div>
    </div>

    <!-- Policy Icons Row -->
    <div class='footer-policies'>
        <div class='policy-item'>
            <div class='policy-icon'><i class='icon ion-ios-box'></i></div>
            <div class='policy-label'>CHÍNH SÁCH GIAO HÀNG</div>
        </div>
        <div class='policy-item'>
            <div class='policy-icon'><i class='icon ion-loop'></i></div>
            <div class='policy-label'>ĐỔI TRẢ DỄ DÀNG</div>
        </div>
        <div class='policy-item'>
            <div class='policy-icon'><i class='icon ion-card'></i></div>
            <div class='policy-label'>THANH TOÁN TIỆN LỢI</div>
        </div>
        <div class='policy-item'>
            <div class='policy-icon'><i class='icon ion-chatbubbles'></i></div>
            <div class='policy-label'>HỖ TRỢ NHIỆT TÌNH</div>
        </div>
    </div>

    <!-- Continue with Policy Sections -->
    <div class='footer-sections'>
        <!-- Chính sách chung -->
        <div class='footer-section'>
            <button class='footer-section-header' onclick='toggleFooterSection(this)'>
                <span>CHÍNH SÁCH CHUNG</span>
                <i class='icon ion-chevron-down'></i>
            </button>
            <div class='footer-section-content'>
                <p>Chính sách Giao hàng toàn quốc</p>
                <p>Chính sách Đổi trả dễ dàng</p>
                <p>Chính sách Thanh toán tiện lợi</p>
                <p>Chính sách Bảo hành</p>
                <p>Chính sách Bảo mật thông tin</p>
            </div>
        </div>
        <!-- Hỗ trợ khách hàng -->
        <div class='footer-section'>
            <button class='footer-section-header' onclick='toggleFooterSection(this)'>
                <span>HỖ TRỢ KHÁCH HÀNG</span>
                <i class='icon ion-chevron-down'></i>
            </button>
            <div class='footer-section-content'>
                <p>Hướng dẫn mua hàng</p>
                <p>Hướng dẫn Trả góp</p>
                <p>Thanh toán - Giao hàng</p>
                <p>Tra cứu Bảo hành</p>
                <p>In hóa đơn điện tử</p>
                <p>Góp ý, Khiếu nại</p>
            </div>
        </div>
        <!-- Tổng đài hỗ trợ -->
        <div class='footer-section'>
            <button class='footer-section-header' onclick='toggleFooterSection(this)'>
                <span>TỔNG ĐÀI HỖ TRỢ</span>
                <i class='icon ion-chevron-down'></i>
            </button>
            <div class='footer-section-content'>
                <p><strong>Hotline:</strong> 0263 999979</p>
                <p><strong>Kinh doanh:</strong> 0849 585810</p>
                <p><strong>Bảo hành:</strong> 02633 604444</p>
            </div>
        </div>
    </div>

    <!-- Credits -->
    <div class='footer-credits'>
        <div class='credit-left'>
            © Song Phuong | Máy tính, Laptop, Linh kiện Chính hãng
        </div>
        <div class='credit-right'>
            Cung cấp bởi: <strong>Hoàng Minh Duong</strong>
        </div>
    </div>
</div>
`;

function initFooter() {
    const targets = ['build-pc-footer-placeholder'];
    targets.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = footerHTML;
    });
}

/**
 * Load warranty content from external file
 */
async function loadWarrantyContent() {
    const warrantyPlaceholder = document.getElementById('warranty-content-placeholder');

    // Only load if not already loaded
    if (warrantyPlaceholder && warrantyPlaceholder.innerHTML.trim() === '') {
        try {
            const response = await fetch('pages/warranty.html');
            if (response.ok) {
                const content = await response.text();
                warrantyPlaceholder.innerHTML = content;
            } else {
                warrantyPlaceholder.innerHTML = '<div class="error-message">Không thể tải nội dung bảo hành.</div>';
            }
        } catch (error) {
            console.error('Error loading warranty content:', error);
            warrantyPlaceholder.innerHTML = '<div class="error-message">Lỗi khi tải nội dung bảo hành.</div>';
        }
    }
}

// Call initFooter when DOM loads
document.addEventListener('DOMContentLoaded', initFooter);

/**
 * Open Product Detail Page
 * @param {number|string} productId - The product ID to view
 */
function openProductDetail(productId) {
    window.location.href = 'pages/product-details.html?productId=' + productId;
}

/**
 * Quick Add to Cart from Product List
 * @param {number|string} productId - The product ID to add
 */
function addToCartQuick(productId) {
    addToCartId(productId, 1);
    // quick feedback
    const btn = document.querySelector('.cart-btn');
    if (btn) {
        // small visual feedback could be added here
    }
}

// --- Cart helpers (localStorage) ---
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

function addToCartId(productId, qty = 1) {
    // In this file we don't have full product metadata; store id and qty.
    const cart = getCart();
    const idNum = Number(productId);
    let existing = cart.find(i => i.id === idNum);
    if (existing) {
        existing.qty = (existing.qty || 0) + qty;
    } else {
        cart.push({ id: idNum, qty: qty });
    }
    saveCart(cart);
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;
    const cart = getCart();
    const total = cart.reduce((s, item) => s + (item.qty || 0), 0);
    badge.textContent = total;
}

// Ensure badge shows current cart count on load
document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge();
});

/**
 * Initialize product click events
 * Automatically add click handlers to all product items
 */
function initProductClickEvents() {
    const productItems = document.querySelectorAll('.product-item:not(.poster):not(.promo-banner)');

    productItems.forEach((item, index) => {
        // Generate a product ID based on index (in real app, this would come from data)
        const productId = item.getAttribute('data-product-id') || (index + 1);

        // Make the product item clickable
        item.style.cursor = 'pointer';

        // Add click event to the product item (excluding button clicks)
        item.addEventListener('click', function (e) {
            // Don't navigate if clicking the buy button
            if (e.target.classList.contains('btn-buy')) {
                return;
            }
            openProductDetail(productId);
        });

        // Handle buy button click separately
        const buyBtn = item.querySelector('.btn-buy');
        if (buyBtn) {
            buyBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                addToCartQuick(productId);
            });
        }
    });
}

// ===========================
/* ===========================
   BANNER SLIDER
   =========================== */
function initBannerSlider() {
    const slider = document.querySelector('.banner-slider');
    const slides = document.querySelectorAll('.banner-link');
    const dots = document.querySelectorAll('.banner-dots .dot');

    if (!slider || slides.length === 0) return;

    let currentIndex = 0;
    let slideInterval;
    const intervalTime = 4000;

    function showSlide(index) {
        if (index >= slides.length) currentIndex = 0;
        else if (index < 0) currentIndex = slides.length - 1;
        else currentIndex = index;

        slider.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, idx) => {
            if (idx === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function startAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        stopAutoSlide();
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) showSlide(currentIndex - 1);
        startAutoSlide();
    }, { passive: true });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            stopAutoSlide();
            const index = parseInt(e.target.getAttribute('data-index'));
            if (!isNaN(index)) showSlide(index);
            startAutoSlide();
        });
    });

    startAutoSlide();
}

// Initialize default view (Home)
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initFooter === 'function') {
        initFooter();
    }
    // Switch to home view by default
    if (typeof switchNav === 'function') {
        switchNav('home');
    }
    // Init Banner Slider
    initBannerSlider();

    // ⭐ FIX: Initialize Products Rendering
    // Wait for ProductManager to be ready before rendering
    const initProducts = () => {
        if (window.ProductManager && ProductManager.isLoaded) {
            console.log('✅ ProductManager ready, rendering products...');
            renderHomeProducts({ reset: true, reason: 'initial_load' });
        } else {
            console.log('⏳ Waiting for ProductManager...');
            setTimeout(initProducts, 100);
        }
    };
    initProducts();
});
