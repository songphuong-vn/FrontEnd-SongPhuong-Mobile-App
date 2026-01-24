// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Client with token management
class APIClient {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = this.getToken();
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

    // Base request method
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
            throw error;
        }
    }

    // Mock Data for local testing
    getMockUser() {
        return {
            _id: 'local_mock_id_123',
            username: 'user',
            email: 'user@example.com',
            fullName: 'Người Dùng Mẫu',
            phone: '0912345678',
            role: 'user',
            memberTier: 'Kim Cương',
            totalSpending: 150000000,
            point: 5000,
            avatar: 'icons/user-default.svg',
            pointsToNextTier: 0,
            createdAt: new Date().toISOString()
        };
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
        // MOCK LOGIN CHECK
        if ((credentials.username === 'user' || credentials.username === 'admin') &&
            credentials.password === '123456') {

            console.log('Using MOCK LOGIN for local dev');
            const mockUser = this.getMockUser();
            const mockToken = 'mock_token_123456789';

            this.setToken(mockToken);
            this.setUser(mockUser);

            return {
                success: true,
                token: mockToken,
                user: mockUser
            };
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

    async getMe() {
        // MOCK GET ME CHECK
        if (this.token === 'mock_token_123456789') {
            return {
                success: true,
                data: this.getMockUser()
            };
        }
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
