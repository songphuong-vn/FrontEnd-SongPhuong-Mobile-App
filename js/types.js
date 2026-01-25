/**
 * Type Definitions for Song Phương Mobile App
 * @file types.js
 * @description JSDoc type definitions for better IDE autocomplete and documentation
 */

/**
 * @typedef {Object} Product
 * @property {string} sku - Product SKU code
 * @property {string} name - Product name
 * @property {number} price - Product price in VND
 * @property {string} [image] - Product image URL
 * @property {string} [category] - Product category
 * @property {string} [brand] - Product brand
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id - Cart item ID (usually SKU)
 * @property {string} name - Product name
 * @property {number} price - Unit price
 * @property {number} qty - Quantity
 * @property {string} [image] - Product image URL
 */

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} username - Username
 * @property {string} fullName - Full name
 * @property {string} email - Email address
 * @property {string} phone - Phone number
 * @property {string} memberTier - Membership tier (Đồng, Bạc, Vàng, etc.)
 * @property {number} point - Loyalty points
 * @property {number} totalSpending - Total spending amount
 * @property {string} token - JWT authentication token
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Order ID
 * @property {string} date - Order date
 * @property {string} status - Order status (Hoàn thành, Đang giao, Chờ xử lý)
 * @property {string[]} items - List of item names
 * @property {number} total - Total amount
 * @property {string[]} [steps] - Delivery steps (for tracking)
 */

/**
 * @typedef {Object} AppConfig
 * @property {string} ENVIRONMENT - Current environment (development, staging, production)
 * @property {boolean} IS_DEVELOPMENT - Is development environment
 * @property {boolean} IS_STAGING - Is staging environment
 * @property {boolean} IS_PRODUCTION - Is production environment
 * @property {string} API_BASE_URL - API base URL
 * @property {number} API_TIMEOUT - API request timeout in ms
 * @property {boolean} ENABLE_DEBUG - Enable debug logging
 * @property {boolean} ENABLE_MOCK_DATA - Enable mock data mode
 * @property {boolean} ENABLE_ANALYTICS - Enable analytics
 */

/**
 * @typedef {'info'|'success'|'error'} NotificationType
 */

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success - Request success status
 * @property {*} [data] - Response data
 * @property {string} [message] - Response message
 * @property {string} [error] - Error message if failed
 */

// Export types to global scope for JSDoc usage
if (typeof window !== 'undefined') {
    window.AppTypes = {
        Product: {},
        CartItem: {},
        User: {},
        Order: {},
        AppConfig: {},
        APIResponse: {}
    };
}
