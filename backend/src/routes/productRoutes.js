// Product routes - Tổng hợp tất cả routes cho sản phẩm
const express = require('express');
const router = express.Router();

// Import controllers
const productController = require('../controllers/productController');

// Import middleware
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { productValidation, categoryValidation } = require('../middleware/validation');
const upload = require('../middleware/upload');

// ==========================================
// SYSTEM ROUTES
// ==========================================

// @route   GET /api/products/health
// @desc    Health check cho product system
// @access  Public
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Product system đang hoạt động',
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// CATEGORY MANAGEMENT ROUTES (BASIC)
// ==========================================

// @route   GET /api/products/categories
// @desc    Lấy tất cả danh mục
// @access  Public
router.get('/categories', productController.getAllCategories);

// @route   GET /api/products/categories/tree
// @desc    Lấy cây danh mục
// @access  Public  
// (đã gỡ tính năng nâng cao: tree)

// @route   GET /api/products/categories/:id
// @desc    Lấy danh mục theo ID
// @access  Public
router.get('/categories/:id', productController.getCategoryById);

// @route   GET /api/products/categories/:id/subcategories
// @desc    Lấy danh mục con
// @access  Public
// (đã gỡ tính năng nâng cao: subcategories)

// @route   POST /api/products/categories
// @desc    Tạo danh mục mới
// @access  Private (Admin only)
router.post('/categories',
    auth,
    adminAuth,
    upload.single('image'),
    categoryValidation,
    productController.createCategory
);

// @route   PUT /api/products/categories/:id
// @desc    Cập nhật danh mục
// @access  Private (Admin only)
router.put('/categories/:id',
    auth,
    adminAuth,
    upload.single('image'),
    categoryValidation,
    productController.updateCategory
);

// @route   DELETE /api/products/categories/:id
// @desc    Xóa danh mục
// @access  Private (Admin only)
router.delete('/categories/:id',
    auth,
    adminAuth,
    productController.deleteCategory
);

// @route   PUT /api/products/categories/reorder
// @desc    Sắp xếp lại thứ tự danh mục
// @access  Private (Admin only)
// (đã gỡ tính năng nâng cao: reorder)

// @route   PUT /api/products/categories/:id/toggle-status
// @desc    Bật/tắt trạng thái danh mục
// @access  Private (Admin only)
// (đã gỡ tính năng nâng cao: toggle-status)

// ==========================================
// SEARCH (BASIC)
// ==========================================

// @route   GET /api/products/search
// @desc    Tìm kiếm sản phẩm
// @access  Public
router.get('/search', productController.searchProducts);

// @route   POST /api/products/filter
// @desc    Lọc sản phẩm nâng cao
// @access  Public
// (đã gỡ: filter nâng cao)

// @route   GET /api/products/search/suggestions
// @desc    Gợi ý tìm kiếm
// @access  Public
// (đã gỡ: gợi ý tìm kiếm)

// @route   GET /api/products/trending
// @desc    Sản phẩm trending
// @access  Public
// (đã gỡ: trending)

// @route   POST /api/products/search/track
// @desc    Tracking tìm kiếm
// @access  Public
// (đã gỡ: tracking)

// @route   POST /api/products/faceted-search
// @desc    Faceted search
// @access  Public
// (đã gỡ: faceted search)

// @route   GET /api/products/search/analytics
// @desc    Analytics tìm kiếm
// @access  Private (Admin only)
// (đã gỡ: analytics)

// @route   POST /api/products/search/export
// @desc    Export kết quả tìm kiếm
// @access  Private (Admin only)
// (đã gỡ: export)

// ==========================================
// PRODUCT MANAGEMENT ROUTES (BASIC)
// ==========================================

// @route   GET /api/products/featured
// @desc    Lấy sản phẩm nổi bật
// @access  Public
// (đã gỡ: featured)

// @route   GET /api/products/category/:categoryId
// @desc    Lấy sản phẩm theo danh mục
// @access  Public
// (đã gỡ: theo danh mục nâng cao)

// @route   GET /api/products/:id/similar
// @desc    Lấy sản phẩm tương tự
// @access  Public
// (đã gỡ: tương tự nâng cao)

// @route   GET /api/products
// @desc    Lấy tất cả sản phẩm
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/:id
// @desc    Lấy sản phẩm theo ID hoặc slug
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Tạo sản phẩm mới
// @access  Private (Admin only)
router.post('/',
    auth,
    adminAuth,
    productValidation,
    productController.createProduct
);

// @route   PUT /api/products/:id
// @desc    Cập nhật sản phẩm
// @access  Private (Admin only)
router.put('/:id',
    auth,
    adminAuth,
    productValidation,
    productController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Xóa sản phẩm
// @access  Private (Admin only)
router.delete('/:id',
    auth,
    adminAuth,
    productController.deleteProduct
);

// @route   PUT /api/products/:id/stock
// @desc    Cập nhật kho hàng
// @access  Private (Admin only)
router.put('/:id/stock',
    auth,
    adminAuth,
    productController.updateProductStock
);

// @route   PUT /api/products/:id/toggle-status
// @desc    Bật/tắt trạng thái sản phẩm
// @access  Private (Admin only)
router.put('/:id/toggle-status',
    auth,
    adminAuth,
    productController.toggleProductStatus
);

// @route   PUT /api/products/:id/toggle-featured
// @desc    Đặt/bỏ sản phẩm nổi bật
// @access  Private (Admin only)
// (đã gỡ: toggle-featured)

// @route   POST /api/products/:id/duplicate
// @desc    Nhân bản sản phẩm
// @access  Private (Admin only)
// (đã gỡ: duplicate)

// ==========================================
// IMAGE MANAGEMENT ROUTES (BASIC)
// ==========================================

// @route   GET /api/products/:id/images
// @desc    Lấy danh sách ảnh sản phẩm
// @access  Public
router.get('/:id/images', productController.getProductImages);

// @route   POST /api/products/:id/images
// @desc    Upload ảnh sản phẩm
// @access  Private (Admin only)
router.post('/:id/images',
    auth,
    adminAuth,
    upload.array('images', 10),
    productController.uploadProductImages
);

// @route   PUT /api/products/:id/images/:imageId
// @desc    Cập nhật thông tin ảnh
// @access  Private (Admin only)
router.put('/:id/images/:imageId',
    auth,
    adminAuth,
    productController.updateProductImage
);

// @route   DELETE /api/products/:id/images/:imageId
// @desc    Xóa ảnh sản phẩm
// @access  Private (Admin only)
router.delete('/:id/images/:imageId',
    auth,
    adminAuth,
    productController.deleteProductImage
);

// @route   PUT /api/products/:id/images/reorder
// @desc    Sắp xếp lại thứ tự ảnh
// @access  Private (Admin only)
// (đã gỡ: reorder ảnh)

// @route   PUT /api/products/:id/images/:imageId/set-main
// @desc    Đặt ảnh chính
// @access  Private (Admin only)
// (đã gỡ: đặt ảnh chính)

// @route   POST /api/products/:id/images/:imageId/generate-responsive
// @desc    Tạo responsive images
// @access  Private (Admin only)
// (đã gỡ: responsive images)

// @route   POST /api/products/:id/images/bulk-upload
// @desc    Upload ảnh từ URLs
// @access  Private (Admin only)
// (đã gỡ: bulk-upload)

// @route   POST /api/products/:id/images/optimize
// @desc    Optimize tất cả ảnh
// @access  Private (Admin only)
// (đã gỡ: optimize tất cả ảnh)

module.exports = router;