/**
 * Product Hidden Attributes
 * Quản lý các thuộc tính ẩn của sản phẩm để dễ dàng phân mục danh mục
 * 
 * Các thuộc tính ẩn bao gồm:
 * - mainCategoryId: ID danh mục chính
 * - subCategoryId: ID danh mục phụ
 * - tags: Mảng các tag (Gaming, Office, Design, v.v.)
 * - brands: Thương hiệu chính
 * - priceRange: Khoảng giá
 * - popularity: Mức độ phổ biến
 * - isNew: Sản phẩm mới
 * - isPromotion: Đang khuyến mãi
 * - isBestseller: Bán chạy
 * - hidden: Ẩn khỏi hiển thị
 */

// Ánh xạ danh mục chính
const MAIN_CATEGORY_MAP = {
    'PC Song Phương': 1,
    'Máy Tính Trọn Bộ': 2,
    'Laptop - Máy Tính Xách Tay': 3,
    'Linh Kiện Máy Tính': 4,
    'Ngoại Vi - Phụ Kiện': 5,
    'Màn Hình': 6,
    'Mạng - Bảo Mật - Lưu Điện': 7,
    'Bàn - Ghế Gaming': 8,
    'Khác': 9
};

// Ánh xạ danh mục phụ thường gặp
const SUB_CATEGORY_MAP = {
    // PC Song Phương
    'PC Gaming': 101,
    'PC Gaming Phổ Thông': 101,
    'PC Gaming Tầm trung': 102,
    'PC Gaming Cao cấp': 103,
    'PC Văn Phòng': 111,
    'PC Đồ Họa': 121,
    
    // Máy Tính Trọn Bộ
    'Máy Bộ Theo Hãng': 201,
    'Máy Bộ Theo Nhu Cầu': 202,
    'Máy Bộ Gaming': 203,
    'Máy Bộ Mini': 204,
    
    // Laptop
    'Laptop Theo Hãng': 301,
    'Laptop Theo Nhu Cầu': 302,
    'Laptop Gaming': 303,
    'Laptop Đồ họa-WS': 304,
    'Laptop Doanh nhân': 305,
    'Laptop Theo Giá': 306,
    'Laptop Theo LCD': 307,
    
    // Linh Kiện
    'CPU - Bộ vi xử lý': 401,
    'Main - Bo Mạch Chủ': 402,
    'VGA - Card Màn Hình': 403,
    'Ram - Bộ nhớ đệm': 404,
    'SSD - HDD': 405,
    'PSU - Nguồn máy tính': 406,
    'Tản Nhiệt Theo Hãng': 407,
    'Case - Vỏ máy tính': 408,
    
    // Ngoại Vi
    'Keyboard - Bàn Phím': 501,
    'Mouse - Chuột': 502,
    'Headphone - Tai Nghe': 503,
    'Monitor': 504,
    
    // Mạng
    'TB Mạng Khác': 701,
    'TB Mạng Theo Hãng': 702,
    'Đầu Thu Camera': 703
};

// Ánh xạ thương hiệu
const BRAND_MAP = {
    'Intel': 'intel',
    'AMD': 'amd',
    'Nvidia': 'nvidia',
    'ASUS': 'asus',
    'MSI': 'msi',
    'Gigabyte': 'gigabyte',
    'Corsair': 'corsair',
    'Kingston': 'kingston',
    'Samsung': 'samsung',
    'Western Digital': 'western-digital',
    'HP': 'hp',
    'Dell': 'dell',
    'Lenovo': 'lenovo',
    'Acer': 'acer',
    'TP-Link': 'tp-link',
    'Razer': 'razer',
    'SteelSeries': 'steelseries',
    'Logitec': 'logitec'
};

// Tag phổ biến
const COMMON_TAGS = [
    'gaming',
    'office',
    'design',
    'workstation',
    'mini',
    'laptop',
    'desktop',
    'custom-build',
    'premium',
    'budget-friendly',
    'portable',
    'high-performance',
    'business',
    'student',
    'streamer',
    'programmer',
    'content-creator'
];

