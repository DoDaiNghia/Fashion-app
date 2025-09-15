// SCRUM-10: Controller tìm kiếm sản phẩm (BASIC ONLY)
const Product = require('../models/Product');
const Category = require('../models/Category');
const ResponseHelper = require('../utils/responseHelper');
const { QueryHelper } = require('../utils/queryHelpers');

// Mock model cho search analytics (sẽ được implement sau)
// const SearchQuery = require('../models/SearchQuery');

/**
 * @desc    Tìm kiếm sản phẩm theo từ khóa
 * @route   GET /api/products/search
 * @access  Public
 */
const searchProducts = async (req, res) => {
    try {
        const {
            q = '', // query string
            page = 1,
            limit = 20,
            category,
            minPrice,
            maxPrice,
            inStock,
            sort = '-relevance',
            includeInactive = false
        } = req.query;

        if (!q.trim()) {
            return ResponseHelper.error(res, 'Vui lòng nhập từ khóa tìm kiếm', 400);
        }

        // Build base filter
        let filter = {};

        if (!includeInactive) {
            filter.isActive = true;
        }

        // Category filter
        if (category) {
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

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Stock filter
        if (inStock === 'true') {
            filter['stock.quantity'] = { $gt: 0 };
        }

        // Text search
        const searchFilter = {
            ...filter,
            $text: { $search: q.trim() }
        };

        // Build aggregation pipeline (đơn giản hóa, vẫn giữ textScore)
        const pipeline = [
            {
                $match: searchFilter
            },
            {
                $addFields: {
                    searchScore: { $meta: 'textScore' },
                    relevanceScore: {
                        $add: [
                            { $meta: 'textScore' },
                            { $multiply: ['$views', 0.1] },
                            { $multiply: ['$sales', 0.2] },
                            { $multiply: ['$rating.average', 2] }
                        ]
                    }
                }
            },
            // (đã gỡ join nặng nề để đơn giản hóa)
        ];

        // Sorting
        let sortStage = {};
        switch (sort) {
            case '-relevance':
                sortStage = { relevanceScore: -1, createdAt: -1 };
                break;
            case 'price':
                sortStage = { price: 1 };
                break;
            case '-price':
                sortStage = { price: -1 };
                break;
            case '-rating':
                sortStage = { 'rating.average': -1, 'rating.count': -1 };
                break;
            case '-sales':
                sortStage = { sales: -1 };
                break;
            case '-views':
                sortStage = { views: -1 };
                break;
            default:
                sortStage = { relevanceScore: -1, createdAt: -1 };
        }

        pipeline.push({ $sort: sortStage });

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: parseInt(limit) });

        // Execute search
        const products = await Product.aggregate(pipeline);

        // Get total count
        const totalPipeline = [
            { $match: searchFilter },
            { $count: 'total' }
        ];
        const totalResult = await Product.aggregate(totalPipeline);
        const total = totalResult[0]?.total || 0;

        // (đã gỡ tracking nâng cao)

        ResponseHelper.successWithPagination(res, products, {
            currentPage: parseInt(page),
            limit: parseInt(limit),
            total,
            query: q,
            searchTime: Date.now()
        }, `Tìm thấy ${total} sản phẩm phù hợp`);

    } catch (error) {
        console.error('Error in searchProducts:', error);
        ResponseHelper.serverError(res, 'Lỗi khi tìm kiếm sản phẩm');
    }
};

/**
 * @desc    Lọc sản phẩm theo nhiều tiêu chí nâng cao
 * @route   POST /api/products/filter
 * @access  Public
 */
// (ĐÃ GỠ: filterProducts nâng cao)

/**
 * @desc    Gợi ý tìm kiếm
 * @route   GET /api/products/search/suggestions
 * @access  Public
 */
// (ĐÃ GỠ: gợi ý tìm kiếm)

/**
 * @desc    Lấy sản phẩm tương tự
 * @route   GET /api/products/:id/similar
 * @access  Public
 */
// (ĐÃ GỠ: similar products)

/**
 * @desc    Lấy sản phẩm thịnh hành
 * @route   GET /api/products/trending
 * @access  Public
 */
// (ĐÃ GỠ: trending products)

/**
 * @desc    Theo dõi truy vấn tìm kiếm
 * @route   POST /api/products/search/track
 * @access  Public
 */
// (ĐÃ GỠ: track search query)

/**
 * @desc    Faceted search với aggregation
 * @route   POST /api/products/faceted-search
 * @access  Public
 */
// (ĐÃ GỠ: faceted search)

/**
 * @desc    Lấy analytics tìm kiếm
 * @route   GET /api/products/search/analytics
 * @access  Private (Admin only)
 */
// (ĐÃ GỠ: search analytics)

/**
 * @desc    Export kết quả tìm kiếm
 * @route   POST /api/products/search/export
 * @access  Private (Admin only)
 */
// (ĐÃ GỠ: export search results)

// Helper functions

/**
 * Async function to track search queries without blocking response
 */
const trackSearchQueryAsync = async (query, metadata) => {
    try {
        // TODO: Implement with SearchQuery model
        console.log('Async search tracking:', { query, metadata });
    } catch (error) {
        console.error('Error in async search tracking:', error);
    }
};

/**
 * Get filter summary for better UX
 */
const getFilterSummary = async (baseFilter) => {
    try {
        const summary = await Product.aggregate([
            { $match: baseFilter },
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    avgPrice: { $avg: '$price' },
                    avgRating: { $avg: '$rating.average' },
                    inStockCount: {
                        $sum: {
                            $cond: [{ $gt: ['$stock.quantity', 0] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        return summary[0] || {};
    } catch (error) {
        console.error('Error getting filter summary:', error);
        return {};
    }
};

module.exports = {
    searchProducts
};