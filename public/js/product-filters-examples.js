/**
 * Product Hidden Attributes - Ví Dụ Tích Hợp
 * Các ví dụ thực tế của việc sử dụng ProductHiddenAttributes trong ứng dụng
 */

// ========================================
// 1. FILTER PRODUCTS BY ADVANCED CRITERIA
// ========================================

/**
 * Lọc sản phẩm theo tiêu chí nâng cao
 * Được gọi từ các bộ lọc sidebar hoặc search form
 */
function filterProductsByAdvancedCriteria(criteria) {
    if (!window.ProductManager || !window.ProductManager.isLoaded) {
        console.error('❌ ProductManager chưa load');
        return [];
    }

    const results = ProductHiddenAttributes.searchByMultipleCriteria(
        ProductManager.products,
        criteria
    );

    console.log(`🔍 Tìm thấy ${results.length} sản phẩm phù hợp`);
    return results;
}

// ========================================
// 2. GET PRODUCTS BY CATEGORY
// ========================================

/**
 * Lấy sản phẩm theo danh mục chính
 */
function getProductsByMainCategory(categoryName) {
    return filterProductsByAdvancedCriteria({
        category: categoryName
    });
}

/**
 * Lấy sản phẩm theo danh mục phụ
 */
function getProductsBySubCategory(subCategoryName) {
    return filterProductsByAdvancedCriteria({
        subCategory: subCategoryName
    });
}

// ========================================
// 3. GET PRODUCTS BY BRAND
// ========================================

/**
 * Lấy tất cả sản phẩm của một thương hiệu
 */
function getProductsByBrand(brandName) {
    return filterProductsByAdvancedCriteria({
        brand: brandName
    });
}

/**
 * Lấy sản phẩm của nhiều thương hiệu
 */
function getProductsByMultipleBrands(brandArray) {
    const allProducts = [];
    brandArray.forEach(brand => {
        const products = getProductsByBrand(brand);
        allProducts.push(...products);
    });
    // Loại bỏ trùng lặp
    return [...new Map(allProducts.map(p => [p.s, p])).values()];
}

// ========================================
// 4. GET PRODUCTS BY PRICE RANGE
// ========================================

/**
 * Lấy sản phẩm trong khoảng giá cụ thể
 */
function getProductsByPrice(minPrice, maxPrice) {
    return filterProductsByAdvancedCriteria({
        priceMin: minPrice,
        priceMax: maxPrice
    });
}

/**
 * Lấy sản phẩm theo ID khoảng giá (defined in PRICE_RANGES)
 */
function getProductsByPriceRange(priceRangeId) {
    const range = PRICE_RANGES.find(r => r.id === priceRangeId);
    if (!range) {
        console.error(`❌ Khoảng giá không tồn tại: ${priceRangeId}`);
        return [];
    }
    return getProductsByPrice(range.min, range.max);
}

// ========================================
// 5. GET PRODUCTS BY TAGS
// ========================================

/**
 * Lấy sản phẩm có tag cụ thể
 */
function getProductsByTag(tag) {
    return filterProductsByAdvancedCriteria({
        tags: [tag]
    });
}

/**
 * Lấy sản phẩm có bất kỳ tag nào trong danh sách
 */
function getProductsByMultipleTags(tagArray) {
    return filterProductsByAdvancedCriteria({
        tags: tagArray
    });
}

// ========================================
// 6. GET PROMOTION PRODUCTS
// ========================================

/**
 * Lấy tất cả sản phẩm đang giảm giá
 */
function getPromotionProducts(limit = null) {
    const promos = filterProductsByAdvancedCriteria({
        isPromotion: true
    });

    // Sắp xếp theo % giảm giá (cao nhất trước)
    promos.sort((a, b) => {
        const discountA = ProductHiddenAttributes.getHiddenAttributes(a.s, a).discount;
        const discountB = ProductHiddenAttributes.getHiddenAttributes(b.s, b).discount;
        return discountB - discountA;
    });

    return limit ? promos.slice(0, limit) : promos;
}

/**
 * Lấy sản phẩm giảm giá theo danh mục
 */
function getPromotionProductsByCategory(categoryName, limit = 10) {
    const results = filterProductsByAdvancedCriteria({
        category: categoryName,
        isPromotion: true
    });

    // Sắp xếp theo % giảm giá
    results.sort((a, b) => {
        const discountA = ProductHiddenAttributes.getHiddenAttributes(a.s, a).discount;
        const discountB = ProductHiddenAttributes.getHiddenAttributes(b.s, b).discount;
        return discountB - discountA;
    });

    return results.slice(0, limit);
}

// ========================================
// 7. GET BESTSELLER PRODUCTS
// ========================================

