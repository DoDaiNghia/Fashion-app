// SCRUM-8: Controller quản lý sản phẩm (CRUD) - SD
const Product = require('../models/Product');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');
const { QueryHelper } = require('../utils/queryHelpers');

/**
 * @desc    Lấy tất cả sản phẩm với phân trang, filter và sort
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            isActive = true,
            isFeatured,
            minPrice,
            maxPrice,
            inStock,
            sort = '-createdAt'
        } = req.query;

        // Build filter
        let filter = {};

        if (isActive !== 'all') {
            filter.isActive = isActive === 'true';
        }

        if (category) {
            // Include subcategories
            const categoryDoc = await Category.findById(category);
            if (categoryDoc) {
                const allCategories = await Category.getAllSubcategories(category);
                const categoryIds = allCategories.map(cat => cat._id);
                filter.$or = [
                    { category: { $in: categoryIds } },
                    { subcategory: { $in: categoryIds } }
                ];
            }
        }

        if (isFeatured !== undefined) {
            filter.isFeatured = isFeatured === 'true';
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        if (inStock === 'true') {
            filter['stock.quantity'] = { $gt: 0 };
        }

        // Query với QueryHelper
        const queryHelper = new QueryHelper(Product.find(filter), req.query);
        const products = await queryHelper
            .sort()
            .paginate()
            .populate('category', 'name slug')
            .populate('subcategory', 'name slug')
            .populate('createdBy', 'username firstName lastName')
            .query;

        const total = await Product.countDocuments(filter);

        ResponseHelper.successWithPagination(res, products, {
            currentPage: parseInt(page),
            limit: parseInt(limit),
            total
        }, 'Lấy danh sách sản phẩm thành công');

    } catch (error) {
        console.error('Error in getAllProducts:', error);
        ResponseHelper.serverError(res, 'Lỗi khi lấy danh sách sản phẩm');
    }
};

/**
 * @desc    Lấy sản phẩm theo ID hoặc slug
 * @route   GET /api/products/:identifier
 * @access  Public
 */
const getProductById = async (req, res) => {
    try {
        const { identifier } = req.params;

        // Tìm theo ID hoặc slug
        let product;
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            // MongoDB ObjectId
            product = await Product.findById(identifier);
        } else {
            // Slug
            product = await Product.findOne({ slug: identifier });
        }

        if (!product) {
            return ResponseHelper.notFound(res, 'Không tìm thấy sản phẩm');
        }

        // Chỉ hiển thị sản phẩm active cho public
        if (!product.isActive && (!req.user || req.user.role !== 'admin')) {
            return ResponseHelper.notFound(res, 'Sản phẩm không khả dụng');
        }

        // Populate related data
        await product.populate([
            { path: 'category', select: 'name slug path' },
            { path: 'subcategory', select: 'name slug' },
            { path: 'createdBy', select: 'username firstName lastName' }
        ]);

        // Tăng view count (async, không block response)
        Product.findByIdAndUpdate(product._id, { $inc: { views: 1 } }).exec();

        ResponseHelper.success(res, product, 'Lấy thông tin sản phẩm thành công');

    } catch (error) {
        console.error('Error in getProductById:', error);
        if (error.name === 'CastError') {
            return ResponseHelper.notFound(res, 'ID sản phẩm không hợp lệ');
        }
        ResponseHelper.serverError(res, 'Lỗi khi lấy thông tin sản phẩm');
    }
};

/**
 * @desc    Tạo sản phẩm mới
 * @route   POST /api/products
 * @access  Private (Admin only)
 */
