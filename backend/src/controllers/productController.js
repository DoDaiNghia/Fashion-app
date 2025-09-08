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
    // Category Management (SCRUM-7) - NN
    ...categoryManagement,

    // Product Management (SCRUM-8) - SD
    ...productManagement,

    // Image Management (SCRUM-9) - LC
    ...productImages,

    // Search & Filter (SCRUM-10) - PT
    ...productSearch
};