/**
 * Lấy sản phẩm bán chạy
 * Chú ý: Cần cập nhật isBestseller từ database
 */
function getBestsellerProducts(limit = 10) {
    if (!window.ProductManager || !window.ProductManager.isLoaded) {
        return [];
    }

    const bestsellers = ProductManager.products.filter(p => {
        const attrs = ProductHiddenAttributes.getHiddenAttributes(p.s, p);
        return attrs.isBestseller === true;
    });

    return bestsellers.slice(0, limit);
}

// ========================================
// 8. GET NEW PRODUCTS
// ========================================

/**
 * Lấy sản phẩm mới nhất
 * Chú ý: Cần cập nhật isNew từ database
 */
function getNewProducts(limit = 10) {
    if (!window.ProductManager || !window.ProductManager.isLoaded) {
        return [];
    }

    const newProducts = ProductManager.products.filter(p => {
        const attrs = ProductHiddenAttributes.getHiddenAttributes(p.s, p);
        return attrs.isNew === true;
    });

    return newProducts.slice(0, limit);
}

// ========================================
// 9. GET STATISTICS & RECOMMENDATIONS
// ========================================

/**
 * Lấy thống kê sản phẩm của một danh mục
 */
function getCategoryStatistics(categoryName) {
    const products = getProductsByMainCategory(categoryName);
    return {
        category: categoryName,
        totalProducts: products.length,
        stats: ProductHiddenAttributes.getStatistics(products)
    };
}

/**
 * Lấy thương hiệu phổ biến nhất
 */
function getTopBrands(limit = 10) {
    if (!window.ProductManager || !window.ProductManager.isLoaded) {
        return [];
    }

    const stats = ProductHiddenAttributes.getStatistics(ProductManager.products);
    return Object.entries(stats.brandsObj)
        .filter(([brand]) => brand !== '') // Loại bỏ brand trống
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([brand, count]) => ({ brand, count }));
}

/**
 * Lấy danh sách tags phổ biến
 */
function getPopularTags(limit = 20) {
    if (!window.ProductManager || !window.ProductManager.isLoaded) {
        return [];
    }

    const stats = ProductHiddenAttributes.getStatistics(ProductManager.products);
    return Object.entries(stats.tagsObj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([tag, count]) => ({ tag, count }));
}

// ========================================
// 10. SEARCH & AUTOCOMPLETE
// ========================================

/**
 * Tự động gợi ý khi người dùng nhập tìm kiếm
 */
function getSearchSuggestions(query, type = 'all') {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    const suggestions = new Map();

    ProductManager.products.forEach(product => {
        const attrs = ProductHiddenAttributes.getHiddenAttributes(product.s, product);

        // Tìm kiếm theo tên sản phẩm
        if (type === 'all' || type === 'products') {
            if (product.n && product.n.toLowerCase().includes(lowerQuery)) {
                suggestions.set(`product:${product.s}`, {
                    type: 'product',
                    label: product.n,
                    value: product.s
                });
            }
        }

        // Tìm kiếm theo danh mục
        if (type === 'all' || type === 'categories') {
            if (attrs.subCategory && attrs.subCategory.toLowerCase().includes(lowerQuery)) {
                suggestions.set(`category:${attrs.subCategory}`, {
                    type: 'category',
                    label: attrs.subCategory,
                    value: attrs.subCategory
                });
            }
        }

        // Tìm kiếm theo thương hiệu
        if (type === 'all' || type === 'brands') {
            if (attrs.brand && attrs.brand.toLowerCase().includes(lowerQuery)) {
                suggestions.set(`brand:${attrs.brand}`, {
                    type: 'brand',
                    label: attrs.brand,
                    value: attrs.brand
                });
            }
        }
    });

    return Array.from(suggestions.values()).slice(0, 10);
}

// ========================================
// 11. FILTER UI HELPERS
// ========================================

/**
 * Xây dựng dữ liệu cho bộ lọc danh mục
 */
function buildCategoryFilterData() {
    if (!window.ProductManager || !window.ProductManager.isLoaded) {
        return [];
    }

    const stats = ProductHiddenAttributes.getStatistics(ProductManager.products);
    
    return Object.entries(stats.categoriesObj)
        .sort((a, b) => b[1] - a[1])
        .map(([category, count]) => ({
            id: category,
            label: category,
            count: count
        }));
}

/**
 * Xây dựng dữ liệu cho bộ lọc thương hiệu
 */
function buildBrandFilterData(limit = 20) {
    if (!window.ProductManager || !window.ProductManager.isLoaded) {
        return [];
    }

    const stats = ProductHiddenAttributes.getStatistics(ProductManager.products);
    
    return Object.entries(stats.brandsObj)
        .filter(([brand]) => brand !== '')
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([brand, count]) => ({
            id: brand,
            label: brand,
            count: count
        }));
}