const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseHelper.validationError(res, errors.array());
        }

        const productData = { ...req.body, createdBy: req.user.id };

        // Validate category exists
        if (productData.category) {
            const categoryExists = await Category.findById(productData.category);
            if (!categoryExists) {
                return ResponseHelper.error(res, 'Danh mục không tồn tại', 400);
            }
        }

        // Validate subcategory if provided
        if (productData.subcategory) {
            const subcategoryExists = await Category.findById(productData.subcategory);
            if (!subcategoryExists) {
                return ResponseHelper.error(res, 'Danh mục con không tồn tại', 400);
            }
        }

        // Check SKU uniqueness if provided
        if (productData.sku) {
            const existingSKU = await Product.findOne({ sku: productData.sku.toUpperCase() });
            if (existingSKU) {
                return ResponseHelper.error(res, 'SKU đã tồn tại', 400);
            }
        }

        // Tạo sản phẩm
        const product = new Product(productData);
        await product.save();

        // Populate data để trả về
        await product.populate([
            { path: 'category', select: 'name slug' },
            { path: 'subcategory', select: 'name slug' },
            { path: 'createdBy', select: 'username firstName lastName' }
        ]);

        // Update category product count
        if (product.category) {
            Category.updateProductCount(product.category).exec();
        }

        ResponseHelper.created(res, product, 'Tạo sản phẩm thành công');

    } catch (error) {
        console.error('Error in createProduct:', error);
        if (error.code === 11000) {
            if (error.keyPattern.sku) {
                return ResponseHelper.error(res, 'SKU đã tồn tại', 400);
            }
            if (error.keyPattern.slug) {
                return ResponseHelper.error(res, 'Slug đã tồn tại', 400);
            }
        }
        ResponseHelper.serverError(res, 'Lỗi khi tạo sản phẩm');
    }
};

/**
 * @desc    Cập nhật sản phẩm
 * @route   PUT /api/products/:id
 * @access  Private (Admin only)
 */
const updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseHelper.validationError(res, errors.array());
        }

        const { id } = req.params;
        const updateData = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return ResponseHelper.notFound(res, 'Không tìm thấy sản phẩm');
        }

        // Validate category if changed
        if (updateData.category && updateData.category !== product.category?.toString()) {
            const categoryExists = await Category.findById(updateData.category);
            if (!categoryExists) {
                return ResponseHelper.error(res, 'Danh mục không tồn tại', 400);
            }
        }

        // Validate subcategory if changed
        if (updateData.subcategory && updateData.subcategory !== product.subcategory?.toString()) {
            const subcategoryExists = await Category.findById(updateData.subcategory);
            if (!subcategoryExists) {
                return ResponseHelper.error(res, 'Danh mục con không tồn tại', 400);
            }
        }

        // Check SKU uniqueness if changed
        if (updateData.sku && updateData.sku.toUpperCase() !== product.sku) {
            const existingSKU = await Product.findOne({
                sku: updateData.sku.toUpperCase(),
                _id: { $ne: id }
            });
            if (existingSKU) {
                return ResponseHelper.error(res, 'SKU đã tồn tại', 400);
            }
        }

        // Update product
        Object.assign(product, updateData);
        await product.save();

        await product.populate([
            { path: 'category', select: 'name slug' },
            { path: 'subcategory', select: 'name slug' },
            { path: 'createdBy', select: 'username firstName lastName' }
        ]);

        // Update category product count if category changed
        if (updateData.category) {
            Category.updateProductCount(updateData.category).exec();
            if (product.category && product.category.toString() !== updateData.category) {
                Category.updateProductCount(product.category).exec();
            }
        }

        ResponseHelper.success(res, product, 'Cập nhật sản phẩm thành công');

    } catch (error) {
        console.error('Error in updateProduct:', error);
        if (error.code === 11000) {
            if (error.keyPattern.sku) {
                return ResponseHelper.error(res, 'SKU đã tồn tại', 400);
            }
            if (error.keyPattern.slug) {
                return ResponseHelper.error(res, 'Slug đã tồn tại', 400);
            }
        }
        ResponseHelper.serverError(res, 'Lỗi khi cập nhật sản phẩm');
    }
};

