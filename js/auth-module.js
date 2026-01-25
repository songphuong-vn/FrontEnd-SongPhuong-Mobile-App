// Auth Module - Login/Register functionality integrated with Profile
class AuthModule {
    constructor() {
        this.currentView = 'login'; // 'login' or 'register'
        this.init();
    }

    init() {
        // Check authentication state on page load
        setTimeout(() => {
            this.checkAuthState();
        }, 100);

        // Setup form listeners
        this.setupFormListeners();
    }

    setupFormListeners() {
        // Profile login form
        const profileLoginForm = document.getElementById('profileLoginForm');
        if (profileLoginForm) {
            profileLoginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleProfileLogin(e.target);
            });
        }

        // Profile register form
        const profileRegisterForm = document.getElementById('profileRegisterForm');
        if (profileRegisterForm) {
            profileRegisterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleProfileRegister(e.target);
            });
        }
    }

    checkAuthState() {
        const loginState = document.getElementById('profile-login-state');
        const loggedState = document.getElementById('profile-logged-state');

        if (!loginState || !loggedState) return;

        if (api.isAuthenticated()) {
            // User is logged in - show profile
            loginState.style.display = 'none';
            loggedState.style.display = 'block';
            this.loadUserProfile();
        } else {
            // User is not logged in - show login form
            loginState.style.display = 'flex';
            loggedState.style.display = 'none';
        }

        // LUÔN LUÔN reset scroll để tránh bị kẹt
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        const scrollContent = document.querySelector('.scroll-content');
        if (scrollContent) scrollContent.style.overflow = '';
    }

    async handleProfileLogin(form) {
        const formData = new FormData(form);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        // Show loading
        this.showLoading();

        try {
            const response = await api.login(credentials);

            if (response.success) {
                this.showSuccess('Đăng nhập thành công!');
                setTimeout(() => {
                    this.checkAuthState();
                }, 800);
            }
        } catch (error) {
            this.showError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            this.hideLoading();
        }
    }

    async handleProfileRegister(form) {
        const formData = new FormData(form);

        // Check password confirmation
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            this.showError('Mật khẩu xác nhận không khớp');
            return;
        }

        const userData = {
            fullName: formData.get('fullName'),
            username: formData.get('username'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: password
        };

        this.showLoading();

        try {
            const response = await api.register(userData);

            if (response.success) {
                this.showSuccess('Đăng ký thành công! Chào mừng bạn đến Song Phương.');
                setTimeout(() => {
                    this.checkAuthState();
                }, 1000);
            }
        } catch (error) {
            this.showError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            this.hideLoading();
        }
    }

    async loadUserProfile() {
        try {
            const response = await api.getMe();
            if (response.success) {
                this.updateUIWithUserData(response.data);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            // If token is invalid, logout
            api.logout();
            this.checkAuthState();
        }
    }

    updateUIWithUserData(userData) {
        // Update profile name
        const nameEl = document.getElementById('profileUserName');
        if (nameEl) nameEl.textContent = userData.fullName || 'User';

        // Update username
        const usernameEl = document.getElementById('profileUsername');
        if (usernameEl) usernameEl.textContent = `@${userData.username}`;

        // Update member badge
        const badgeEl = document.getElementById('profileMemberBadge');
        if (badgeEl) {
            badgeEl.innerHTML = `${userData.memberTier} <i class="icon ion-ribbon-b"></i>`;
        }

        // Update spending
        const spendingEl = document.getElementById('spendingAmount');
        if (spendingEl) {
            spendingEl.textContent = userData.totalSpending.toLocaleString('vi-VN');
        }

        // Update tier labels
        const currentTierEl = document.getElementById('currentTierLabel');
        if (currentTierEl) currentTierEl.textContent = userData.memberTier;

        // Calculate next tier
        const nextTier = this.getNextTier(userData.memberTier);
        const nextTierEl = document.getElementById('nextTierLabel');
        if (nextTierEl) nextTierEl.textContent = nextTier;

        // Update progress bar
        const progressPercent = this.calculateTierProgress(userData.totalSpending, userData.memberTier);
        const progressBar = document.getElementById('progressBarFill');
        if (progressBar) {
            progressBar.style.width = progressPercent + '%';
        }

        // Update progress text
        const progressText = document.getElementById('progressText');
        if (progressText && userData.pointsToNextTier !== undefined) {
            if (userData.memberTier === 'Kim Cương') {
                progressText.textContent = 'Đã đạt cấp tối đa';
            } else {
                progressText.textContent = `Còn ${userData.pointsToNextTier.toLocaleString('vi-VN')} điểm`;
            }
        }

        // Update avatar if available
        if (userData.avatar && userData.avatar !== 'icons/user-default.svg') {
            const avatarEl = document.getElementById('userAvatar');
            if (avatarEl) avatarEl.src = userData.avatar;
        }

        // Also update alternative/profile page elements that use class-based selectors
        try {
            // Update any .user-name elements (preserve inner membership badge if present)
            const nameNodes = document.querySelectorAll('.user-name');
            nameNodes.forEach(node => {
                const badge = node.querySelector('.membership-badge');
                const badgeHtml = badge ? badge.outerHTML : '';
                node.innerHTML = `${userData.fullName || 'User'} ${badgeHtml}`;
            });

            // Update username-like elements (.user-email or .user-username)
            const emailNodes = document.querySelectorAll('.user-email, .user-username, .user-handle');
            emailNodes.forEach(n => { n.textContent = `@${userData.username || ''}`; });

            // Update membership badge display
            const mbNodes = document.querySelectorAll('.membership-badge');
            mbNodes.forEach(m => { m.innerHTML = `${userData.memberTier || 'Thành viên'} <i class="icon ion-ribbon-b"></i>`; });

            // Update spending display if present
            const spendingNodes = document.querySelectorAll('.spending-text strong, #spendingAmount');
            spendingNodes.forEach(n => { n.textContent = (userData.totalSpending || 0).toLocaleString('vi-VN'); });

            // Update progress bar and text
            const progFills = document.querySelectorAll('.progress-bar-fill, #progressBarFill');
            const progressPercent = this.calculateTierProgress(userData.totalSpending || 0, userData.memberTier);
            progFills.forEach(p => { p.style.width = progressPercent + '%'; });
            const progTexts = document.querySelectorAll('.progress-text, #progressText');
            progTexts.forEach(pt => {
                if (userData.memberTier === 'Kim Cương') pt.textContent = 'Đã đạt cấp tối đa';
                else pt.textContent = `Còn ${userData.pointsToNextTier ? userData.pointsToNextTier.toLocaleString('vi-VN') : 0} điểm`;
            });
        } catch (err) {
            console.warn('Fallback UI updates failed', err);
        }
    }

    getNextTier(currentTier) {
        const tiers = ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương'];
        const currentIndex = tiers.indexOf(currentTier);
        if (currentIndex === -1 || currentIndex === tiers.length - 1) {
            return 'Kim Cương';
        }
        return tiers[currentIndex + 1];
    }

    calculateTierProgress(spending, tier) {
        const thresholds = {
            'Đồng': { current: 0, next: 5000000 },
            'Bạc': { current: 5000000, next: 10000000 },
            'Vàng': { current: 10000000, next: 25000000 },
            'Bạch Kim': { current: 25000000, next: 50000000 },
            'Kim Cương': { current: 50000000, next: 50000000 }
        };

        const threshold = thresholds[tier];
        if (!threshold) return 0;

        if (tier === 'Kim Cương') return 100;

        const progress = ((spending - threshold.current) / (threshold.next - threshold.current)) * 100;
        return Math.min(Math.max(progress, 0), 100);
    }

    showLoading() {
        // You can add a loading overlay to the form
        console.log('Loading...');
    }

    hideLoading() {
        console.log('Loading complete');
    }

    showError(message) {
        alert('❌ ' + message);
    }

    showSuccess(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        } else {
            alert('✅ ' + message);
        }
    }

    showError(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            alert('❌ ' + message);
        }
    }
}

// Initialize auth module
const authModule = new AuthModule();

// Global functions for form switching
function showLoginForm() {
    document.getElementById('registerFormContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
    authModule.currentView = 'login';
}

function showRegisterForm() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
    authModule.currentView = 'register';
}

function handleLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        api.logout();
        // Reload profile view to show login form
        authModule.checkAuthState();
        // Optionally reload page to clear all data
        // window.location.reload();
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.authModule = authModule;
    window.showLoginForm = showLoginForm;
    window.showRegisterForm = showRegisterForm;
    window.handleLogout = handleLogout;
}
