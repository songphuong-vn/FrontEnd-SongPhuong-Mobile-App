const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Authentication
    username: {
        type: String,
        required: [true, 'Vui lòng nhập tên người dùng'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Tên người dùng phải có ít nhất 3 ký tự'],
        maxlength: [30, 'Tên người dùng không được quá 30 ký tự']
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
    },
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false // Don't return password by default
    },

    // Profile Information
    fullName: {
        type: String,
        required: [true, 'Vui lòng nhập họ tên'],
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
    },
    address: {
        type: String,
        trim: true
    },
    birthday: {
        type: Date
    },
    avatar: {
        type: String,
        default: 'icons/user-default.svg'
    },

    // Membership System
    memberTier: {
        type: String,
        enum: ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương'],
        default: 'Đồng'
    },
    totalSpending: {
        type: Number,
        default: 0
    },
    loyaltyPoints: {
        type: Number,
        default: 0
    },

    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    // Metadata
    lastLogin: {
        type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password was modified
    if (!this.isModified('password')) {
        return next();
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Update member tier based on spending
userSchema.methods.updateMemberTier = function () {
    const spending = this.totalSpending;
    if (spending >= 50000000) {
        this.memberTier = 'Kim Cương';
    } else if (spending >= 25000000) {
        this.memberTier = 'Bạch Kim';
    } else if (spending >= 10000000) {
        this.memberTier = 'Vàng';
    } else if (spending >= 5000000) {
        this.memberTier = 'Bạc';
    } else {
        this.memberTier = 'Đồng';
    }
    return this.memberTier;
};

// Virtual for points to next tier
userSchema.virtual('pointsToNextTier').get(function () {
    const tiers = {
        'Đồng': 5000000,
        'Bạc': 10000000,
        'Vàng': 25000000,
        'Bạch Kim': 50000000,
        'Kim Cương': Infinity
    };

    const nextTierAmount = tiers[this.memberTier];
    if (nextTierAmount === Infinity) return 0;

    return Math.max(0, nextTierAmount - this.totalSpending);
});

module.exports = mongoose.model('User', userSchema);
