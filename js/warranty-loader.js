async function loadWarrantyContent() {
    const warrantyPlaceholder = document.getElementById('warranty-content-placeholder');
    if (!warrantyPlaceholder) return;

    // Kiểm tra đăng nhập - BẮT BUỘC
    if (!api || !api.isAuthenticated()) {
        warrantyPlaceholder.innerHTML = `
            <div class="warranty-page">
                <div class="empty-state" style="padding: 60px 20px; text-align: center;">
                    <i class="icon ion-locked" style="font-size: 80px; color: #ccc; margin-bottom: 20px;"></i>
                    <h3 style="color: #666; margin-bottom: 10px;">Vui lòng đăng nhập</h3>
                    <p style="color: #999;">Bạn cần đăng nhập để xem thông tin bảo hành sản phẩm</p>
                    <button class="primary-button" onclick="switchNav('profile')" style="margin-top: 20px; padding: 12px 30px;">
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        `;
        return;
    }

    // Show loading state
    warrantyPlaceholder.innerHTML = `
        <div class="warranty-page">
            <div style="padding: 60px 20px; text-align: center;">
                <i class="icon ion-load-c" style="font-size: 60px; color: #2e308a; animation: spin 1s linear infinite;"></i>
                <p style="color: #666; margin-top: 20px;">Đang tải dữ liệu bảo hành...</p>
            </div>
        </div>
    `;

    try {
        // 1. Get User Info
        const userRes = await api.getMe();
        if (!userRes.success) throw new Error('Không thể lấy thông tin người dùng');
        const user = userRes.data;

        // 2. Get Warranty Products từ API
        // TODO: Thay endpoint này bằng endpoint thật của backend
        const warrantyRes = await api.request('/warranty/products');
        const products = warrantyRes.success ? warrantyRes.data : [];

        // 3. Render UI
        renderWarrantyPage(user, products);

    } catch (error) {
        console.error('Error loading warranty:', error);
        warrantyPlaceholder.innerHTML = `
            <div class="warranty-page">
                <div class="empty-state" style="padding: 60px 20px; text-align: center;">
                    <i class="icon ion-alert-circled" style="font-size: 80px; color: #e74c3c; margin-bottom: 20px;"></i>
                    <h3 style="color: #666; margin-bottom: 10px;">Không thể tải dữ liệu</h3>
                    <p style="color: #999;">${error.message || 'Vui lòng thử lại sau'}</p>
                    <button class="primary-button" onclick="loadWarrantyContent()" style="margin-top: 20px; padding: 12px 30px;">
                        Thử lại
                    </button>
                </div>
            </div>
        `;
    }
}

function renderWarrantyPage(user, products) {
    const warrantyPlaceholder = document.getElementById('warranty-content-placeholder');
    if (!warrantyPlaceholder) return;

    const html = `
        <div class="warranty-page">
            <div class="warranty-user-info">
                <div class="warranty-user-header">
                    <i class="icon ion-person"></i>
                    <div class="warranty-user-details">
                        <h3>${user.fullName || user.username || 'Khách hàng'}</h3>
                        <span class="warranty-badge badge-${getTierClass(user.memberTier)}">${user.memberTier || 'Đồng'}</span>
                    </div>
                </div>
                ${user.email ? `<p class="warranty-contact"><i class="icon ion-email"></i> ${user.email}</p>` : ''}
                ${user.phone ? `<p class="warranty-contact"><i class="icon ion-ios-telephone"></i> ${user.phone}</p>` : ''}
            </div>

            <div class="warranty-header">
                <h2>Sản phẩm đang bảo hành</h2>
            </div>
            
            ${products.length > 0 ? `
            <div class="warranty-table-container">
                <table class="warranty-table">
                    <thead>
                        <tr>
                            <th class="stt-col">STT</th>
                            <th class="product-col">Sản phẩm</th>
                            <th>Thời hạn</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map((p, index) => `
                        <tr>
                            <td class="stt-cell center">${index + 1}</td>
                            <td>
                                <div style="font-weight:600; color:#333; margin-bottom:2px;">${p.productName || p.name}</div>
                                <div style="font-size:11px; color:#888;">S/N: ${p.serialNumber || p.serial || 'N/A'}</div>
                            </td>
                            <td>
                                <div style="font-size:12px; white-space:nowrap;">${formatDate(p.purchaseDate)}</div>
                                <div style="font-size:12px; color:#666; white-space:nowrap;">➝ ${formatDate(p.warrantyEndDate)}</div>
                            </td>
                            <td class="status-cell">
                                <span class="status-${getWarrantyStatus(p.warrantyEndDate)}" style="font-size:10px; white-space:nowrap;">
                                    ${getWarrantyStatusLabel(p.warrantyEndDate)}
                                </span>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : `
            <div class="empty-state" style="padding: 40px 20px; text-align: center;">
                <i class="icon ion-ios-box-outline" style="font-size: 60px; color: #ddd; margin-bottom: 15px;"></i>
                <h3 style="color: #666;">Chưa có sản phẩm bảo hành</h3>
                <p style="color: #999;">Các sản phẩm bạn mua sẽ được hiển thị tại đây</p>
            </div>
            `}
            
            <div class="warranty-footer-note">
                <p><i class="icon ion-information-circled"></i> Hotline hỗ trợ: <strong>0263 999979</strong></p>
            </div>
        </div>
    `;

    warrantyPlaceholder.innerHTML = html;
}

// Helper functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function getWarrantyStatus(endDate) {
    if (!endDate) return 'expired';
    const end = new Date(endDate);
    const now = new Date();
    const daysLeft = Math.floor((end - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'expired';
    if (daysLeft < 30) return 'warning';
    return 'active';
}

function getWarrantyStatusLabel(endDate) {
    const status = getWarrantyStatus(endDate);
    if (status === 'expired') return 'Hết hạn';
    if (status === 'warning') return 'Sắp hết hạn';
    return 'Còn bảo hành';
}
