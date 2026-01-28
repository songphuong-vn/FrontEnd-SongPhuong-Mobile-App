// API Configuration
// Use APP_CONFIG if available (from config.js), otherwise fallback to localhost
const API_BASE_URL = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.API_BASE_URL)
    ? APP_CONFIG.API_BASE_URL
    : 'http://localhost:5000/api';

// API Client with token management
class APIClient {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = this.getToken();

        // Log API URL in development
        if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.ENABLE_DEBUG) {
            console.log('🔌 API Client initialized with URL:', this.baseURL);
        }
    }

    // Token management
    getToken() {
        return localStorage.getItem('authToken');
    }

    setToken(token) {
        localStorage.setItem('authToken', token);
        this.token = token;
    }

    removeToken() {
        localStorage.removeItem('authToken');
        this.token = null;
    }

    // Get user from token
    getUserFromToken() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    removeUser() {
        localStorage.removeItem('user');
    }

    // Base request method - CHỈ GỌI API THẬT
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            // KHÔNG fallback sang mock - throw error thẳng
            throw error;
        }
    }

    // Auth endpoints
    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (data.success && data.token) {
            this.setToken(data.token);
            this.setUser(data.user);
        }

        return data;
    }

    async login(credentials) {
        // MOCK LOGIN for Localhost Testing
        if (true || (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.ENABLE_MOCK_DATA)) {
            console.warn('⚠️ Using Mock Login');
            if (credentials.username === 'user' && credentials.password === '123456') {
                const mockUser = this.getMockUser();

                // Return success immediately
                const response = { success: true, token: mockUser.token, user: mockUser };

                this.setToken(response.token);
                this.setUser(response.user);
                return response;
            }
            throw new Error('Sai tên đăng nhập hoặc mật khẩu (Mock: user/123456)');
        }

        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (data.success && data.token) {
            this.setToken(data.token);
            this.setUser(data.user);
        }

        return data;
    }

    // Helper: Mock User Data for testing without backend
    getMockUser() {
        return {
            id: 1,
            username: 'user',
            fullName: 'Khách hàng Test',
            email: 'test@example.com',
            phone: '0909123456',
            memberTier: 'Vàng',
            point: 2450,
            totalSpending: 15000000,
            token: 'mock-jwt-token-123456-local-only'
        };
    }

    async getMe() {
        return await this.request('/auth/me');
    }

    async updateProfile(profileData) {
        return await this.request('/auth/updateprofile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async updatePassword(passwordData) {
        return await this.request('/auth/updatepassword', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    }

    logout() {
        this.removeToken();
        this.removeUser();
        localStorage.removeItem('userContactInfo'); // Sync legacy
        window.location.href = '/';
    }

    // Order endpoints
    async createOrder(orderData) {
        return await this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getMyOrders() {
        return await this.request('/orders');
    }

    async getOrder(orderId) {
        return await this.request(`/orders/${orderId}`);
    }

    async cancelOrder(orderId, reason) {
        return await this.request(`/orders/${orderId}/cancel`, {
            method: 'PUT',
            body: JSON.stringify({ reason })
        });
    }

    // Check if user is logged in
    isAuthenticated() {
        return !!this.token;
    }
}

// Create global instance
const api = new APIClient();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIClient, api };
}
