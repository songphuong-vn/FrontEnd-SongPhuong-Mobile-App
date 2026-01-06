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

/**
 * Khởi tạo tìm kiếm sản phẩm
 */
function initProductSearch() {
    const searchInput = document.querySelector('.header-search-fixed .search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
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
    
    searchInput.addEventListener('keypress', function(e) {
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
    
                let imageUrl = 'https://via.placeholder.com/200/f0f0f0/999?text=No+Image';
                if (product.image) {
                    if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
                        imageUrl = product.image;
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
                    }
        itemsSincePoster: 0,
        posterIndex: 0,
        posterInterval: 6,
        renderedCount: 0,
    };

    let homeInfiniteScrollSetup = false;
    let currentTab = null;

    // Chuyển SKU sang số để ưu tiên sản phẩm mới (SKU lớn hơn)
    const parseSkuNumber = (sku) => {
        const num = parseInt(String(sku || '').replace(/\D/g, ''), 10);
        return Number.isFinite(num) ? num : 0;
    };

    const sortedBigToSmall = [...allProducts].sort((a, b) => parseSkuNumber(b.sku) - parseSkuNumber(a.sku));
    const sortedSmallToBig = [...allProducts].sort((a, b) => parseSkuNumber(a.sku) - parseSkuNumber(b.sku));

    const products = [];
    const seenSku = new Set();
    let iBig = 0;
    let iSmall = 0;
    while (products.length < 30 && (iBig < sortedBigToSmall.length || iSmall < sortedSmallToBig.length)) {
        // Thêm 2 sản phẩm SKU lớn
        for (let k = 0; k < 2 && products.length < 30 && iBig < sortedBigToSmall.length; k++) {
            const candidate = sortedBigToSmall[iBig++];
            if (candidate && !seenSku.has(candidate.sku)) {
                products.push(candidate);
                seenSku.add(candidate.sku);
            }
        }

        // Thêm 1 sản phẩm SKU nhỏ
        if (products.length < 30 && iSmall < sortedSmallToBig.length) {
            const candidate = sortedSmallToBig[iSmall++];
            if (candidate && !seenSku.has(candidate.sku)) {
                products.push(candidate);
                seenSku.add(candidate.sku);
            }
        }
    }
    
    if (products.length === 0) {
        console.warn('⚠️ No products available to render');
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; width: 100%;">
                <i class="icon ion-alert-circled" style="font-size: 48px; color: #999;"></i>
                <p style="color: #999; margin-top: 15px; font-size: 14px;">Không có sản phẩm</p>
            </div>
        `;
        return;
    }

    console.log(`✅ Rendering ${products.length} products to home page...`);
    console.log(`Filtered out ${ProductManager.products.length - allProducts.length} products with price = 0`);
    console.log('First 3 products (SKU desc priority, 2:1 mix):', products.slice(0, 3).map(p => `${p.sku} - ${p.title} - ${ProductManager.formatPrice(p.displayPrice)}`));

    // Xóa loading indicator và tất cả nội dung cũ
    container.innerHTML = '';

    // Render sản phẩm thực từ database
    let productHTML = '';
    products.forEach((product, index) => {
        // Thêm poster sau mỗi 6 sản phẩm
        if (index === 6) {
            productHTML += `
                <div class="product-item poster promo-banner" data-category="promo">
                    <div class="product-image">
                        <img src="https://songphuong.vn/Content/uploads/2024/12/RTX-4070-Ti-SALE.jpg" 
                             alt="Khuyến mãi RTX 4070 Ti"
                             onerror="this.src='https://via.placeholder.com/270x480/e63946/fff?text=SALE'">
                    </div>
                </div>
            `;
        } else if (index === 13) {
            productHTML += `
                <div class="product-item poster promo-banner" data-category="promo">
                    <div class="product-image">
                        <img src="https://songphuong.vn/Content/uploads/2024/11/Gaming-Week-Banner.jpg" 
                             alt="Poster Gaming Week"
                             onerror="this.src='https://via.placeholder.com/270x480/ff6b35/fff?text=GAMING+WEEK'">
                    </div>
                </div>
            `;
        }

        const hasDiscount = product.onSale || product.displayPrice < product.originalPrice;
        const discountPercent = product.discountPercent || 
            (hasDiscount ? Math.round(((product.originalPrice - product.displayPrice) / product.originalPrice) * 100) : 0);
        
        // Lấy category từ mainCategory nếu có, không thì dùng category
        const categorySlug = (product.mainCategory || product.category || 'other').toLowerCase().replace(/\s+/g, '-');
        
        // Escape SKU để tránh lỗi HTML attribute
        const escapedSku = (product.sku || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const escapedTitle = (product.title || '').replace(/"/g, '&quot;');
        
        // Xử lý URL ảnh - nếu có image thì dùng, không thì dùng placeholder
        let imageUrl = 'https://via.placeholder.com/200/f0f0f0/999?text=No+Image';
        if (product.image) {
            // Nếu đã là URL đầy đủ thì dùng luôn
            if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
                imageUrl = product.image;
            } else {
                // Nếu là relative path, thêm base URL
                imageUrl = `https://product.hstatic.net/200000722513/product/${product.image}`;
            }
        }
        
        // Tạo rating stars (mặc định 5 sao nếu không có)
        const rating = product.rating || 5;
        const starsHTML = Array.from({length: 5}, (_, i) => 
            i < rating ? '<i class="icon ion-android-star" style="color: #ffc107;"></i>' : '<i class="icon ion-android-star-outline" style="color: #ddd;"></i>'
        ).join('');
        
        productHTML += `
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
                         onerror="this.src='https://via.placeholder.com/200/f0f0f0/999?text=No+Image'">
                </div>
                <div class="product-info">
                    <div class="product-sku" style="font-size: 11px; color: #999; margin: 0;">SKU: ${product.sku}</div>
                    <div class="product-name"><strong>${product.title}</strong></div>
                    <div class="product-rating" style="margin: 0; font-size: 14px;">
                        ${starsHTML}
                    </div>
                    <div class="product-price-wrapper">
                        ${hasDiscount && product.originalPrice ? `<div class="product-old-price" style="font-size: 13px; color: #999; text-decoration: line-through; margin-bottom: 3px;">${ProductManager.formatPrice(product.originalPrice)}</div>` : ''}
                        <div class="product-price" style="font-size: 16px; font-weight: 700; color: #e60000;">${ProductManager.formatPrice(product.displayPrice)}</div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = productHTML;

    // Thêm event listeners cho sản phẩm sau khi render
    setupProductClickHandlers();

    // Chạy lại dynamic posters và category nav
    initProductCategoryNav();

    console.log(`✅ Successfully rendered ${products.length} products from database`);
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
    container.addEventListener('click', function(e) {
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
 * Logic slider banner
 */
function initBannerSlider() {
    const slider = document.querySelector('.banner-slider');
    const slides = document.querySelectorAll('.banner-link');
    const dots = document.querySelectorAll('.dot');

    if (!slider || slides.length === 0) return;

    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let autoSlideInterval;

    // Ngăn chặn menu chuột phải mặc định
    window.oncontextmenu = function (event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    // SỰ KIỆN TOUCH VÀ MOUSE
    slides.forEach((slide, index) => {
        const slideImage = slide.querySelector('img');
        if (slideImage) slideImage.addEventListener('dragstart', (e) => e.preventDefault());

        // Touch events
        slide.addEventListener('touchstart', touchStart(index), { passive: true });
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove, { passive: false });

        // Mouse events (để test trên PC dễ hơn)
        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mouseleave', () => {
            if (isDragging) touchEnd();
        });
        slide.addEventListener('mousemove', touchMove);
    });

    function touchStart(index) {
        return function (event) {
            isDragging = true;
            currentIndex = index;
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            slider.style.transition = 'none'; // Tắt transition khi bắt đầu kéo để mượt
            clearInterval(autoSlideInterval);
        }
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            // Ngăn cuộn trang nếu đang kéo ngang rõ rệt
            if (Math.abs(currentPosition - startPos) > 10) {
                if (event.cancelable) event.preventDefault();
            }
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;

        // Nếu kéo đủ xa (> 70px) thì chuyển slide
        if (movedBy < -70 && currentIndex < slides.length - 1) {
            currentIndex += 1;
        }
        else if (movedBy > 70 && currentIndex > 0) {
            currentIndex -= 1;
        }

        setPositionByIndex();
        startAutoSlide(); // Khởi động lại auto slide
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        if (isDragging) {
            setSliderPosition();
            requestAnimationFrame(animation);
        }
    }

    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
        slider.style.transition = 'transform 0.3s ease-out'; // Bật lại transition
        currentTranslate = currentIndex * -window.innerWidth; // Giả sử width slider là 100vw hoặc lấy offsetWidth
        // Lấy chiều rộng chính xác của slider container thay vì window
        const sliderWidth = slider.parentElement.offsetWidth;
        currentTranslate = currentIndex * -sliderWidth;

        prevTranslate = currentTranslate;
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

// Khởi tạo ứng dụng khi DOM đã tải xong
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Khởi tạo ProductManager và tìm kiếm
document.addEventListener('DOMContentLoaded', async function() {
    // Đợi ProductManager load
    if (window.ProductManager) {
        await ProductManager.init();
        console.log('✅ ProductManager đã sẵn sàng với', ProductManager.products.length, 'sản phẩm');
        
        // Hiện thống kê trong console
        const stats = ProductManager.getStats();
        console.log('📊 Thống kê:', stats);
    }
    
    // Khởi tạo tìm kiếm
    initProductSearch();
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
document.addEventListener('DOMContentLoaded', function() {
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
        item.addEventListener('click', function(e) {
            // Don't navigate if clicking the buy button
            if (e.target.classList.contains('btn-buy')) {
                return;
            }
            openProductDetail(productId);
        });
        
        // Handle buy button click separately
        const buyBtn = item.querySelector('.btn-buy');
        if (buyBtn) {
            buyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                addToCartQuick(productId);
            });
        }
    });
}

// ===========================
// Initialize default view (Home)
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initFooter === 'function') {
        initFooter();
    }
    // Switch to home view by default
    if (typeof switchNav === 'function') {
        switchNav('home');
    }
});
