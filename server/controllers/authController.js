const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendTokenResponse } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { username, email, password, fullName, phone } = req.body;

        // Check if user exists
        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: userExists.email === email
                    ? 'Email đã được sử dụng'
                    : 'Tên người dùng đã tồn tại'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            fullName,
            phone
        });

        // Send token response
        sendTokenResponse(user, 201, res);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo tài khoản',
            error: error.message
        });
    }
};
/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = [
    // Validation
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Tên đăng nhập không được để trống'),
    body('password')
        .notEmpty()
        .withMessage('Mật khẩu không được để trống'),

    async (req, res, next) => {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: errors.array()[0].msg
                });
            }

            const { username, password } = req.body;

            // Find user by username (case insensitive)
            const user = await User.findOne({
                username: username.toLowerCase()
            }).select('+password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Tên đăng nhập hoặc mật khẩu không đúng'
                });
            }

            // Check if password matches
            const isPasswordMatch = await user.comparePassword(password);

            if (!isPasswordMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Tên đăng nhập hoặc mật khẩu không đúng'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Tài khoản đã bị vô hiệu hóa'
                });
            }

            // Update last login
            user.lastLogin = Date.now();
            await user.save();

            // Send token response
            sendTokenResponse(user, 200, res);

        } catch (error) {
            next(error);
        }
    }
];

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                address: user.address,
                birthday: user.birthday,
                avatar: user.avatar,
                memberTier: user.memberTier,
                totalSpending: user.totalSpending,
                loyaltyPoints: user.loyaltyPoints,
                pointsToNextTier: user.pointsToNextTier,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin người dùng',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address,
            birthday: req.body.birthday,
            avatar: req.body.avatar
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key =>
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin thành công',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật thông tin',
            error: error.message
        });
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(req.body.currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mật khẩu hiện tại không đúng'
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đổi mật khẩu',
            error: error.message
        });
    }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Đăng xuất thành công',
        data: {}
    });
};

// Validation middleware
exports.registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Tên người dùng phải từ 3-30 ký tự')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Tên người dùng chỉ chứa chữ, số và dấu gạch dưới'),
    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Vui lòng nhập họ tên'),
    body('phone')
        .optional()
        .matches(/^[0-9]{10,11}$/)
        .withMessage('Số điện thoại không hợp lệ'),
];

exports.loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Vui lòng nhập mật khẩu'),
];

// Check validation results
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: errors.array()
        });
    }
    next();
};
