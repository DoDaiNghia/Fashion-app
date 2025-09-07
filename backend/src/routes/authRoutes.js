// Routes xác thực người dùng
const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    logout
} = require('../controllers/authController');

// Import middleware
const auth = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

// @route   POST /api/auth/register
// @desc    Đăng ký người dùng
// @access  Public
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
// @desc    Đăng nhập người dùng
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET /api/auth/profile
// @desc    Lấy thông tin profile người dùng hiện tại
// @access  Private
router.get('/profile', auth, getProfile);

// @route   PUT /api/auth/profile
// @desc    Cập nhật profile người dùng
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Đổi mật khẩu người dùng
// @access  Private
router.put('/change-password', auth, changePassword);

// @route   POST /api/auth/logout
// @desc    Đăng xuất người dùng
// @access  Private
router.post('/logout', auth, logout);

module.exports = router;
