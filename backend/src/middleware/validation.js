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

// Validation sản phẩm
const productValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Tên sản phẩm phải có từ 2 đến 200 ký tự'),

    body('description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Mô tả sản phẩm phải có từ 10 đến 2000 ký tự'),

    body('price')
        .isFloat({ min: 0 })
        .withMessage('Giá sản phẩm phải là số dương'),

    body('category')
        .isMongoId()
        .withMessage('ID danh mục không hợp lệ'),

    body('subcategory')
        .optional()
        .isMongoId()
        .withMessage('ID danh mục con không hợp lệ'),

    body('sku')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('SKU phải có từ 3 đến 50 ký tự'),

    body('stock.quantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Số lượng tồn kho phải là số nguyên không âm'),

    body('stock.lowStockThreshold')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Ngưỡng cảnh báo tồn kho phải là số nguyên không âm')
];

// Validation danh mục
const categoryValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên danh mục phải có từ 2 đến 100 ký tự'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Mô tả danh mục không được vượt quá 500 ký tự'),

    body('parentCategory')
        .optional()
        .isMongoId()
        .withMessage('ID danh mục cha không hợp lệ'),

    body('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Thứ tự sắp xếp phải là số nguyên không âm')
];

module.exports = {
    registerValidation,
    loginValidation,
    productValidation,
    categoryValidation
};
