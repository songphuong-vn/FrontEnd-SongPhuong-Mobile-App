/**
 * UI Helper Functions
 * Centralized utility functions for UI operations
 * @module ui-helpers
 */

/**
 * Format a number as Vietnamese Dong currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "1.000.000 ₫")
 * @example
 * formatCurrency(1000000) // "1.000.000 ₫"
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

/**
 * Show a toast notification to the user
 * @param {string} message - The message to display
 * @param {'info'|'success'|'error'} [type='info'] - The notification type
 * @returns {void}
 * @example
 * showNotification('Đã thêm vào giỏ hàng', 'success')
 */
function showNotification(message, type = 'info') {
    // Check if notifications are globally disabled
    if (typeof notificationsEnabled !== 'undefined' && !notificationsEnabled) return;

    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;

    const iconMap = {
        success: 'ion-checkmark-circled',
        error: 'ion-alert-circled',
        info: 'ion-information-circled'
    };

    toast.innerHTML = `
        <div class="toast-content">
            <i class="icon ${iconMap[type] || iconMap.info}"></i>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/**
 * Update a badge element's value and visibility
 * @param {string} selector - CSS selector for the badge element
 * @param {number} value - The value to display
 * @returns {void}
 * @example
 * setBadgeValue('#cartBadge', 5) // Shows "5" in cart badge
 */
function setBadgeValue(selector, value) {
    const badge = document.querySelector(selector);
    if (badge) {
        badge.textContent = value;
        badge.style.display = value > 0 ? 'flex' : 'none';
    }
}

/**
 * Create a debounced version of a function
 * Useful for search inputs and resize handlers
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} Debounced function
 * @example
 * const debouncedSearch = debounce(searchProducts, 300)
 * input.addEventListener('input', debouncedSearch)
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export to global scope for use in other scripts
if (typeof window !== 'undefined') {
    window.formatCurrency = formatCurrency;
    window.showNotification = showNotification;
    window.setBadgeValue = setBadgeValue;
    window.debounce = debounce;
}
