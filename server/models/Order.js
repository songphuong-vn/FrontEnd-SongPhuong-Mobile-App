const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productImage: {
        type: String
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    subtotal: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    // User Reference
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Order Details
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    items: [orderItemSchema],

    // Pricing
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },

    // Shipping Information
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        district: String,
        ward: String,
        note: String
    },

    // Payment
    paymentMethod: {
        type: String,
        enum: ['cod', 'bank_transfer', 'credit_card', 'momo', 'zalopay'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paidAt: Date,

    // Order Status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'],
        default: 'pending'
    },

    // Delivery
    trackingNumber: String,
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,

    // Points & Rewards
    pointsEarned: {
        type: Number,
        default: 0
    },

    // Metadata
    notes: String,

}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // Count orders today to generate sequential number
        const todayStart = new Date(date.setHours(0, 0, 0, 0));
        const todayEnd = new Date(date.setHours(23, 59, 59, 999));

        const count = await this.constructor.countDocuments({
            createdAt: { $gte: todayStart, $lte: todayEnd }
        });

        const sequence = String(count + 1).padStart(4, '0');
        this.orderNumber = `SP${year}${month}${day}${sequence}`;
    }
    next();
});

// Calculate points earned
orderSchema.methods.calculatePoints = function () {
    // 1 point per 10,000 VND spent
    this.pointsEarned = Math.floor(this.total / 10000);
    return this.pointsEarned;
};

module.exports = mongoose.model('Order', orderSchema);
