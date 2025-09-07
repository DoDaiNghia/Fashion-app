// Middleware validation sử dụng express-validator
const { body } = require('express-validator');

// Validation đăng ký người dùng
const registerValidation = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Tên đăng nhập phải có từ 3 đến 30 ký tự')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Tên đăng nhập chỉ có thể chứa chữ cái, số và dấu gạch dưới'),

    body('email')
        .isEmail()
        .withMessage('Vui lòng cung cấp email hợp lệ')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa và một số'),

    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Họ phải có từ 2 đến 50 ký tự'),

    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Tên phải có từ 2 đến 50 ký tự'),

    body('phoneNumber')
        .optional()
        .isMobilePhone()
        .withMessage('Vui lòng cung cấp số điện thoại hợp lệ')
];

// Validation đăng nhập người dùng
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Vui lòng cung cấp email hợp lệ')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Mật khẩu là bắt buộc')
];

module.exports = {
    registerValidation,
    loginValidation
};
