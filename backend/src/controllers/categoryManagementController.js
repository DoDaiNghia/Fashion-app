// SCRUM-7: Controller quản lý danh mục sản phẩm - NN
const Category = require('../models/Category');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');
const { QueryHelper } = require('../utils/queryHelpers');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

/**
 * @desc    Lấy tất cả danh mục với phân trang và filter
 * @route   GET /api/products/categories
 * @access  Public
 */
const getAllCategories = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            level,
            parentCategory,
            isActive = true,
            sort = 'sortOrder'
        } = req.query;

        // Build filter
        let filter = {};
        if (isActive !== 'all') {
            filter.isActive = isActive === 'true';
        }
        if (level !== undefined) {
            filter.level = parseInt(level);
        }
        if (parentCategory) {
            filter.parentCategory = parentCategory === 'null' ? null : parentCategory;
        }

        // Query với pagination
        const queryHelper = new QueryHelper(Category.find(filter), req.query);
        const categories = await queryHelper
            .sort()
            .paginate()
            .populate('parentCategory', 'name slug')
            .populate('subcategories')
            .query;

        // Get total count
        const total = await Category.countDocuments(filter);

        ResponseHelper.successWithPagination(res, categories, {
            currentPage: parseInt(page),
            limit: parseInt(limit),
            total
        }, 'Lấy danh sách danh mục thành công');

    } catch (error) {
        console.error('Error in getAllCategories:', error);
        ResponseHelper.serverError(res, 'Lỗi khi lấy danh sách danh mục');
    }
};

/**
 * @desc    Lấy cây danh mục (tree structure)
 * @route   GET /api/products/categories/tree
 * @access  Public
 */
const getCategoryTree = async (req, res) => {
    try {
        const tree = await Category.getCategoryTree();
        ResponseHelper.success(res, tree, 'Lấy cây danh mục thành công');
    } catch (error) {
        console.error('Error in getCategoryTree:', error);
        ResponseHelper.serverError(res, 'Lỗi khi lấy cây danh mục');
    }
};

/**
 * @desc    Lấy danh mục theo ID
 * @route   GET /api/products/categories/:id
 * @access  Public
 */
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id)
            .populate('parentCategory', 'name slug')
            .populate('subcategories')
            .populate('parent');

        if (!category) {
            return ResponseHelper.notFound(res, 'Không tìm thấy danh mục');
        }

        // Update product count
        await Category.updateProductCount(category._id);

        ResponseHelper.success(res, category, 'Lấy thông tin danh mục thành công');
    } catch (error) {
        console.error('Error in getCategoryById:', error);
        if (error.name === 'CastError') {
            return ResponseHelper.notFound(res, 'ID danh mục không hợp lệ');
        }
        ResponseHelper.serverError(res, 'Lỗi khi lấy thông tin danh mục');
    }
};

/**
 * @desc    Tạo danh mục mới
 * @route   POST /api/products/categories
 * @access  Private (Admin only)
 */
const createCategory = async (req, res) => {
    try {
        // Kiểm tra validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseHelper.validationError(res, errors.array());
        }

        const { name, description, parentCategory, sortOrder, seoData } = req.body;

        // Kiểm tra tên danh mục đã tồn tại
        const existingCategory = await Category.findOne({
            name: new RegExp(`^${name.trim()}$`, 'i')
        });
        if (existingCategory) {
            return ResponseHelper.error(res, 'Tên danh mục đã tồn tại', 400);
        }

        // Validate parent category nếu có
        if (parentCategory) {
            const parentExists = await Category.findById(parentCategory);
            if (!parentExists) {
                return ResponseHelper.error(res, 'Danh mục cha không tồn tại', 400);
            }
        }

        // Tạo category object
        const categoryData = {
            name: name.trim(),
            description: description?.trim(),
            parentCategory: parentCategory || null,
            sortOrder: sortOrder || 0,
            seoData,
            createdBy: req.user.id
        };

        // Upload image nếu có
        if (req.file) {
            try {
                const uploadResult = await uploadToCloudinary(req.file.path, 'categories');
                categoryData.image = {
                    url: uploadResult.url,
                    alt: name,
                    publicId: uploadResult.public_id
                };
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return ResponseHelper.error(res, 'Lỗi khi upload ảnh danh mục', 400);
            }
        }

        const category = new Category(categoryData);
        await category.save();

        // Populate thông tin liên quan
        await category.populate('parentCategory', 'name slug');

        ResponseHelper.created(res, category, 'Tạo danh mục thành công');

    } catch (error) {
        console.error('Error in createCategory:', error);
        if (error.code === 11000) {
            return ResponseHelper.error(res, 'Tên danh mục hoặc slug đã tồn tại', 400);
        }
        ResponseHelper.serverError(res, 'Lỗi khi tạo danh mục');
    }
};