/**
 * Xây dựng dữ liệu cho bộ lọc khoảng giá
 */
function buildPriceRangeFilterData() {
    if (!window.ProductManager || !window.ProductManager.isLoaded) {
        return [];
    }

    return PRICE_RANGES.map(range => {
        const count = getProductsByPrice(range.min, range.max).length;
        return {
            id: range.id,
            label: range.label,
            min: range.min,
            max: range.max,
            count: count
        };
    });
}

/**
 * Xây dựng dữ liệu cho bộ lọc tags
 */
function buildTagFilterData(limit = 30) {
    if (!window.ProductManager || !window.ProductManager.isLoaded) {
        return [];
    }

    const stats = ProductHiddenAttributes.getStatistics(ProductManager.products);
    
    return Object.entries(stats.tagsObj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([tag, count]) => ({
            id: tag,
            label: tag.replace(/-/g, ' '),
            count: count
        }));
}

// ========================================
// 12. UTILITY FUNCTIONS
// ========================================

/**
 * Format thuộc tính sản phẩm để hiển thị
 */
function formatProductAttributes(product) {
    const attrs = ProductHiddenAttributes.getHiddenAttributes(product.s, product);
    return {
        category: attrs.category,
        subCategory: attrs.subCategory,
        brand: attrs.brand,
        price: attrs.sellingPrice || attrs.regularPrice,
        originalPrice: attrs.regularPrice,
        discount: attrs.discount + '%',
        tags: attrs.tags.join(', '),
        isPromotion: attrs.isPromotion ? '✓ Đang giảm giá' : 'Giá bình thường',
        priceRange: attrs.priceRangeId
    };
}

/**
 * So sánh giá hai sản phẩm
 */
function compareProductPrices(product1, product2) {
    const attrs1 = ProductHiddenAttributes.getHiddenAttributes(product1.s, product1);
    const attrs2 = ProductHiddenAttributes.getHiddenAttributes(product2.s, product2);
    
    const price1 = attrs1.sellingPrice || attrs1.regularPrice || 0;
    const price2 = attrs2.sellingPrice || attrs2.regularPrice || 0;
    
    return {
        product1: {
            name: product1.n,
            price: price1,
            discount: attrs1.discount
        },
        product2: {
            name: product2.n,
            price: price2,
            discount: attrs2.discount
        },
        cheaper: price1 < price2 ? 'product1' : 'product2',
        priceDifference: Math.abs(price1 - price2)
    };
}

// ========================================
// 13. INTEGRATION WITH ProductManager
// ========================================

/**
 * Khởi tạo hidden attributes khi ProductManager load xong
 */
if (typeof window !== 'undefined') {
    window.addEventListener('productsLoaded', (event) => {
        console.log(`📦 ProductManager đã load ${event.detail.count} sản phẩm`);
        console.log(`⏱️ Thời gian load: ${event.detail.loadTime}ms`);
        
        // Có thể thêm logic khởi tạo thêm ở đây
        console.log('✅ Hidden attributes sẵn sàng sử dụng');
    });
}

// ========================================
// 14. EXPORT FUNCTIONS
// ========================================

// Xuất hàm cho sử dụng trong các file khác
if (typeof window !== 'undefined') {
    window.ProductFilters = {
        filterByAdvancedCriteria: filterProductsByAdvancedCriteria,
        getByMainCategory: getProductsByMainCategory,
        getBySubCategory: getProductsBySubCategory,
        getByBrand: getProductsByBrand,
        getByMultipleBrands: getProductsByMultipleBrands,
        getByPrice: getProductsByPrice,
        getByPriceRange: getProductsByPriceRange,
        getByTag: getProductsByTag,
        getByMultipleTags: getProductsByMultipleTags,
        getPromotions: getPromotionProducts,
        getPromotionsByCategory: getPromotionProductsByCategory,
        getBestsellers: getBestsellerProducts,
        getNewProducts: getNewProducts,
        getCategoryStats: getCategoryStatistics,
        getTopBrands: getTopBrands,
        getPopularTags: getPopularTags,
        getSearchSuggestions: getSearchSuggestions,
        buildCategoryFilterData: buildCategoryFilterData,
        buildBrandFilterData: buildBrandFilterData,
        buildPriceRangeFilterData: buildPriceRangeFilterData,
        buildTagFilterData: buildTagFilterData,
        formatAttributes: formatProductAttributes,
        comparePrice: compareProductPrices
    };
}
// Đã xóa file này vì không còn sử dụng.
