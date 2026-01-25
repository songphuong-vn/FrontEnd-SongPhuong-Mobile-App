/**
 * User Manager Module
 * Centralized user profile and authentication state management
 * @module user-manager
 */

class UserManager {
    constructor() {
        this.storageKeys = {
            token: 'authToken',
            user: 'user',
            avatar: 'userAvatar',
            contactInfo: 'userContactInfo'
        };
        this.currentUser = this.loadUser();
    }

    /**
     * Load user from localStorage
     * @returns {User|null} User object or null
     */
    loadUser() {
        try {
            const userData = localStorage.getItem(this.storageKeys.user);
            return userData ? JSON.parse(userData) : null;
        } catch (e) {
            console.error('Failed to load user:', e);
            return null;
        }
    }

    /**
     * Save user to localStorage
     * @param {User} user - User object
     */
    saveUser(user) {
        try {
            localStorage.setItem(this.storageKeys.user, JSON.stringify(user));
            this.currentUser = user;
        } catch (e) {
            console.error('Failed to save user:', e);
        }
    }

    /**
     * Get current user
     * @returns {User|null} Current user or null
     */
    getUser() {
        return this.currentUser;
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} True if authenticated
     */
    isAuthenticated() {
        return !!this.getToken() && !!this.currentUser;
    }

    /**
     * Get authentication token
     * @returns {string|null} JWT token or null
     */
    getToken() {
        return localStorage.getItem(this.storageKeys.token);
    }

    /**
     * Set authentication token
     * @param {string} token - JWT token
     */
    setToken(token) {
        localStorage.setItem(this.storageKeys.token, token);
    }

    /**
     * Get user points
     * @returns {number} User loyalty points
     */
    getPoints() {
        return this.currentUser?.point || this.currentUser?.totalSpending || 0;
    }

    /**
     * Get user membership tier
     * @returns {string} Membership tier name
     */
    getMemberTier() {
        return this.currentUser?.memberTier || 'Đồng';
    }

    /**
     * Calculate membership tier based on points
     * @param {number} points - User points
     * @returns {Object} Tier information
     */
    calculateTier(points) {
        const tiers = [
            { name: 'Đồng', threshold: 0, color: '#cd7f32' },
            { name: 'Bạc', threshold: 1000, color: '#c0c0c0' },
            { name: 'Vàng', threshold: 2000, color: '#ffd700' },
            { name: 'Bạch Kim', threshold: 5000, color: '#e5e4e2' },
            { name: 'Kim Cương', threshold: 10000, color: '#b9f2ff' }
        ];

        let currentTier = tiers[0];
        let nextTier = tiers[1];

        for (let i = tiers.length - 1; i >= 0; i--) {
            if (points >= tiers[i].threshold) {
                currentTier = tiers[i];
                nextTier = tiers[i + 1] || null;
                break;
            }
        }

        const progress = nextTier
            ? Math.min(100, ((points - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100)
            : 100;

        return {
            current: currentTier,
            next: nextTier,
            progress: Math.round(progress),
            pointsToNext: nextTier ? nextTier.threshold - points : 0
        };
    }

    /**
     * Update user profile
     * @param {Object} updates - Profile updates
     */
    updateProfile(updates) {
        if (!this.currentUser) return;

        this.currentUser = {
            ...this.currentUser,
            ...updates
        };
        this.saveUser(this.currentUser);
    }

    /**
     * Save user avatar
     * @param {string} avatarDataUrl - Base64 image data URL
     */
    saveAvatar(avatarDataUrl) {
        try {
            localStorage.setItem(this.storageKeys.avatar, avatarDataUrl);
        } catch (e) {
            console.error('Failed to save avatar:', e);
        }
    }

    /**
     * Get user avatar
     * @returns {string|null} Avatar data URL or null
     */
    getAvatar() {
        return localStorage.getItem(this.storageKeys.avatar);
    }

    /**
     * Save contact information
     * @param {Object} contactInfo - Contact information
     */
    saveContactInfo(contactInfo) {
        try {
            localStorage.setItem(this.storageKeys.contactInfo, JSON.stringify(contactInfo));
        } catch (e) {
            console.error('Failed to save contact info:', e);
        }
    }

    /**
     * Get contact information
     * @returns {Object|null} Contact information or null
     */
    getContactInfo() {
        try {
            const data = localStorage.getItem(this.storageKeys.contactInfo);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load contact info:', e);
            return null;
        }
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem(this.storageKeys.token);
        localStorage.removeItem(this.storageKeys.user);
        this.currentUser = null;
    }

    /**
     * Clear all user data
     */
    clearAll() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        this.currentUser = null;
    }
}

// Export as singleton
const userManager = new UserManager();

if (typeof window !== 'undefined') {
    window.userManager = userManager;
}
