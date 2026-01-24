const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, subtotal, tax, shipping, discount, total } = req.body;

        const order = await Order.create({
            user: req.user.id,
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            tax,
            shipping,
            discount,
            total
        });

        // Calculate and add points
        order.calculatePoints();
        await order.save();

        res.status(201).json({
            success: true,
            message: 'Đơn hàng đã được tạo thành công',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo đơn hàng',
            error: error.message
        });
    }
};

// @desc    Get all orders for logged in user
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách đơn hàng',
            error: error.message
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'fullName email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Make sure user is order owner or admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Bạn không có quyền xem đơn hàng này'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin đơn hàng',
            error: error.message
        });
    }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        const { status, paymentStatus, trackingNumber } = req.body;

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (trackingNumber) order.trackingNumber = trackingNumber;

        // Update delivered time
        if (status === 'delivered' && !order.deliveredAt) {
            order.deliveredAt = Date.now();

            // Update user's total spending and tier
            const user = await User.findById(order.user);
            if (user) {
                user.totalSpending += order.total;
                user.loyaltyPoints += order.pointsEarned;
                user.updateMemberTier();
                await user.save();
            }
        }

        // Update payment time
        if (paymentStatus === 'paid' && !order.paidAt) {
            order.paidAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật đơn hàng thành công',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật đơn hàng',
            error: error.message
        });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Check ownership
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Bạn không có quyền hủy đơn hàng này'
            });
        }

        // Check if order can be cancelled
        if (['shipping', 'delivered'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: 'Không thể hủy đơn hàng đang giao hoặc đã giao'
            });
        }

        order.status = 'cancelled';
        order.cancelledAt = Date.now();
        order.cancellationReason = req.body.reason || 'Khách hàng yêu cầu hủy';

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Đơn hàng đã được hủy',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi hủy đơn hàng',
            error: error.message
        });
    }
};
