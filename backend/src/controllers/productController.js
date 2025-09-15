// Controller sản phẩm chính - Tổng hợp từ các controller chuyên biệt

// SCRUM-7: Quản lý danh mục sản phẩm - NN
const categoryManagement = require('./categoryManagementController');

// SCRUM-8: Quản lý sản phẩm (CRUD) - SD
const productManagement = require('./productManagementController');

// SCRUM-9: Upload ảnh sản phẩm - LC (giữ cơ bản)
const productImages = require('./productImageController');

// SCRUM-10: Tìm kiếm sản phẩm - PT (giữ cơ bản)
const productSearch = require('./productSearchController');

// Export tất cả functions từ các controller con
module.exports = {
    // ==========================================
    // CATEGORY MANAGEMENT (SCRUM-7) - NN
    // ==========================================

    // Danh mục cơ bản
    getAllCategories: categoryManagement.getAllCategories,
    getCategoryById: categoryManagement.getCategoryById,
    createCategory: categoryManagement.createCategory,
    updateCategory: categoryManagement.updateCategory,
    deleteCategory: categoryManagement.deleteCategory,

    // (đã gỡ chức năng danh mục nâng cao)

    // ==========================================
    // PRODUCT MANAGEMENT (SCRUM-8) - SD
    // ==========================================

    // Sản phẩm cơ bản (CRUD)
    getAllProducts: productManagement.getAllProducts,
    getProductById: productManagement.getProductById,
    createProduct: productManagement.createProduct,
    updateProduct: productManagement.updateProduct,
    deleteProduct: productManagement.deleteProduct,

    // Quản lý kho và trạng thái
    updateProductStock: productManagement.updateProductStock,
    toggleProductStatus: productManagement.toggleProductStatus,
    toggleFeaturedStatus: productManagement.toggleFeaturedStatus,

    // (đã gỡ chức năng sản phẩm nâng cao)

    // ==========================================
    // IMAGE MANAGEMENT (SCRUM-9) - LC
    // ==========================================

    // Quản lý ảnh cơ bản
    getProductImages: productImages.getProductImages,
    uploadProductImages: productImages.uploadProductImages,
    updateProductImage: productImages.updateProductImage,
    deleteProductImage: productImages.deleteProductImage,

    // (đã gỡ chức năng ảnh nâng cao)

    // ==========================================
    // SEARCH & FILTER (SCRUM-10) - PT
    // ==========================================

    // Tìm kiếm cơ bản
    searchProducts: productSearch.searchProducts
};