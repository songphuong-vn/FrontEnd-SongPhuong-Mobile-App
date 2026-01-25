/**
 * Warranty Manager Module
 * Manage product warranty information and tracking
 * @module warranty-manager
 */

class WarrantyManager {
    constructor() {
        this.storageKey = 'sp-warranty-products';
        this.products = this.loadFromStorage();
    }

    /**
     * Load warranty products from localStorage
     * @returns {Array} Warranty products
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load warranty data:', e);
            return [];
        }
    }

    /**
     * Save warranty products to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.products));
        } catch (e) {
            console.error('Failed to save warranty data:', e);
        }
    }

    /**
     * Add product to warranty tracking
     * @param {Object} product - Product information
     * @returns {boolean} Success status
     */
    addProduct(product) {
        if (!product || !product.sku) {
            console.error('Invalid product');
            return false;
        }

        const warrantyProduct = {
            id: product.sku,
            name: product.name || 'Unknown Product',
            sku: product.sku,
            purchaseDate: product.purchaseDate || new Date().toISOString().split('T')[0],
            warrantyPeriod: product.warrantyPeriod || 12, // months
            expiryDate: this.calculateExpiryDate(
                product.purchaseDate || new Date().toISOString().split('T')[0],
                product.warrantyPeriod || 12
            ),
            status: 'active',
            serialNumber: product.serialNumber || '',
            image: product.image || '/icons/placeholder.png',
            category: product.category || 'Electronics',
            notes: product.notes || ''
        };

        this.products.push(warrantyProduct);
        this.saveToStorage();
        return true;
    }

    /**
     * Calculate warranty expiry date
     * @param {string} purchaseDate - Purchase date (YYYY-MM-DD)
     * @param {number} months - Warranty period in months
     * @returns {string} Expiry date (YYYY-MM-DD)
     */
    calculateExpiryDate(purchaseDate, months) {
        const date = new Date(purchaseDate);
        date.setMonth(date.getMonth() + months);
        return date.toISOString().split('T')[0];
    }

    /**
     * Get all warranty products
     * @returns {Array} Warranty products
     */
    getProducts() {
        return this.products.map(product => ({
            ...product,
            remainingDays: this.getRemainingDays(product.expiryDate),
            isExpired: this.isExpired(product.expiryDate),
            statusText: this.getStatusText(product)
        }));
    }

    /**
     * Get active warranty products
     * @returns {Array} Active warranty products
     */
    getActiveProducts() {
        return this.getProducts().filter(p => !p.isExpired);
    }

    /**
     * Get expired warranty products
     * @returns {Array} Expired warranty products
     */
    getExpiredProducts() {
        return this.getProducts().filter(p => p.isExpired);
    }

    /**
     * Get product by ID
     * @param {string} id - Product ID
     * @returns {Object|null} Product or null
     */
    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return null;

        return {
            ...product,
            remainingDays: this.getRemainingDays(product.expiryDate),
            isExpired: this.isExpired(product.expiryDate),
            statusText: this.getStatusText(product)
        };
    }

    /**
     * Update product information
     * @param {string} id - Product ID
     * @param {Object} updates - Updates to apply
     * @returns {boolean} Success status
     */
    updateProduct(id, updates) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.products[index] = {
            ...this.products[index],
            ...updates
        };

        this.saveToStorage();
        return true;
    }

    /**
     * Remove product from warranty tracking
     * @param {string} id - Product ID
     * @returns {boolean} Success status
     */
    removeProduct(id) {
        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.id !== id);

        if (this.products.length !== initialLength) {
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Check if warranty is expired
     * @param {string} expiryDate - Expiry date (YYYY-MM-DD)
     * @returns {boolean} True if expired
     */
    isExpired(expiryDate) {
        return new Date(expiryDate) < new Date();
    }

    /**
     * Get remaining days until expiry
     * @param {string} expiryDate - Expiry date (YYYY-MM-DD)
     * @returns {number} Remaining days
     */
    getRemainingDays(expiryDate) {
        const diff = new Date(expiryDate) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Get status text for product
     * @param {Object} product - Product object
     * @returns {string} Status text
     */
    getStatusText(product) {
        const remaining = this.getRemainingDays(product.expiryDate);

        if (remaining < 0) return 'Hết hạn';
        if (remaining === 0) return 'Hết hạn hôm nay';
        if (remaining <= 30) return `Còn ${remaining} ngày`;
        if (remaining <= 90) return `Còn ${Math.ceil(remaining / 30)} tháng`;

        return 'Còn hạn';
    }

    /**
     * Clear all warranty data
     */
    clear() {
        this.products = [];
        this.saveToStorage();
    }

    /**
     * Get warranty statistics
     * @returns {Object} Statistics
     */
    getStats() {
        const all = this.getProducts();
        const active = all.filter(p => !p.isExpired);
        const expiringSoon = active.filter(p => p.remainingDays <= 30);
        const expired = all.filter(p => p.isExpired);

        return {
            total: all.length,
            active: active.length,
            expiringSoon: expiringSoon.length,
            expired: expired.length
        };
    }
}

// Export as singleton
const warrantyManager = new WarrantyManager();

if (typeof window !== 'undefined') {
    window.warrantyManager = warrantyManager;
}
