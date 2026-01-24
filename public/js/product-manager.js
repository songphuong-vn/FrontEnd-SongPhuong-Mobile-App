/**
 * Product Manager - Quản lý dữ liệu sản phẩm từ CSV/JSON
 * Song Phương Mobile App
 * 
 * Tích hợp 9,926 sản phẩm từ database
 * Tối ưu: Load file nhẹ (1.5MB) trước, lazy load mô tả khi cần
 */

const ProductManager = {
    // Dữ liệu sản phẩm
    products: [],
    productsMap: new Map(), // Map SKU -> product for fast lookup
    productDetails: null, // Lazy loaded details
    categories: new Set(),
    subCategories: new Map(), // category -> [subCategories]
    brands: new Set(),
    isLoaded: false,
    isLoading: false,
    detailsLoaded: false,
    // Lazy details loader state
    loadedDetailChunks: new Set(),
    detailChunkPromises: new Map(),

    /**
     * Khởi tạo và load dữ liệu sản phẩm
     * Ưu tiên: 1. PRODUCTS_DATA (embedded JS) 2. fetch JSON
     */
    async init() {
        if (this.isLoaded || this.isLoading) {
            console.log('⚠️ ProductManager đã được tải hoặc đang tải');
            return;
        }
        this.isLoading = true;

        const startTime = performance.now();

        try {
            let data = null;
            let source = '';

            // Cách 1: Sử dụng PRODUCTS_DATA nếu đã được load từ products-data.js
            if (typeof PRODUCTS_DATA !== 'undefined' && Array.isArray(PRODUCTS_DATA)) {
                data = PRODUCTS_DATA;
                source = 'embedded JS (products-data.js)';
                console.log('📦 Sử dụng dữ liệu embedded từ PRODUCTS_DATA');
            } else {
                // Cách 2: Fallback fetch JSON nếu chạy qua HTTP server
                console.log('📍 PRODUCTS_DATA không tồn tại, thử fetch JSON...');
                const pathname = window.location.pathname.toLowerCase();
                
                const possiblePaths = [
                    '../database-product/products-lite.json',
                    'database-product/products-lite.json',
                    './database-product/products-lite.json'
                ];
                
                for (const path of possiblePaths) {
                    try {
                        console.log(`🔍 Thử tải từ: ${path}`);
                        const response = await fetch(path);
                        if (response.ok) {
                            data = await response.json();
                            source = path;
                            console.log(`✅ Load thành công từ: ${path}`);
                            break;
                        }
                    } catch (e) {
                        console.log(`❌ Không thể tải từ: ${path} - ${e.message}`);
                    }
                }
            }
            
            if (!data || !Array.isArray(data) || data.length === 0) {
                throw new Error('Không có dữ liệu sản phẩm');
            }
            
            console.log(`📦 Dữ liệu nhận được: ${data.length} sản phẩm`);
            
            this.processProducts(data);
            this.isLoaded = true;
            
            const loadTime = Math.round(performance.now() - startTime);
            console.log(`✅ Đã tải ${this.products.length} sản phẩm trong ${loadTime}ms từ ${source}`);
            
            // Dispatch event khi load xong
            window.dispatchEvent(new CustomEvent('productsLoaded', { 
                detail: { count: this.products.length, loadTime } 
            }));
        } catch (error) {
            console.error('❌ Lỗi tải sản phẩm:', error);
            console.error('❌ Chi tiết lỗi:', error.message);
            // Fallback: sử dụng dữ liệu mẫu nếu không load được
            this.loadSampleData();
        } finally {
            this.isLoading = false;
        }
    },

    /**
     * Lazy load mô tả chi tiết khi cần
     * Tạm thời skip load file 53MB, sử dụng mô tả mặc định
     */
    async loadProductDetails(sku) {
        // 1) Ưu tiên: lấy từ map chi tiết nếu có (nhúng qua JS để tránh CORS)
        try {
            if (typeof PRODUCT_DETAILS_BY_SKU !== 'undefined') {
                const hit = PRODUCT_DETAILS_BY_SKU[sku];
                if (hit && (hit.sd || hit.fd)) {
                    return { sd: hit.sd || '', fd: hit.fd || '' };
                }
            }
            // 1b) Kiểm tra các chunk đã load
            if (typeof PRODUCT_DETAILS_CHUNKS !== 'undefined') {
                const prefix = this.getDetailsChunkKey(sku);
                const chunk = PRODUCT_DETAILS_CHUNKS[prefix];
                const hit2 = chunk && chunk[sku];
                if (hit2 && (hit2.sd || hit2.fd)) {
                    return { sd: hit2.sd || '', fd: hit2.fd || '' };
                }
            }
        } catch (_) { /* ignore */ }

        // 2) Thử nạp chunk tương ứng theo SKU (lazy load qua <script>)
        try {
            const prefix = this.getDetailsChunkKey(sku);
            const loaded = await this.loadDetailsChunk(prefix);
            if (loaded && typeof PRODUCT_DETAILS_CHUNKS !== 'undefined') {
                const chunk = PRODUCT_DETAILS_CHUNKS[prefix];
                const hit3 = chunk && chunk[sku];
                if (hit3 && (hit3.sd || hit3.fd)) {
                    return { sd: hit3.sd || '', fd: hit3.fd || '' };
                }
            }
        } catch (_) { /* ignore */ }

        // 3) Fallback: mô tả mặc định dựa trên thông tin sản phẩm
        const product = this.getProductBySku(sku);
        if (!product) return null;
        return {
            sd: this.generateShortDescription(product),
            fd: this.generateFullDescription(product)
        };
    },

    // Xác định tên chunk theo SKU (3 ký tự đầu sau khi pad)
    getDetailsChunkKey(sku) {
        const s = String(sku || '').padStart(6, '0');
        return s.substring(0, 3);
    },

    // Nạp file chi tiết theo prefix: ../js/product-details/details-<prefix>.js
    async loadDetailsChunk(prefix) {
        if (!prefix) return false;
        if (this.loadedDetailChunks.has(prefix)) return true;
        if (this.detailChunkPromises.has(prefix)) return this.detailChunkPromises.get(prefix);

        const promise = new Promise((resolve) => {
            const script = document.createElement('script');
            // Đường dẫn tương đối từ pages/product-details.html
            script.src = `../js/product-details/details-${prefix}.js`;
            script.async = true;
            script.onload = () => { this.loadedDetailChunks.add(prefix); resolve(true); };
            script.onerror = () => { resolve(false); };
            document.head.appendChild(script);
        });

        this.detailChunkPromises.set(prefix, promise);
        const ok = await promise;
        this.detailChunkPromises.delete(prefix);
        return ok;
    },

    /**
     * Tạo mô tả ngắn từ thông tin sản phẩm
     */
    generateShortDescription(product) {
        const items = [];
        items.push(`<li>${product.title}</li>`);
        if (product.brand) items.push(`<li>Thương hiệu: ${product.brand}</li>`);
        items.push(`<li>Danh mục: ${product.category}</li>`);
        if (product.subCategory) items.push(`<li>Phân loại: ${product.subCategory}</li>`);
        items.push(`<li>Mã sản phẩm: ${product.sku}</li>`);
        if (product.onSale) items.push(`<li>Đang giảm giá ${product.discountPercent}%</li>`);
        return `<ul>${items.join('')}</ul>`;
    },

    /**
     * Tạo mô tả đầy đủ từ thông tin sản phẩm
     */
    generateFullDescription(product) {
        return `
            <h3>${product.title}</h3>
            <p><strong>Thương hiệu:</strong> ${product.brand || 'Song Phương'}</p>
            <p><strong>Danh mục:</strong> ${product.category}</p>
            ${product.subCategory ? `<p><strong>Phân loại:</strong> ${product.subCategory}</p>` : ''}
            <p><strong>Mã sản phẩm (SKU):</strong> ${product.sku}</p>
            ${product.onSale ? `<p><strong>Khuyến mãi:</strong> Giảm ${product.discountPercent}% - Tiết kiệm ${this.formatPrice(product.originalPrice - product.displayPrice)}</p>` : ''}
            <hr>
            <p>Sản phẩm chính hãng, bảo hành 12 tháng tại Song Phương.</p>
            <p>Liên hệ hotline <strong>1900 xxxx</strong> để được tư vấn chi tiết.</p>
        `;
    },

    /**
     * Xử lý dữ liệu sản phẩm từ JSON
     */
    processProducts(data) {
        this.products = data.map((item, index) => {
            const product = {
                id: index + 1,
                sku: item.s || '',
                title: item.n || '',
                name: item.n || '',
                salePrice: item.sp || null,
                originalPrice: item.rp || item.sp || 0,
                category: item.c || 'Khác',
                subCategory: item.sc || '',
                brand: item.b || '',
                shortDesc: item.sd || '',
                fullDesc: item.fd || '',
                // Giá hiển thị (ưu tiên giá khuyến mãi)
                displayPrice: item.sp || item.rp || 0,
                // Có đang giảm giá không
                onSale: item.sp && item.rp && item.sp < item.rp,
                // Phần trăm giảm giá
                discountPercent: (item.sp && item.rp && item.rp > item.sp) 
                    ? Math.round((1 - item.sp / item.rp) * 100) 
                    : 0,
                // Mặc định 5 sao cho mọi sản phẩm
                rating: 5,
                avgRating: 5.0,
                totalReviews: 1
            };

            // Lưu vào Map để tra cứu nhanh theo SKU
            this.productsMap.set(product.sku, product);
            
            // Thu thập danh mục
            if (product.category) {
                this.categories.add(product.category);
                
                // Lưu sub-category
                if (product.subCategory) {
                    if (!this.subCategories.has(product.category)) {
                        this.subCategories.set(product.category, new Set());
                    }
                    this.subCategories.get(product.category).add(product.subCategory);
                }
            }
            
            // Thu thập thương hiệu
            if (product.brand) {
                this.brands.add(product.brand);
            }

            return product;
        });
    },

    /**
     * Dữ liệu mẫu fallback
     */
    loadSampleData() {
        this.products = [
            {
                id: 1,
                sku: "000179",
                title: "CPU AMD RYZEN 3 2200G",
                name: "CPU AMD RYZEN 3 2200G (3.5 GHz boost 3.7 GHz, 4 nhân 4 luồng, 6MB Cache, Radeon Vega 8, Socket AM4)",
                salePrice: 2290000,
                originalPrice: 2590000,
                category: "CPU - Bộ vi xử lý",
                subCategory: "CPU AMD",
                brand: "AMD",
                displayPrice: 2290000,
                onSale: true,
                discountPercent: 12
            }
        ];
        this.productsMap.set("000179", this.products[0]);
        this.categories.add("CPU - Bộ vi xử lý");
        this.isLoaded = true;
    },

    /**
     * Lấy sản phẩm theo SKU
     */
    getProductBySku(sku) {
        return this.productsMap.get(sku) || null;
    },

    /**
     * Lấy sản phẩm theo ID
     */
    getProductById(id) {
        return this.products.find(p => p.id === parseInt(id)) || null;
    },

    /**
     * Tìm kiếm sản phẩm
     */
    searchProducts(query, options = {}) {
        const {
            limit = 50,
            category = null,
            subCategory = null,
            brand = null,
            minPrice = 0,
            maxPrice = Infinity,
            sortBy = 'relevance' // relevance, price-asc, price-desc, name
        } = options;

        let results = this.products;
        const searchLower = query.toLowerCase().trim();

        // Lọc theo từ khóa
        if (searchLower) {
            results = results.filter(p => 
                p.title.toLowerCase().includes(searchLower) ||
                p.sku.includes(searchLower) ||
                (p.brand && p.brand.toLowerCase().includes(searchLower))
            );
        }

        // Lọc theo danh mục
        if (category) {
            results = results.filter(p => p.category === category);
        }

        // Lọc theo danh mục con
        if (subCategory) {
            results = results.filter(p => p.subCategory === subCategory);
        }

        // Lọc theo thương hiệu
        if (brand) {
            results = results.filter(p => p.brand === brand);
        }

        // Lọc theo khoảng giá
        results = results.filter(p => 
            p.displayPrice >= minPrice && p.displayPrice <= maxPrice
        );

        // Sắp xếp
        switch (sortBy) {
            case 'price-asc':
                results.sort((a, b) => a.displayPrice - b.displayPrice);
                break;
            case 'price-desc':
                results.sort((a, b) => b.displayPrice - a.displayPrice);
                break;
            case 'name':
                results.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
                break;
            case 'discount':
                results.sort((a, b) => b.discountPercent - a.discountPercent);
                break;
            default:
                // Relevance: sản phẩm có giảm giá lên trước
                results.sort((a, b) => {
                    if (a.onSale && !b.onSale) return -1;
                    if (!a.onSale && b.onSale) return 1;
                    return b.discountPercent - a.discountPercent;
                });
        }

        return results.slice(0, limit);
    },

    /**
     * Lấy sản phẩm theo danh mục
     */
    getProductsByCategory(category, limit = 20) {
        return this.searchProducts('', { category, limit });
    },

    /**
     * Lấy sản phẩm đang giảm giá
     */
    getDiscountedProducts(limit = 20) {
        return this.products
            .filter(p => p.onSale)
            .sort((a, b) => b.discountPercent - a.discountPercent)
            .slice(0, limit);
    },

    /**
     * Lấy danh sách danh mục
     */
    getCategories() {
        return Array.from(this.categories).sort((a, b) => a.localeCompare(b, 'vi'));
    },

    /**
     * Lấy danh mục con
     */
    getSubCategories(category) {
        const subs = this.subCategories.get(category);
        return subs ? Array.from(subs).sort((a, b) => a.localeCompare(b, 'vi')) : [];
    },

    /**
     * Lấy danh sách thương hiệu
     */
    getBrands() {
        return Array.from(this.brands).filter(b => b).sort((a, b) => a.localeCompare(b, 'vi'));
    },

    /**
     * Format giá tiền VND
     */
    formatPrice(price) {
        if (!price || price === 0) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    },

    /**
     * Lấy sản phẩm ngẫu nhiên
     */
    getRandomProducts(limit = 10) {
        const shuffled = [...this.products].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    },

    /**
     * Lấy sản phẩm liên quan (cùng danh mục)
     */
    getRelatedProducts(product, limit = 8) {
        if (!product) return [];
        return this.products
            .filter(p => p.category === product.category && p.sku !== product.sku)
            .slice(0, limit);
    },

    /**
     * Thống kê
     */
    getStats() {
        const onSaleCount = this.products.filter(p => p.onSale).length;
        const avgPrice = this.products.reduce((sum, p) => sum + p.displayPrice, 0) / this.products.length;
        
        return {
            totalProducts: this.products.length,
            totalCategories: this.categories.size,
            totalBrands: this.brands.size,
            onSaleCount,
            averagePrice: Math.round(avgPrice)
        };
    },

    /**
     * Map danh mục cho Build PC
     */
    getBuildPCCategories() {
        return {
            'CPU': ['CPU - Bộ vi xử lý'],
            'Mainboard': ['Main - Bo Mạch Chủ'],
            'RAM': ['Ram - Bộ nhớ đệm'],
            'VGA': ['VGA - Card Màn Hình'],
            'SSD': ['SSD - HDD'],
            'HDD': ['SSD - HDD'],
            'PSU': ['PSU - Nguồn máy tính'],
            'Case': ['Case - Vỏ máy tính'],
            'Cooling': ['Tản Nhiệt Theo Hãng', 'Tản Nhiệt Khí CPU', 'Tản Nhiệt Nước CPU', 'Tản nhiệt Cougar', 'Fan Thùng Case'],
            'Monitor': ['Màn Hình Theo Hãng', 'Màn Hình Theo Nhu Cầu', 'Màn hình HKC'],
            'Keyboard': ['Keyboard - Bàn Phím', 'Phím Theo Nhu Cầu'],
            'Mouse': ['Mouse - Chuột', 'Chuột Theo Nhu Cầu'],
            'Headphone': ['Headphone - Tai Nghe', 'Tai Nghe Theo Nhu Cầu', 'Tai Nghe - Phone'],
            'Laptop': ['Laptop Theo Hãng', 'Laptop Theo Nhu Cầu', 'Laptop Intel', 'Laptop Theo Giá'],
            'PC': ['Máy Bộ Theo Hãng', 'Máy Bộ Theo Nhu Cầu', 'PC Gaming', 'PC Văn Phòng', 'Máy tính PC AI'],
            'Gaming Gear': ['Bàn-Ghế Gaming', 'Linh Kiện Phòng Game', 'Máy Chơi Game'],
            'Network': ['TB Mạng Theo Hãng', 'TB Mạng Khác', 'TB Phát Sóng Wifi'],
            'Camera': ['Camera Theo Hãng', 'Đầu Thu Camera', 'Camera Phân Loại', 'Camera Theo Nhu Cầu'],
            'Speaker': ['Âm Thanh Các Hãng', 'Loa Nghe Nhạc']
        };
    },

    /**
     * Lấy sản phẩm cho Build PC theo loại linh kiện
     */
    getProductsForBuildPC(componentType, limit = 50) {
        const categoryMap = this.getBuildPCCategories();
        const categories = categoryMap[componentType] || [];
        
        return this.products
            .filter(p => categories.some(cat => 
                p.category.toLowerCase().includes(cat.toLowerCase()) ||
                p.subCategory.toLowerCase().includes(cat.toLowerCase())
            ))
            .slice(0, limit);
    }
};

// Auto-init khi DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ProductManager.init());
} else {
    ProductManager.init();
}

// Export cho các module khác sử dụng
window.ProductManager = ProductManager;
