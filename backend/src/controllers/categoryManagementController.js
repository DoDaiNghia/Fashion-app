// SCRUM-7: Controller quản lý danh mục sản phẩm - NN

const getAllCategories = async (req, res) => {
    // TODO: Implement lấy tất cả danh mục
};

const getCategoryById = async (req, res) => {
    // TODO: Implement lấy danh mục theo ID
};

const createCategory = async (req, res) => {
    // TODO: Implement tạo danh mục mới
};

const updateCategory = async (req, res) => {
    // TODO: Implement cập nhật danh mục
};

const deleteCategory = async (req, res) => {
    // TODO: Implement xóa danh mục
};

const getSubcategories = async (req, res) => {
    // TODO: Implement lấy danh mục con
};

const reorderCategories = async (req, res) => {
    // TODO: Implement sắp xếp thứ tự danh mục
};

const toggleCategoryStatus = async (req, res) => {
    // TODO: Implement bật/tắt trạng thái danh mục
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getSubcategories,
    reorderCategories,
    toggleCategoryStatus
};