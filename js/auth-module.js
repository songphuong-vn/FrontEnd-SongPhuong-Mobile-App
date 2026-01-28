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
            // Đảm bảo mở lại scroll khi đã đăng nhập
            document.body.style.overflow = '';
        } else {
            // User is not logged in - show login form
            loginState.style.display = 'flex';
            loggedState.style.display = 'none';
            // Đảm bảo mở lại scroll khi chưa đăng nhập
            document.body.style.overflow = '';
        }
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
                // Sync with legacy app logic
                if (response.user) {
                    const legacyContact = {
                        name: response.user.fullName || response.user.username,
                        phone: response.user.phone || '',
                        email: response.user.email || '',
                        address: response.user.address || ''
                    };
                    localStorage.setItem('userContactInfo', JSON.stringify(legacyContact));
                    // Trigger storage event to update UI elsewhere if needed
                    window.dispatchEvent(new Event('storage'));
                }

                this.showSuccess('Đăng nhập thành công!');
                setTimeout(() => {
                    this.checkAuthState();
                    // Nếu đang có cờ redirect hoặc open cart, có thể handle ở đây
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
        // Normalize possible user field names from various API responses
        const fullName = userData.fullName || userData.name || userData.displayName || userData.full_name || (userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : null) || 'User';
        const username = userData.username || userData.handle || userData.userName || (userData.email ? userData.email.split('@')[0] : '') || '';
        const memberTier = userData.memberTier || userData.tier || userData.rank || 'Thành viên';
        const totalSpending = Number(userData.totalSpending || userData.spending || userData.spent || 0) || 0;
        const pointsToNextTier = userData.pointsToNextTier || userData.points_to_next || userData.nextPoints || 0;
        const avatar = userData.avatar || userData.avatarUrl || userData.photo || 'icons/user-default.svg';

        // Primary ID-based updates (shell + other pages may contain these IDs)
        const nameEl = document.getElementById('profileUserName');
        if (nameEl) nameEl.textContent = fullName;

        const usernameEl = document.getElementById('profileUsername');
        if (usernameEl) usernameEl.textContent = `@${username}`;

        const badgeEl = document.getElementById('profileMemberBadge');
        if (badgeEl) badgeEl.innerHTML = `${memberTier} <i class="icon ion-ribbon-b"></i>`;

        const spendingEl = document.getElementById('spendingAmount');
        if (spendingEl) spendingEl.textContent = totalSpending.toLocaleString('vi-VN');

        const currentTierEl = document.getElementById('currentTierLabel') || document.getElementById('currentRank');
        if (currentTierEl) currentTierEl.textContent = memberTier;

        const nextTier = this.getNextTier(memberTier);
        const nextTierEl = document.getElementById('nextTierLabel') || document.getElementById('nextRank');
        if (nextTierEl) nextTierEl.textContent = nextTier;

        const progressPercent = this.calculateTierProgress(totalSpending, memberTier);
        const progressBar = document.getElementById('progressBarFill') || document.querySelector('.progress-bar-fill');
        if (progressBar) progressBar.style.width = progressPercent + '%';

        const progressText = document.getElementById('progressText') || document.querySelector('.progress-text');
        if (progressText) {
            if (memberTier === 'Kim Cương') progressText.textContent = 'Đã đạt cấp tối đa';
            else progressText.textContent = `Còn ${Number(pointsToNextTier || 0).toLocaleString('vi-VN')} điểm`;
        }

        // Avatar: support both #userAvatar and .user-avatar selectors
        try {
            const avatarEls = document.querySelectorAll('#userAvatar, .user-avatar, img.user-avatar');
            avatarEls.forEach(img => { if (img && avatar) img.src = avatar; });
        } catch (e) { /* ignore */ }

        // Class-based fallbacks and bulk updates
        try {
            // Update display name in elements using .user-name
            const nameNodes = document.querySelectorAll('.user-name');
            nameNodes.forEach(node => {
                const badge = node.querySelector('.membership-badge');
                const badgeHtml = badge ? badge.outerHTML : ` <span class="membership-badge">${memberTier} <i class="icon ion-ribbon-b"></i></span>`;
                node.innerHTML = `${fullName} ${badgeHtml}`;
            });

            // Update username/email-like elements
            const handleNodes = document.querySelectorAll('.user-email, .user-username, .user-handle');
            handleNodes.forEach(n => { n.textContent = `@${username}`; });

            // Update membership badges anywhere
            const mbNodes = document.querySelectorAll('.membership-badge');
            mbNodes.forEach(m => { m.innerHTML = `${memberTier} <i class="icon ion-ribbon-b"></i>`; });

            // Update spending wherever present
            const spendingNodes = document.querySelectorAll('.spending-text strong, #spendingAmount');
            spendingNodes.forEach(n => { n.textContent = totalSpending.toLocaleString('vi-VN'); });

            // Update progress fills and texts
            const progFills = document.querySelectorAll('.progress-bar-fill, #progressBarFill');
            progFills.forEach(p => { p.style.width = progressPercent + '%'; });
            const progTexts = document.querySelectorAll('.progress-text, #progressText');
            progTexts.forEach(pt => {
                if (memberTier === 'Kim Cương') pt.textContent = 'Đã đạt cấp tối đa';
                else pt.textContent = `Còn ${Number(pointsToNextTier || 0).toLocaleString('vi-VN')} điểm`;
            });

            // Update masked contact fields using their data-original attributes if present
            const phoneNodes = document.querySelectorAll('.masked-content[data-original]');
            phoneNodes.forEach(node => {
                const original = node.getAttribute('data-original') || '';
                // try to infer which field this is by label nearby
                const parent = node.closest('.info-item');
                if (parent) {
                    const label = parent.querySelector('.info-label');
                    if (label && /Số điện thoại|Phone/i.test(label.textContent)) {
                        node.setAttribute('data-original', userData.phone || userData.phoneNumber || '');
                    } else if (label && /Email/i.test(label.textContent)) {
                        node.setAttribute('data-original', userData.email || '');
                    } else if (label && /Địa chỉ|Address/i.test(label.textContent)) {
                        node.setAttribute('data-original', userData.address || '');
                    }
                }
            });
        } catch (err) {
            console.warn('Fallback UI updates failed', err);
        }

        // Emit a global event so other modules can react to auth changes
        try {
            const evt = new CustomEvent('auth:updated', { detail: { user: userData } });
            window.dispatchEvent(evt);
        } catch (e) { /* ignore */ }
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