// Khoảng giá
const PRICE_RANGES = [
    { id: 'under-5m', label: 'Dưới 5 triệu', min: 0, max: 5000000 },
    { id: '5-10m', label: '5 - 10 triệu', min: 5000000, max: 10000000 },
    { id: '10-20m', label: '10 - 20 triệu', min: 10000000, max: 20000000 },
    { id: '20-30m', label: '20 - 30 triệu', min: 20000000, max: 30000000 },
    { id: '30-50m', label: '30 - 50 triệu', min: 30000000, max: 50000000 },
    { id: 'above-50m', label: 'Trên 50 triệu', min: 50000000, max: Infinity }
];

/**
 * ProductHiddenAttributes - Quản lý thuộc tính ẩn
 */
const ProductHiddenAttributes = {
    // Lưu trữ các thuộc tính ẩn của sản phẩm
    attributesMap: new Map(), // SKU -> { hidden attributes object }

    /**
     * Nhận thuộc tính ẩn của một sản phẩm
     * @param {string} sku - SKU sản phẩm
     * @param {object} product - Đối tượng sản phẩm
     * @returns {object} Thuộc tính ẩn
     */
    getHiddenAttributes(sku, product) {
        // Kiểm tra cache trước
        if (this.attributesMap.has(sku)) {
            return this.attributesMap.get(sku);
        }

        // Nếu không có, tạo mới từ product data
        const attributes = this.extractAttributes(product);
        this.attributesMap.set(sku, attributes);
        return attributes;
    },

    /**
     * Trích xuất và tạo thuộc tính ẩn từ dữ liệu sản phẩm
     * @param {object} product - Đối tượng sản phẩm {n, s, c, sc, sp, rp, b}
     * @returns {object} Thuộc tính ẩn
     */
    extractAttributes(product) {
        const attributes = {
            sku: product.s,
            mainCategoryId: MAIN_CATEGORY_MAP[product.c] || 9,
            subCategoryId: SUB_CATEGORY_MAP[product.sc] || 99,
            category: product.c || 'Khác',
            subCategory: product.sc || 'Khác',
            brand: product.b || '',
            brandId: BRAND_MAP[product.b] || product.b.toLowerCase().replace(/\s+/g, '-'),
            name: product.n,
            sellingPrice: product.sp,
            regularPrice: product.rp,
            tags: this.generateTags(product),
            priceRangeId: this.getPriceRange(product.sp || product.rp),
            isNew: false, // Có thể cập nhật từ DB nếu cần
            isPromotion: (product.sp && product.rp && product.sp < product.rp),
            isBestseller: false, // Có thể cập nhật từ DB nếu cần
            hidden: false,
            discount: product.sp && product.rp ? Math.round(((product.rp - product.sp) / product.rp) * 100) : 0
        };

        return attributes;
    },

    /**
     * Tạo danh sách tags dựa trên thông tin sản phẩm
     * @param {object} product - Đối tượng sản phẩm
     * @returns {array} Mảng tags
     */
    generateTags(product) {
        const tags = [];
        const name = (product.n || '').toLowerCase();
        const category = (product.sc || '').toLowerCase();
        const brand = (product.b || '').toLowerCase();

        // Thêm tags dựa trên danh mục
        if (category.includes('gaming')) tags.push('gaming');
        if (category.includes('office') || category.includes('văn phòng')) tags.push('office');
        if (category.includes('design') || category.includes('đồ họa')) tags.push('design');
        if (category.includes('workstation') || category.includes('ws')) tags.push('workstation');
        if (category.includes('mini')) tags.push('mini');
        if (category.includes('laptop') || category.includes('xách tay')) tags.push('laptop');
        if (category.includes('pc') || category.includes('desktop')) tags.push('desktop');

        // Thêm tags dựa trên tên sản phẩm
        if (name.includes('rgb') || name.includes('argb')) tags.push('rgb');
        if (name.includes('wireless') || name.includes('không dây')) tags.push('wireless');
        if (name.includes('mechanical') || name.includes('cơ')) tags.push('mechanical');
        if (name.includes('portable') || name.includes('di động')) tags.push('portable');
        if (name.includes('budget') || product.sp < 5000000) tags.push('budget-friendly');
        if (name.includes('premium') || name.includes('pro') || product.rp > 30000000) tags.push('premium');
        if (name.includes('aio') || name.includes('nước')) tags.push('liquid-cooled');
        if (name.includes('air') || name.includes('khí')) tags.push('air-cooled');

        // Thêm tags dựa trên thương hiệu
        if (brand.includes('gaming') || brand.includes('asus') && name.includes('rog')) tags.push('gaming-brand');
        if (brand.includes('business')) tags.push('business');

        // Thêm tag về mức giá
        const price = product.sp || product.rp;
        if (price <= 5000000) tags.push('budget');
        else if (price <= 15000000) tags.push('mid-range');
        else if (price <= 30000000) tags.push('high-end');
        else tags.push('ultra-premium');

        return [...new Set(tags)]; // Loại bỏ trùng lặp
    },

    /**
     * Lấy ID khoảng giá
     * @param {number} price - Giá bán
     * @returns {string} ID khoảng giá
     */
    getPriceRange(price) {
        if (!price) return 'unknown';
        for (const range of PRICE_RANGES) {
            if (price >= range.min && price < range.max) {
                return range.id;
            }
        }
        return 'above-50m';
    },

    /**
     * Lọc sản phẩm theo danh mục phụ
     * @param {array} products - Mảng sản phẩm
     * @param {string} subCategoryName - Tên danh mục phụ
     * @returns {array} Sản phẩm đã lọc
     */
    filterBySubCategory(products, subCategoryName) {
        return products.filter(p => {
            const attrs = this.getHiddenAttributes(p.s, p);
            return attrs.subCategory === subCategoryName;
        });
    },

    /**
     * Lọc sản phẩm theo thương hiệu
     * @param {array} products - Mảng sản phẩm
     * @param {string} brandName - Tên thương hiệu
     * @returns {array} Sản phẩm đã lọc
     */
    filterByBrand(products, brandName) {
        return products.filter(p => {
            const attrs = this.getHiddenAttributes(p.s, p);
            return attrs.brand === brandName;
        });
    },

    /**
     * Lọc sản phẩm theo tag
     * @param {array} products - Mảng sản phẩm
     * @param {string} tag - Tag để lọc
     * @returns {array} Sản phẩm đã lọc
     */
    filterByTag(products, tag) {
        return products.filter(p => {
            const attrs = this.getHiddenAttributes(p.s, p);
            return attrs.tags.includes(tag);
        });
    },

    /**
     * Lọc sản phẩm theo khoảng giá
     * @param {array} products - Mảng sản phẩm
     * @param {number} minPrice - Giá tối thiểu
     * @param {number} maxPrice - Giá tối đa
     * @returns {array} Sản phẩm đã lọc
     */
    filterByPriceRange(products, minPrice, maxPrice) {
        return products.filter(p => {
            const price = p.sp || p.rp;
            return price >= minPrice && price <= maxPrice;
        });
    },

    /**
     * Tìm kiếm sản phẩm theo nhiều tiêu chí
     * @param {array} products - Mảng sản phẩm
     * @param {object} criteria - Tiêu chí tìm kiếm {category, brand, tags, priceMin, priceMax, tags}
     * @returns {array} Sản phẩm phù hợp
     */
    searchByMultipleCriteria(products, criteria) {
        let filtered = products;

        if (criteria.category) {
            filtered = filtered.filter(p => {
                const attrs = this.getHiddenAttributes(p.s, p);
                return attrs.category === criteria.category;
            });
        }

        if (criteria.subCategory) {
            filtered = filtered.filter(p => {
                const attrs = this.getHiddenAttributes(p.s, p);
                return attrs.subCategory === criteria.subCategory;
            });
        }

        if (criteria.brand) {
            filtered = filtered.filter(p => {
                const attrs = this.getHiddenAttributes(p.s, p);
                return attrs.brand === criteria.brand;
            });
        }

        if (criteria.tags && Array.isArray(criteria.tags)) {
            filtered = filtered.filter(p => {
                const attrs = this.getHiddenAttributes(p.s, p);
                return criteria.tags.some(tag => attrs.tags.includes(tag));
            });
        }

        if (criteria.priceMin !== undefined && criteria.priceMax !== undefined) {
            filtered = this.filterByPriceRange(filtered, criteria.priceMin, criteria.priceMax);
        }

        if (criteria.isPromotion !== undefined) {
            filtered = filtered.filter(p => {
                const attrs = this.getHiddenAttributes(p.s, p);
                return attrs.isPromotion === criteria.isPromotion;
            });
        }

        if (criteria.isNew !== undefined) {
            filtered = filtered.filter(p => {
                const attrs = this.getHiddenAttributes(p.s, p);
                return attrs.isNew === criteria.isNew;
            });
        }

        return filtered;
    },

    /**
     * Lấy thống kê về sản phẩm
     * @param {array} products - Mảng sản phẩm
     * @returns {object} Thống kê
     */
    getStatistics(products) {
        const stats = {
            totalProducts: products.length,
            categories: new Map(),
            brands: new Map(),
            priceRanges: new Map(),
            avgPrice: 0,
            totalValue: 0,
            discountedProducts: 0,
            tags: new Map()
        };

        let totalPrice = 0;

        products.forEach(p => {
            const attrs = this.getHiddenAttributes(p.s, p);
            const price = attrs.sellingPrice || attrs.regularPrice || 0;

            // Thống kê danh mục
            stats.categories.set(
                attrs.subCategory,
                (stats.categories.get(attrs.subCategory) || 0) + 1
            );

            // Thống kê thương hiệu
            if (attrs.brand) {
                stats.brands.set(
                    attrs.brand,
                    (stats.brands.get(attrs.brand) || 0) + 1
                );
            }

            // Thống kê khoảng giá
            stats.priceRanges.set(
                attrs.priceRangeId,
                (stats.priceRanges.get(attrs.priceRangeId) || 0) + 1
            );

            // Thống kê tags
            attrs.tags.forEach(tag => {
                stats.tags.set(tag, (stats.tags.get(tag) || 0) + 1);
            });

            // Tính giá trung bình
            totalPrice += price;
            stats.totalValue += price;

            // Đếm sản phẩm khuyến mãi
            if (attrs.isPromotion) {
                stats.discountedProducts++;
            }
        });

        stats.avgPrice = Math.round(totalPrice / products.length);

        // Chuyển Map thành Object để dễ sử dụng
        stats.categoriesObj = Object.fromEntries(stats.categories);
        stats.brandsObj = Object.fromEntries(stats.brands);
        stats.priceRangesObj = Object.fromEntries(stats.priceRanges);
        stats.tagsObj = Object.fromEntries(stats.tags);

        return stats;
    },

    /**
     * In thông tin thuộc tính ẩn của một sản phẩm (debug)
     * @param {object} product - Sản phẩm
     */
    debugProduct(product) {
        const attrs = this.getHiddenAttributes(product.s, product);
        console.group(`📦 Product: ${product.n}`);
        console.log('SKU:', attrs.sku);
        console.log('Category:', attrs.category);
        console.log('Sub Category:', attrs.subCategory);
        console.log('Brand:', attrs.brand);
        console.log('Price:', attrs.sellingPrice || attrs.regularPrice);
        console.log('Price Range:', attrs.priceRangeId);
        console.log('Tags:', attrs.tags);
        console.log('Is Promotion:', attrs.isPromotion);
        console.log('Discount:', attrs.discount + '%');
        console.groupEnd();
    }
};

// Xuất cho sử dụng toàn cục
if (typeof window !== 'undefined') {
    window.ProductHiddenAttributes = ProductHiddenAttributes;
    window.MAIN_CATEGORY_MAP = MAIN_CATEGORY_MAP;
    window.SUB_CATEGORY_MAP = SUB_CATEGORY_MAP;
    window.BRAND_MAP = BRAND_MAP;
    window.PRICE_RANGES = PRICE_RANGES;
}