/**
 * @desc    Xóa sản phẩm
 * @route   DELETE /api/products/:id
 * @access  Private (Admin only)
 */
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return ResponseHelper.notFound(res, 'Không tìm thấy sản phẩm');
        }

        // TODO: Kiểm tra có orders liên quan không (khi có Order model)
        // const orderCount = await Order.countDocuments({ 'items.product': id });
        // if (orderCount > 0) {
        //     return ResponseHelper.error(res, 'Không thể xóa sản phẩm đã có đơn hàng', 400);
        // }

        // TODO: Xóa tất cả images từ Cloudinary
        // if (product.images && product.images.length > 0) {
        //     for (const image of product.images) {
        //         if (image.publicId) {
        //             await deleteFromCloudinary(image.publicId);
        //         }
        //     }
        // }

        const categoryId = product.category;
        await Product.findByIdAndDelete(id);

        // Update category product count
        if (categoryId) {
            Category.updateProductCount(categoryId).exec();
        }

        ResponseHelper.success(res, null, 'Xóa sản phẩm thành công');

    } catch (error) {
        console.error('Error in deleteProduct:', error);
        ResponseHelper.serverError(res, 'Lỗi khi xóa sản phẩm');
    }
};

/**
 * @desc    Cập nhật kho hàng sản phẩm
 * @route   PUT /api/products/:id/stock
 * @access  Private (Admin only)
 */
const updateProductStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, operation = 'set', lowStockThreshold, trackStock } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return ResponseHelper.notFound(res, 'Không tìm thấy sản phẩm');
        }

        let newQuantity = product.stock.quantity;

        // Calculate new quantity based on operation
        switch (operation) {
            case 'set':
                newQuantity = Math.max(0, parseInt(quantity) || 0);
                break;
            case 'add':
                newQuantity = Math.max(0, product.stock.quantity + (parseInt(quantity) || 0));
                break;
            case 'subtract':
                newQuantity = Math.max(0, product.stock.quantity - (parseInt(quantity) || 0));
                break;
            default:
                return ResponseHelper.error(res, 'Operation không hợp lệ (set, add, subtract)', 400);
        }

        // Update stock
        product.stock.quantity = newQuantity;
        if (lowStockThreshold !== undefined) {
            product.stock.lowStockThreshold = Math.max(0, parseInt(lowStockThreshold) || 0);
        }
        if (trackStock !== undefined) {
            product.stock.trackStock = Boolean(trackStock);
        }

        await product.save();

        // TODO: Log stock movement history
        // await StockMovement.create({
        //     product: id,
        //     operation,
        //     quantity: operation === 'set' ? newQuantity : quantity,
        //     previousQuantity: product.stock.quantity,
        //     newQuantity,
        //     createdBy: req.user.id
        // });

        ResponseHelper.success(res, {
            product: {
                id: product._id,
                name: product.name,
                sku: product.sku,
                stock: product.stock,
                isInStock: product.isInStock,
                isLowStock: product.isLowStock
            }
        }, 'Cập nhật kho hàng thành công');

    } catch (error) {
        console.error('Error in updateProductStock:', error);
        ResponseHelper.serverError(res, 'Lỗi khi cập nhật kho hàng');
    }
};

/**
 * @desc    Bật/tắt trạng thái sản phẩm
 * @route   PUT /api/products/:id/toggle-status
 * @access  Private (Admin only)
 */
const toggleProductStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return ResponseHelper.notFound(res, 'Không tìm thấy sản phẩm');
        }

        product.isActive = !product.isActive;
        await product.save();

        ResponseHelper.success(res, {
            id: product._id,
            name: product.name,
            sku: product.sku,
            isActive: product.isActive
        }, `${product.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} sản phẩm thành công`);

    } catch (error) {
        console.error('Error in toggleProductStatus:', error);
        ResponseHelper.serverError(res, 'Lỗi khi thay đổi trạng thái sản phẩm');
    }
};

/**
 * @desc    Lấy sản phẩm nổi bật
 * @route   GET /api/products/featured
 * @access  Public
 */
// (ĐÃ GỠ: getFeaturedProducts)

/**
 * @desc    Lấy sản phẩm theo danh mục
 * @route   GET /api/products/category/:categoryId
 * @access  Public
 */
// (ĐÃ GỠ: getProductsByCategory)

/**
 * @desc    Nhân bản sản phẩm
 * @route   POST /api/products/:id/duplicate
 * @access  Private (Admin only)
 */
// (ĐÃ GỠ: duplicateProduct)

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    toggleProductStatus
};