/**
 * @desc    Cập nhật danh mục
 * @route   PUT /api/products/categories/:id
 * @access  Private (Admin only)
 */
const updateCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseHelper.validationError(res, errors.array());
        }

        const { id } = req.params;
        const { name, description, parentCategory, sortOrder, seoData } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return ResponseHelper.notFound(res, 'Không tìm thấy danh mục');
        }

        // Kiểm tra tên trùng với danh mục khác
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({
                name: new RegExp(`^${name.trim()}$`, 'i'),
                _id: { $ne: id }
            });
            if (existingCategory) {
                return ResponseHelper.error(res, 'Tên danh mục đã tồn tại', 400);
            }
        }

        // Validate parent category
        if (parentCategory && parentCategory !== category.parentCategory?.toString()) {
            if (parentCategory === id) {
                return ResponseHelper.error(res, 'Danh mục không thể là cha của chính nó', 400);
            }

            const parentExists = await Category.findById(parentCategory);
            if (!parentExists) {
                return ResponseHelper.error(res, 'Danh mục cha không tồn tại', 400);
            }

            // Kiểm tra không tạo vòng lặp
            const allSubcategories = await Category.getAllSubcategories(id);
            const subcategoryIds = allSubcategories.map(sub => sub._id.toString());
            if (subcategoryIds.includes(parentCategory)) {
                return ResponseHelper.error(res, 'Không thể đặt danh mục con làm danh mục cha', 400);
            }
        }

        // Update fields
        if (name) category.name = name.trim();
        if (description !== undefined) category.description = description?.trim();
        if (parentCategory !== undefined) {
            category.parentCategory = parentCategory || null;
        }
        if (sortOrder !== undefined) category.sortOrder = sortOrder;
        if (seoData) category.seoData = { ...category.seoData, ...seoData };

        // Handle image upload
        if (req.file) {
            try {
                // Delete old image if exists
                if (category.image?.publicId) {
                    await deleteFromCloudinary(category.image.publicId);
                }

                // Upload new image
                const uploadResult = await uploadToCloudinary(req.file.path, 'categories');
                category.image = {
                    url: uploadResult.url,
                    alt: category.name,
                    publicId: uploadResult.public_id
                };
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return ResponseHelper.error(res, 'Lỗi khi upload ảnh danh mục', 400);
            }
        }

        await category.save();
        await category.populate('parentCategory', 'name slug');

        ResponseHelper.success(res, category, 'Cập nhật danh mục thành công');

    } catch (error) {
        console.error('Error in updateCategory:', error);
        if (error.code === 11000) {
            return ResponseHelper.error(res, 'Tên danh mục hoặc slug đã tồn tại', 400);
        }
        ResponseHelper.serverError(res, 'Lỗi khi cập nhật danh mục');
    }
};

/**
 * @desc    Xóa danh mục
 * @route   DELETE /api/products/categories/:id
 * @access  Private (Admin only)
 */
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return ResponseHelper.notFound(res, 'Không tìm thấy danh mục');
        }

        // Kiểm tra có sản phẩm nào sử dụng danh mục này không
        const productCount = await Product.countDocuments({
            $or: [
                { category: id },
                { subcategory: id }
            ]
        });

        if (productCount > 0) {
            return ResponseHelper.error(
                res,
                `Không thể xóa danh mục này vì có ${productCount} sản phẩm đang sử dụng`,
                400
            );
        }

        // Kiểm tra có subcategories không
        const subcategoryCount = await Category.countDocuments({ parentCategory: id });
        if (subcategoryCount > 0) {
            return ResponseHelper.error(
                res,
                `Không thể xóa danh mục này vì có ${subcategoryCount} danh mục con`,
                400
            );
        }

        // Delete image from Cloudinary if exists
        if (category.image?.publicId) {
            try {
                await deleteFromCloudinary(category.image.publicId);
            } catch (error) {
                console.error('Error deleting image from Cloudinary:', error);
            }
        }

        await Category.findByIdAndDelete(id);

        ResponseHelper.success(res, null, 'Xóa danh mục thành công');

    } catch (error) {
        console.error('Error in deleteCategory:', error);
        ResponseHelper.serverError(res, 'Lỗi khi xóa danh mục');
    }
};

