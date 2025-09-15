<<<<<<< HEAD
// SCRUM-10: Controller tìm kiếm sản phẩm (BASIC ONLY)
=======
// SCRUM-10: Controller tìm kiếm và lọc sản phẩm - PT
>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f
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

<<<<<<< HEAD
        // Build aggregation pipeline (đơn giản hóa, vẫn giữ textScore)
=======
        // Build aggregation pipeline for better search results
>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f
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
<<<<<<< HEAD
            // (đã gỡ join nặng nề để đơn giản hóa)
=======
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'subcategory',
                    foreignField: '_id',
                    as: 'subcategory'
                }
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ['$category', 0] },
                    subcategory: { $arrayElemAt: ['$subcategory', 0] }
                }
            }
>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f
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

<<<<<<< HEAD
        // (đã gỡ tracking nâng cao)
=======
        // Track search query (async, don't block response)
        trackSearchQueryAsync(q, {
            resultsCount: total,
            filters: { category, minPrice, maxPrice, inStock },
            userAgent: req.get('User-Agent'),
            ip: req.ip
        });
>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f

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
<<<<<<< HEAD
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
=======
const filterProducts = async (req, res) => {
    try {
        const {
            categories = [],
            priceRange = {},
            attributes = [],
            rating = 0,
            inStock = false,
            isFeatured,
            tags = [],
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 20
        } = req.body;

        // Build complex filter
        let filter = { isActive: true };

        // Categories filter (including subcategories)
        if (categories.length > 0) {
            const allCategoryIds = [];
            for (const catId of categories) {
                const subCategories = await Category.getAllSubcategories(catId);
                allCategoryIds.push(...subCategories.map(cat => cat._id));
            }
            filter.$or = [
                { category: { $in: allCategoryIds } },
                { subcategory: { $in: allCategoryIds } }
            ];
        }

        // Price range filter
        if (priceRange.min !== undefined || priceRange.max !== undefined) {
            filter.price = {};
            if (priceRange.min !== undefined) filter.price.$gte = parseFloat(priceRange.min);
            if (priceRange.max !== undefined) filter.price.$lte = parseFloat(priceRange.max);
        }

        // Attributes filter
        if (attributes.length > 0) {
            filter.$and = attributes.map(attr => ({
                attributes: {
                    $elemMatch: {
                        name: attr.name,
                        value: { $in: Array.isArray(attr.values) ? attr.values : [attr.values] }
                    }
                }
            }));
        }

        // Rating filter
        if (rating > 0) {
            filter['rating.average'] = { $gte: parseFloat(rating) };
        }

        // Stock filter
        if (inStock) {
            filter['stock.quantity'] = { $gt: 0 };
        }

        // Featured filter
        if (isFeatured !== undefined) {
            filter.isFeatured = Boolean(isFeatured);
        }

        // Tags filter
        if (tags.length > 0) {
            filter.tags = { $in: tags };
        }

        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const queryHelper = new QueryHelper(Product.find(filter), req.body);
        const products = await queryHelper
            .populate('category', 'name slug')
            .populate('subcategory', 'name slug')
            .query
            .sort(sortObj)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const total = await Product.countDocuments(filter);

        // Get filter summary
        const filterSummary = await getFilterSummary(filter);

        ResponseHelper.successWithPagination(res, products, {
            currentPage: parseInt(page),
            limit: parseInt(limit),
            total,
            appliedFilters: {
                categories: categories.length,
                priceRange,
                attributes: attributes.length,
                rating,
                inStock,
                isFeatured,
                tags: tags.length
            },
            filterSummary
        }, `Lọc được ${total} sản phẩm phù hợp`);

    } catch (error) {
        console.error('Error in filterProducts:', error);
        ResponseHelper.serverError(res, 'Lỗi khi lọc sản phẩm');
>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f
    }
};

/**
<<<<<<< HEAD
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

=======
 * @desc    Gợi ý tìm kiếm
 * @route   GET /api/products/search/suggestions
 * @access  Public
 */
