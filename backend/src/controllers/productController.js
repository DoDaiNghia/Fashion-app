// Controller sản phẩm chính - Tổng hợp từ các controller chuyên biệt

// SCRUM-7: Quản lý danh mục sản phẩm - NN
const categoryManagement = require('./categoryManagementController');

// SCRUM-8: Quản lý sản phẩm (CRUD) - SD
const productManagement = require('./productManagementController');

// SCRUM-9: Upload ảnh sản phẩm - LC
const productImages = require('./productImageController');

// SCRUM-10: Tìm kiếm và lọc sản phẩm - PT
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

    // Danh mục nâng cao
    getCategoryTree: categoryManagement.getCategoryTree,
    getSubcategories: categoryManagement.getSubcategories,
    reorderCategories: categoryManagement.reorderCategories,
    toggleCategoryStatus: categoryManagement.toggleCategoryStatus,

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

    // Sản phẩm nâng cao
    getFeaturedProducts: productManagement.getFeaturedProducts,
    getProductsByCategory: productManagement.getProductsByCategory,
    duplicateProduct: productManagement.duplicateProduct,

    // ==========================================
    // IMAGE MANAGEMENT (SCRUM-9) - LC
    // ==========================================

    // Quản lý ảnh cơ bản
    getProductImages: productImages.getProductImages,
    uploadProductImages: productImages.uploadProductImages,
    updateProductImage: productImages.updateProductImage,
    deleteProductImage: productImages.deleteProductImage,

    // Quản lý ảnh nâng cao
    reorderProductImages: productImages.reorderProductImages,
    setMainImage: productImages.setMainImage,
    generateResponsiveImages: productImages.generateResponsiveImages,
    bulkUploadFromUrls: productImages.bulkUploadFromUrls,
    optimizeAllImages: productImages.optimizeAllImages,

    // ==========================================
    // SEARCH & FILTER (SCRUM-10) - PT
    // ==========================================

    // Tìm kiếm cơ bản
    searchProducts: productSearch.searchProducts,
    filterProducts: productSearch.filterProducts,
    getSearchSuggestions: productSearch.getSearchSuggestions,

    // Tìm kiếm nâng cao
    getSimilarProducts: productSearch.getSimilarProducts,
    getTrendingProducts: productSearch.getTrendingProducts,
    getFacetedSearchResults: productSearch.getFacetedSearchResults,

    // Analytics và tracking
    trackSearchQuery: productSearch.trackSearchQuery,
    getSearchAnalytics: productSearch.getSearchAnalytics,
    exportSearchResults: productSearch.exportSearchResults
};