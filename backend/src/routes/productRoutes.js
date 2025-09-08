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
// CATEGORY MANAGEMENT ROUTES (TASK 7 - NN)
// ==========================================

// @route   GET /api/products/categories
// @desc    Lấy tất cả danh mục
// @access  Public
router.get('/categories', productController.getAllCategories);

// @route   GET /api/products/categories/tree
// @desc    Lấy cây danh mục
// @access  Public  
router.get('/categories/tree', productController.getCategoryTree);

// @route   GET /api/products/categories/:id
// @desc    Lấy danh mục theo ID
// @access  Public
router.get('/categories/:id', productController.getCategoryById);

// @route   GET /api/products/categories/:id/subcategories
// @desc    Lấy danh mục con
// @access  Public
router.get('/categories/:id/subcategories', productController.getSubcategories);

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
router.put('/categories/reorder',
    auth,
    adminAuth,
    productController.reorderCategories
);

// @route   PUT /api/products/categories/:id/toggle-status
// @desc    Bật/tắt trạng thái danh mục
// @access  Private (Admin only)
router.put('/categories/:id/toggle-status',
    auth,
    adminAuth,
    productController.toggleCategoryStatus
);

// ==========================================
// SEARCH & FILTER ROUTES (TASK 10 - PT)
// ==========================================

// @route   GET /api/products/search
// @desc    Tìm kiếm sản phẩm
// @access  Public
router.get('/search', productController.searchProducts);

// @route   POST /api/products/filter
// @desc    Lọc sản phẩm nâng cao
// @access  Public
router.post('/filter', productController.filterProducts);

// @route   GET /api/products/search/suggestions
// @desc    Gợi ý tìm kiếm
// @access  Public
router.get('/search/suggestions', productController.getSearchSuggestions);

// @route   GET /api/products/trending
// @desc    Sản phẩm trending
// @access  Public
router.get('/trending', productController.getTrendingProducts);

// @route   POST /api/products/search/track
// @desc    Tracking tìm kiếm
// @access  Public
router.post('/search/track', productController.trackSearchQuery);

// @route   POST /api/products/faceted-search
// @desc    Faceted search
// @access  Public
router.post('/faceted-search', productController.getFacetedSearchResults);

// @route   GET /api/products/search/analytics
// @desc    Analytics tìm kiếm
// @access  Private (Admin only)
router.get('/search/analytics',
    auth,
    adminAuth,
    productController.getSearchAnalytics
);

// @route   POST /api/products/search/export
// @desc    Export kết quả tìm kiếm
// @access  Private (Admin only)
router.post('/search/export',
    auth,
    adminAuth,
    productController.exportSearchResults
);

// ==========================================
// PRODUCT MANAGEMENT ROUTES (TASK 8 - SD)
// ==========================================

// @route   GET /api/products/featured
// @desc    Lấy sản phẩm nổi bật
// @access  Public
router.get('/featured', productController.getFeaturedProducts);

// @route   GET /api/products/category/:categoryId
// @desc    Lấy sản phẩm theo danh mục
// @access  Public
router.get('/category/:categoryId', productController.getProductsByCategory);

// @route   GET /api/products/:id/similar
// @desc    Lấy sản phẩm tương tự
// @access  Public
router.get('/:id/similar', productController.getSimilarProducts);

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
router.put('/:id/toggle-featured',
    auth,
    adminAuth,
    productController.toggleFeaturedStatus
);

// @route   POST /api/products/:id/duplicate
// @desc    Nhân bản sản phẩm
// @access  Private (Admin only)
router.post('/:id/duplicate',
    auth,
    adminAuth,
    productController.duplicateProduct
);

// ==========================================
// IMAGE MANAGEMENT ROUTES (TASK 9 - LC)
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
router.put('/:id/images/reorder',
    auth,
    adminAuth,
    productController.reorderProductImages
);

// @route   PUT /api/products/:id/images/:imageId/set-main
// @desc    Đặt ảnh chính
// @access  Private (Admin only)
router.put('/:id/images/:imageId/set-main',
    auth,
    adminAuth,
    productController.setMainImage
);

// @route   POST /api/products/:id/images/:imageId/generate-responsive
// @desc    Tạo responsive images
// @access  Private (Admin only)
router.post('/:id/images/:imageId/generate-responsive',
    auth,
    adminAuth,
    productController.generateResponsiveImages
);

// @route   POST /api/products/:id/images/bulk-upload
// @desc    Upload ảnh từ URLs
// @access  Private (Admin only)
router.post('/:id/images/bulk-upload',
    auth,
    adminAuth,
    productController.bulkUploadFromUrls
);

// @route   POST /api/products/:id/images/optimize
// @desc    Optimize tất cả ảnh
// @access  Private (Admin only)
router.post('/:id/images/optimize',
    auth,
    adminAuth,
    productController.optimizeAllImages
);

module.exports = router;