const getSearchSuggestions = async (req, res) => {
    try {
        const { q = '', limit = 10 } = req.query;

        if (!q.trim() || q.length < 2) {
            return ResponseHelper.success(res, [], 'Nhập ít nhất 2 ký tự để xem gợi ý');
        }

        const searchTerm = q.trim();

        // Product name suggestions
        const productSuggestions = await Product.find({
            name: { $regex: searchTerm, $options: 'i' },
            isActive: true
        })
            .select('name slug')
            .limit(parseInt(limit) / 2)
            .sort({ views: -1, sales: -1 });

        // Category suggestions
        const categorySuggestions = await Category.find({
            name: { $regex: searchTerm, $options: 'i' },
            isActive: true
        })
            .select('name slug')
            .limit(parseInt(limit) / 4)
            .sort({ productCount: -1 });

        // Tags suggestions
        const tagSuggestions = await Product.aggregate([
            {
                $match: {
                    tags: { $regex: searchTerm, $options: 'i' },
                    isActive: true
                }
            },
            { $unwind: '$tags' },
            {
                $match: {
                    tags: { $regex: searchTerm, $options: 'i' }
                }
            },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: parseInt(limit) / 4 }
        ]);

        const suggestions = [
            ...productSuggestions.map(p => ({
                type: 'product',
                text: p.name,
                slug: p.slug,
                url: `/products/${p.slug}`
            })),
            ...categorySuggestions.map(c => ({
                type: 'category',
                text: c.name,
                slug: c.slug,
                url: `/categories/${c.slug}`
            })),
            ...tagSuggestions.map(t => ({
                type: 'tag',
                text: t._id,
                url: `/search?q=${encodeURIComponent(t._id)}`
            }))
        ];

        ResponseHelper.success(res, suggestions.slice(0, parseInt(limit)), 'Lấy gợi ý tìm kiếm thành công');

    } catch (error) {
        console.error('Error in getSearchSuggestions:', error);
        ResponseHelper.serverError(res, 'Lỗi khi lấy gợi ý tìm kiếm');
    }
};

/**
 * @desc    Lấy sản phẩm tương tự
 * @route   GET /api/products/:id/similar
 * @access  Public
 */
const getSimilarProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 10 } = req.query;

        const product = await Product.findById(id);
        if (!product) {
            return ResponseHelper.notFound(res, 'Không tìm thấy sản phẩm');
        }

        // Find similar products based on multiple criteria
        const similarProducts = await Product.aggregate([
            {
                $match: {
                    _id: { $ne: product._id },
                    isActive: true,
                    $or: [
                        { category: product.category },
                        { subcategory: product.subcategory },
                        { tags: { $in: product.tags } }
                    ]
                }
            },
            {
                $addFields: {
                    similarityScore: {
                        $add: [
                            // Same category: +3 points
                            { $cond: [{ $eq: ['$category', product.category] }, 3, 0] },
                            // Same subcategory: +2 points  
                            { $cond: [{ $eq: ['$subcategory', product.subcategory] }, 2, 0] },
                            // Similar price range: +1 point
                            {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ['$price', product.price * 0.7] },
                                            { $lte: ['$price', product.price * 1.3] }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            },
                            // Common tags: +0.5 per tag
                            {
                                $multiply: [
                                    { $size: { $setIntersection: ['$tags', product.tags] } },
                                    0.5
                                ]
                            },
                            // Higher rating gets slight boost
                            { $multiply: ['$rating.average', 0.1] }
                        ]
                    }
                }
            },
            { $sort: { similarityScore: -1, 'rating.average': -1, views: -1 } },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ['$category', 0] }
                }
            },
            {
                $project: {
                    similarityScore: 0 // Remove score from output
                }
            }
        ]);

        ResponseHelper.success(res, similarProducts, 'Lấy sản phẩm tương tự thành công');

    } catch (error) {
        console.error('Error in getSimilarProducts:', error);
        ResponseHelper.serverError(res, 'Lỗi khi lấy sản phẩm tương tự');
    }
};

/**
 * @desc    Lấy sản phẩm thịnh hành
 * @route   GET /api/products/trending
 * @access  Public
 */
const getTrendingProducts = async (req, res) => {
    try {
        const { limit = 20, period = '7d' } = req.query;

        // Calculate date range based on period
        const now = new Date();
        let dateRange;

        switch (period) {
            case '1d':
                dateRange = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        // Calculate trending score
        const trendingProducts = await Product.aggregate([
            {
                $match: {
                    isActive: true,
                    updatedAt: { $gte: dateRange }
                }
            },
            {
                $addFields: {
                    trendingScore: {
                        $add: [
                            { $multiply: ['$views', 1] },
                            { $multiply: ['$sales', 5] },
                            { $multiply: ['$rating.average', 2] },
                            { $multiply: ['$rating.count', 0.5] },
                            // Boost newer products
                            {
                                $divide: [
                                    { $subtract: [now, '$createdAt'] },
                                    1000 * 60 * 60 * 24 // Convert to days
                                ]
                            }
                        ]
                    }
                }
            },
            { $sort: { trendingScore: -1 } },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ['$category', 0] }
                }
            },
            {
                $project: {
                    trendingScore: 0
                }
            }
        ]);

        ResponseHelper.success(res, trendingProducts, `Lấy ${period} sản phẩm thịnh hành thành công`);

    } catch (error) {
        console.error('Error in getTrendingProducts:', error);
        ResponseHelper.serverError(res, 'Lỗi khi lấy sản phẩm thịnh hành');
    }
};

