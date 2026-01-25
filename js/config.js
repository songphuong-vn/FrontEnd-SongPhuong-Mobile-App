/**
 * Application Configuration
 * Auto-detect environment and set appropriate configs
 */

(function () {
    // Detect environment
    const hostname = window.location.hostname;
    const IS_LOCALHOST = hostname === 'localhost' || hostname === '127.0.0.1';
    const IS_VERCEL = hostname.includes('vercel.app');

    // Environment name
    let ENVIRONMENT = 'production';
    if (IS_LOCALHOST) {
        ENVIRONMENT = 'development';
    } else if (IS_VERCEL) {
        ENVIRONMENT = 'staging';
    }

    // API Configuration
    let API_BASE_URL;
    if (IS_LOCALHOST) {
        // Development: Use local backend
        API_BASE_URL = 'http://localhost:5000/api';
    } else {
        // Production/Staging: Use production backend
        // TODO: Replace with your actual production API URL
        API_BASE_URL = 'https://your-backend-api.com/api';
    }

    // App Configuration
    const CONFIG = {
        // Environment
        ENVIRONMENT: ENVIRONMENT,
        IS_DEVELOPMENT: ENVIRONMENT === 'development',
        IS_STAGING: ENVIRONMENT === 'staging',
        IS_PRODUCTION: ENVIRONMENT === 'production',

        // API
        API_BASE_URL: API_BASE_URL,
        API_TIMEOUT: 10000, // 10 seconds

        // Features
        ENABLE_DEBUG: IS_LOCALHOST,
        ENABLE_MOCK_DATA: IS_LOCALHOST, // Enable Mock Data ONLY on Localhost for testing
        ENABLE_ANALYTICS: !IS_LOCALHOST,

        // UI
        TOAST_DURATION: 3000, // 3 seconds
        ANIMATION_DURATION: 300, // 300ms

        // Cache
        CACHE_DURATION: IS_LOCALHOST ? 0 : 3600000, // 1 hour in production

        // Paths (absolute from root)
        PATHS: {
            CSS: '/css',
            JS: '/js',
            IMAGES: '/images',
            ICONS: '/icons',
            PAGES: '/pages'
        },

        // App Info
        APP_NAME: 'Song Phương Mobile',
        APP_VERSION: '1.0.0',
        SUPPORT_HOTLINE: '0263 999979'
    };

    // Export to global scope
    window.APP_CONFIG = CONFIG;

    // Log config in development
    if (CONFIG.ENABLE_DEBUG) {
        console.group('🔧 App Configuration');
        console.log('Environment:', CONFIG.ENVIRONMENT);
        console.log('API URL:', CONFIG.API_BASE_URL);
        console.log('Debug Mode:', CONFIG.ENABLE_DEBUG);
        console.log('Full Config:', CONFIG);
        console.groupEnd();
    }

    // Warn if using mock data
    if (CONFIG.ENABLE_MOCK_DATA) {
        console.warn('⚠️ Mock Data Mode is ENABLED. Disable for production!');
    }

    // Check if backend is reachable (optional)
    if (CONFIG.ENABLE_DEBUG && !CONFIG.ENABLE_MOCK_DATA) {
        fetch(CONFIG.API_BASE_URL + '/health')
            .then(res => res.ok ? console.log('✅ Backend is reachable') : console.warn('⚠️ Backend returned error'))
            .catch(() => console.warn('❌ Backend is NOT reachable. Check API_BASE_URL in config.js'));
    }
})();