/**
 * @desc    Lấy danh sách subcategories
 * @route   GET /api/products/categories/:id/subcategories
 * @access  Public
 */
const getSubcategories = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20, isActive = true } = req.query;

        // Validate parent category exists
        const parentCategory = await Category.findById(id);
        if (!parentCategory) {
            return ResponseHelper.notFound(res, 'Không tìm thấy danh mục cha');
        }

        // Build filter
        let filter = { parentCategory: id };
        if (isActive !== 'all') {
            filter.isActive = isActive === 'true';
        }

        const queryHelper = new QueryHelper(Category.find(filter), req.query);
        const subcategories = await queryHelper
            .sort()
            .paginate()
            .query;

        const total = await Category.countDocuments(filter);

        ResponseHelper.successWithPagination(res, subcategories, {
            currentPage: parseInt(page),
            limit: parseInt(limit),
            total,
            parentCategory: {
                id: parentCategory._id,
                name: parentCategory.name,
                slug: parentCategory.slug
            }
        }, 'Lấy danh sách danh mục con thành công');

    } catch (error) {
        console.error('Error in getSubcategories:', error);
        ResponseHelper.serverError(res, 'Lỗi khi lấy danh sách danh mục con');
    }
};

/**
 * @desc    Sắp xếp lại thứ tự danh mục
 * @route   PUT /api/products/categories/reorder
 * @access  Private (Admin only)
 */
const reorderCategories = async (req, res) => {
    try {
        const { categoryOrders } = req.body; // Array of {id, sortOrder}

        if (!Array.isArray(categoryOrders)) {
            return ResponseHelper.error(res, 'categoryOrders phải là một mảng', 400);
        }

        // Validate tất cả category IDs tồn tại
        const categoryIds = categoryOrders.map(item => item.id);
        const existingCategories = await Category.find({ _id: { $in: categoryIds } });

        if (existingCategories.length !== categoryIds.length) {
            return ResponseHelper.error(res, 'Một số danh mục không tồn tại', 400);
        }

        // Bulk update sortOrder
        const bulkOps = categoryOrders.map(item => ({
            updateOne: {
                filter: { _id: item.id },
                update: { sortOrder: item.sortOrder }
            }
        }));

        await Category.bulkWrite(bulkOps);

        // Return updated categories
        const updatedCategories = await Category.find({ _id: { $in: categoryIds } })
            .sort({ sortOrder: 1 })
            .populate('parentCategory', 'name slug');

        ResponseHelper.success(res, updatedCategories, 'Sắp xếp danh mục thành công');

    } catch (error) {
        console.error('Error in reorderCategories:', error);
        ResponseHelper.serverError(res, 'Lỗi khi sắp xếp danh mục');
    }
};

/**
 * @desc    Bật/tắt trạng thái danh mục
 * @route   PUT /api/products/categories/:id/toggle-status
 * @access  Private (Admin only)
 */
const toggleCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return ResponseHelper.notFound(res, 'Không tìm thấy danh mục');
        }

        // Toggle status
        category.isActive = !category.isActive;
        await category.save();

        // Nếu disable danh mục cha, cũng disable tất cả danh mục con
        if (!category.isActive) {
            await Category.updateMany(
                { path: id },
                { isActive: false }
            );
        }

        await category.populate('parentCategory', 'name slug');

        ResponseHelper.success(res, category,
            `${category.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} danh mục thành công`
        );

    } catch (error) {
        console.error('Error in toggleCategoryStatus:', error);
        ResponseHelper.serverError(res, 'Lỗi khi thay đổi trạng thái danh mục');
    }
};

module.exports = {
    getAllCategories,
    getCategoryTree,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getSubcategories,
    reorderCategories,
    toggleCategoryStatus
};