/**
 * @desc    Theo dõi truy vấn tìm kiếm
 * @route   POST /api/products/search/track
 * @access  Public
 */
const trackSearchQuery = async (req, res) => {
    try {
        const { query, resultsCount, filters = {}, selectedProductId } = req.body;

        if (!query || !query.trim()) {
            return ResponseHelper.error(res, 'Query là bắt buộc', 400);
        }

        // Track search data
        const searchData = {
            query: query.trim().toLowerCase(),
            resultsCount: parseInt(resultsCount) || 0,
            filters,
            selectedProductId,
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            timestamp: new Date()
        };

        // TODO: Save to SearchQuery model when implemented
        // await SearchQuery.create(searchData);

        // For now, just log it
        console.log('Search tracked:', searchData);

        ResponseHelper.success(res, { tracked: true }, 'Theo dõi tìm kiếm thành công');

    } catch (error) {
        console.error('Error in trackSearchQuery:', error);
        ResponseHelper.serverError(res, 'Lỗi khi theo dõi tìm kiếm');
    }
};

/**
 * @desc    Faceted search với aggregation
 * @route   POST /api/products/faceted-search
 * @access  Public
 */
const getFacetedSearchResults = async (req, res) => {
    try {
        const { query = '', filters = {}, page = 1, limit = 20 } = req.body;

        let baseMatch = { isActive: true };

        // Add text search if query provided
        if (query.trim()) {
            baseMatch.$text = { $search: query.trim() };
        }

        // Apply filters
        if (filters.categories && filters.categories.length > 0) {
            baseMatch.category = { $in: filters.categories };
        }

        if (filters.priceRange) {
            baseMatch.price = {};
            if (filters.priceRange.min) baseMatch.price.$gte = filters.priceRange.min;
            if (filters.priceRange.max) baseMatch.price.$lte = filters.priceRange.max;
        }

        const facetedResults = await Product.aggregate([
            { $match: baseMatch },
            {
                $facet: {
                    // Main results
                    products: [
                        { $skip: (parseInt(page) - 1) * parseInt(limit) },
                        { $limit: parseInt(limit) },
                        {
                            $lookup: {
                                from: 'categories',
                                localField: 'category',
                                foreignField: '_id',
                                as: 'category'
                            }
                        },
                        {
                            $addFields: {
                                category: { $arrayElemAt: ['$category', 0] }
                            }
                        }
                    ],
                    // Category facets
                    categoryFacets: [
                        {
                            $group: {
                                _id: '$category',
                                count: { $sum: 1 },
                                avgPrice: { $avg: '$price' }
                            }
                        },
                        {
                            $lookup: {
                                from: 'categories',
                                localField: '_id',
                                foreignField: '_id',
                                as: 'categoryInfo'
                            }
                        },
                        {
                            $addFields: {
                                categoryInfo: { $arrayElemAt: ['$categoryInfo', 0] }
                            }
                        },
                        { $sort: { count: -1 } }
                    ],
                    // Price range facets
                    priceRanges: [
                        {
                            $bucket: {
                                groupBy: '$price',
                                boundaries: [0, 100000, 500000, 1000000, 5000000, 10000000, 50000000],
                                default: 'other',
                                output: {
                                    count: { $sum: 1 },
                                    avgPrice: { $avg: '$price' }
                                }
                            }
                        }
                    ],
                    // Rating facets
                    ratingFacets: [
                        {
                            $bucket: {
                                groupBy: '$rating.average',
                                boundaries: [0, 1, 2, 3, 4, 5],
                                default: 'unrated',
                                output: {
                                    count: { $sum: 1 }
                                }
                            }
                        }
                    ],
                    // Total count
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }
        ]);

        const result = facetedResults[0];
        const total = result.totalCount[0]?.count || 0;

        ResponseHelper.successWithPagination(res, result.products, {
            currentPage: parseInt(page),
            limit: parseInt(limit),
            total,
            facets: {
                categories: result.categoryFacets,
                priceRanges: result.priceRanges,
                ratings: result.ratingFacets
            }
        }, 'Faceted search thành công');

    } catch (error) {
        console.error('Error in getFacetedSearchResults:', error);
        ResponseHelper.serverError(res, 'Lỗi khi thực hiện faceted search');
    }
};

/**
 * @desc    Lấy analytics tìm kiếm
 * @route   GET /api/products/search/analytics
 * @access  Private (Admin only)
 */
const getSearchAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, limit = 50 } = req.query;

        // Date range
        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);

        // TODO: Implement with SearchQuery model
        // const analytics = await SearchQuery.aggregate([...]);

        // Mock analytics data for now
        const mockAnalytics = {
            totalSearches: 1250,
            uniqueQueries: 890,
            avgResultsPerSearch: 15.2,
            topQueries: [
                { query: 'iphone', count: 156, avgResults: 23 },
                { query: 'laptop', count: 134, avgResults: 45 },
                { query: 'giày nike', count: 98, avgResults: 12 },
                { query: 'túi xách', count: 87, avgResults: 34 },
                { query: 'đồng hồ', count: 76, avgResults: 28 }
            ],
            searchTrends: [
                { date: '2024-01-01', searches: 45 },
                { date: '2024-01-02', searches: 52 },
                { date: '2024-01-03', searches: 38 },
                { date: '2024-01-04', searches: 67 },
                { date: '2024-01-05', searches: 71 }
            ],
            noResultQueries: [
                { query: 'sản phẩm xyz', count: 23 },
                { query: 'máy bay', count: 18 },
                { query: 'xe hơi', count: 15 }
            ]
        };

        ResponseHelper.success(res, mockAnalytics, 'Lấy analytics tìm kiếm thành công');

    } catch (error) {
        console.error('Error in getSearchAnalytics:', error);
        ResponseHelper.serverError(res, 'Lỗi khi lấy analytics tìm kiếm');
    }
};

