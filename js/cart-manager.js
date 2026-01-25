/**
 * Cart Manager Module
 * Centralized cart management with localStorage persistence
 * @module cart-manager
 */

class CartManager {
    constructor() {
        this.storageKey = 'sp-cart-items';
        this.items = this.loadFromStorage();
        this.listeners = [];
    }

    /**
     * Load cart from localStorage
     * @returns {CartItem[]} Array of cart items
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load cart from storage:', e);
            return [];
        }
    }

    /**
     * Save cart to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
            this.notifyListeners();
        } catch (e) {
            console.error('Failed to save cart to storage:', e);
        }
    }

    /**
     * Add item to cart
     * @param {Object} product - Product to add
     * @param {number} quantity - Quantity to add
     * @returns {boolean} Success status
     */
    addItem(product, quantity = 1) {
        if (!product || !product.sku) {
            console.error('Invalid product');
            return false;
        }

        const existingIndex = this.items.findIndex(item => item.id === product.sku);

        if (existingIndex >= 0) {
            // Update existing item
            this.items[existingIndex].qty += quantity;
        } else {
            // Add new item
            this.items.push({
                id: product.sku,
                name: product.name || 'Unknown Product',
                price: product.price || 0,
                qty: quantity,
                image: product.image || '/icons/placeholder.png'
            });
        }

        this.saveToStorage();
        return true;
    }

    /**
     * Update item quantity
     * @param {string} itemId - Item ID (SKU)
     * @param {number} newQty - New quantity
     * @returns {boolean} Success status
     */
    updateQuantity(itemId, newQty) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index === -1) return false;

        if (newQty <= 0) {
            return this.removeItem(itemId);
        }

        this.items[index].qty = newQty;
        this.saveToStorage();
        return true;
    }

    /**
     * Change item quantity by delta
     * @param {string} itemId - Item ID
     * @param {number} delta - Change amount (+1 or -1)
     * @returns {boolean} Success status
     */
    changeQuantity(itemId, delta) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return false;

        const newQty = item.qty + delta;
        return this.updateQuantity(itemId, newQty);
    }

    /**
     * Remove item from cart
     * @param {string} itemId - Item ID to remove
     * @returns {boolean} Success status
     */
    removeItem(itemId) {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== itemId);

        if (this.items.length !== initialLength) {
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Clear entire cart
     */
    clear() {
        this.items = [];
        this.saveToStorage();
    }

    /**
     * Get all cart items
     * @returns {CartItem[]} Array of cart items
     */
    getItems() {
        return [...this.items];
    }

    /**
     * Get cart item count
     * @returns {number} Total number of items
     */
    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.qty, 0);
    }

    /**
     * Get cart total price
     * @returns {number} Total price in VND
     */
    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    /**
     * Get cart subtotal (before shipping)
     * @returns {number} Subtotal in VND
     */
    getSubtotal() {
        return this.getTotal();
    }

    /**
     * Get estimated shipping fee
     * @returns {number} Shipping fee in VND
     */
    getShippingFee() {
        const subtotal = this.getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= 500000) return 0; // Free shipping over 500k
        return 30000; // Standard shipping
    }

    /**
     * Get grand total (including shipping)
     * @returns {number} Grand total in VND
     */
    getGrandTotal() {
        return this.getSubtotal() + this.getShippingFee();
    }

    /**
     * Check if cart is empty
     * @returns {boolean} True if cart is empty
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Subscribe to cart changes
     * @param {Function} callback - Callback function
     */
    subscribe(callback) {
        this.listeners.push(callback);
    }

    /**
     * Unsubscribe from cart changes
     * @param {Function} callback - Callback function to remove
     */
    unsubscribe(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    }

    /**
     * Notify all listeners of cart changes
     */
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.getItems());
            } catch (e) {
                console.error('Cart listener error:', e);
            }
        });
    }
}

// Export as singleton
const cartManager = new CartManager();

if (typeof window !== 'undefined') {
    window.cartManager = cartManager;
}