/**
 * @desc    Export kết quả tìm kiếm
 * @route   POST /api/products/search/export
 * @access  Private (Admin only)
 */
const exportSearchResults = async (req, res) => {
    try {
        const { query = '', filters = {}, format = 'csv' } = req.body;

        // Build search filter
        let filter = { isActive: true };

        if (query.trim()) {
            filter.$text = { $search: query.trim() };
        }

        // Apply filters similar to regular search
        if (filters.category) {
            filter.category = filters.category;
        }
        if (filters.priceRange) {
            filter.price = {};
            if (filters.priceRange.min) filter.price.$gte = filters.priceRange.min;
            if (filters.priceRange.max) filter.price.$lte = filters.priceRange.max;
        }

        // Get products for export (limit to reasonable number)
        const products = await Product.find(filter)
            .select('name sku price stock.quantity category subcategory rating.average sales views isActive')
            .populate('category', 'name')
            .populate('subcategory', 'name')
            .limit(10000) // Limit for performance
            .sort({ createdAt: -1 });

        // Format data for export
        const exportData = products.map(product => ({
            'Tên sản phẩm': product.name,
            'SKU': product.sku,
            'Giá': product.price,
            'Tồn kho': product.stock.quantity,
            'Danh mục': product.category?.name || '',
            'Danh mục con': product.subcategory?.name || '',
            'Đánh giá': product.rating.average,
            'Lượt bán': product.sales,
            'Lượt xem': product.views,
            'Trạng thái': product.isActive ? 'Hoạt động' : 'Không hoạt động'
        }));

        // TODO: Implement actual file export (CSV, Excel)
        // For now, return data as JSON
        ResponseHelper.success(res, {
            format,
            totalRecords: exportData.length,
            data: exportData.slice(0, 100), // Return first 100 for preview
            downloadUrl: `/api/exports/search-results-${Date.now()}.${format}` // Mock URL
        }, `Xuất ${exportData.length} kết quả tìm kiếm thành công`);

    } catch (error) {
        console.error('Error in exportSearchResults:', error);
        ResponseHelper.serverError(res, 'Lỗi khi xuất kết quả tìm kiếm');
    }
};

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

>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f
        return summary[0] || {};
    } catch (error) {
        console.error('Error getting filter summary:', error);
        return {};
    }
};

module.exports = {
<<<<<<< HEAD
    searchProducts
=======
    searchProducts,
    filterProducts,
    getSearchSuggestions,
    getSimilarProducts,
    getTrendingProducts,
    trackSearchQuery,
    getFacetedSearchResults,
    getSearchAnalytics,
    exportSearchResults
>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f
};