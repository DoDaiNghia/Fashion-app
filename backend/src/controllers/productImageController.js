// SCRUM-9: Controller upload ảnh sản phẩm - LC
const Product = require('../models/Product');
const ResponseHelper = require('../utils/responseHelper');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const { processImage } = require('../utils/imageProcessor');
const fs = require('fs').promises;
const path = require('path');

/**
 * @desc    Lấy tất cả ảnh của sản phẩm
 * @route   GET /api/products/:id/images
 * @access  Public
 */
const getProductImages = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).select('name images');
        if (!product) {
            return ResponseHelper.notFound(res, 'Không tìm thấy sản phẩm');
        }

        const images = product.images.map(img => ({
            id: img._id,
            url: img.url,
            alt: img.alt,
            isMain: img.isMain,
            sizes: img.sizes,
            publicId: img.publicId
        }));

        ResponseHelper.success(res, {
            productId: product._id,
            productName: product.name,
            images,
            totalImages: images.length
        }, 'Lấy danh sách ảnh sản phẩm thành công');

    } catch (error) {
        console.error('Error in getProductImages:', error);
        ResponseHelper.serverError(res, 'Lỗi khi lấy danh sách ảnh sản phẩm');
    }
};

/**
 * @desc    Upload nhiều ảnh cho sản phẩm
 * @route   POST /api/products/:id/images
 * @access  Private (Admin only)
 */
const uploadProductImages = async (req, res) => {
    try {
        const { id } = req.params;
        const { alts = [], setMainImage = false } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return ResponseHelper.notFound(res, 'Không tìm thấy sản phẩm');
        }

        if (!req.files || req.files.length === 0) {
            return ResponseHelper.error(res, 'Vui lòng chọn ít nhất một ảnh để upload', 400);
        }

        const uploadedImages = [];
        const errors = [];

        // Validate và process từng file
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const altText = Array.isArray(alts) ? alts[i] : alts || product.name;

            try {
                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!allowedTypes.includes(file.mimetype)) {
                    errors.push(`File ${file.originalname}: Định dạng không hỗ trợ`);
                    continue;
                }

                // Validate file size (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    errors.push(`File ${file.originalname}: Kích thước quá lớn (max 5MB)`);
                    continue;
                }

                // Process image (resize, optimize)
                const processedImagePath = await processImage(file.path, {
                    maxWidth: 1200,
                    quality: 85,
                    format: 'jpeg'
                });

                // Upload to Cloudinary
                const uploadResult = await uploadToCloudinary(processedImagePath, 'products', {
                    folder: `products/${product._id}`,
                    transformation: [
                        { width: 1200, height: 1200, crop: 'limit' },
                        { quality: 'auto:good' },
                        { format: 'auto' }
                    ]
                });

                const imageData = {
                    url: uploadResult.url,
                    alt: altText,
                    isMain: setMainImage === 'true' && i === 0 && product.images.length === 0,
                    publicId: uploadResult.public_id
                };

                uploadedImages.push(imageData);

                // Clean up processed file
                try {
                    await fs.unlink(processedImagePath);
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }

            } catch (fileError) {
                console.error(`Error processing file ${file.originalname}:`, fileError);
                errors.push(`File ${file.originalname}: Lỗi xử lý ảnh`);
            }
        }

        if (uploadedImages.length === 0) {
            return ResponseHelper.error(res, 'Không có ảnh nào được upload thành công', 400);
        }

        // Nếu đặt ảnh chính, remove isMain khỏi ảnh khác
        if (setMainImage === 'true' && uploadedImages[0]) {
            product.images.forEach(img => {
                img.isMain = false;
            });
            uploadedImages[0].isMain = true;
        }

        // Add images to product
        product.images.push(...uploadedImages);
        await product.save();

        const response = {
            productId: product._id,
            uploadedImages: uploadedImages.length,
            totalImages: product.images.length,
            images: uploadedImages
        };

        if (errors.length > 0) {
            response.warnings = errors;
        }

        ResponseHelper.success(res, response,
            `Upload thành công ${uploadedImages.length}/${req.files.length} ảnh`);

    } catch (error) {
        console.error('Error in uploadProductImages:', error);
        ResponseHelper.serverError(res, 'Lỗi khi upload ảnh sản phẩm');
    }
};

/**
 * @desc    Cập nhật thông tin ảnh sản phẩm
 * @route   PUT /api/products/:id/images/:imageId
 * @access  Private (Admin only)
 */
const updateProductImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;
        const { alt, isMain } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return ResponseHelper.notFound(res, 'Không tìm thấy sản phẩm');
        }

        const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
        if (imageIndex === -1) {
            return ResponseHelper.notFound(res, 'Không tìm thấy ảnh');
        }

        // Update alt text
        if (alt !== undefined) {
            product.images[imageIndex].alt = alt;
        }

        // Update main image
        if (isMain === true) {
            // Remove isMain from all other images
            product.images.forEach((img, index) => {
                img.isMain = index === imageIndex;
            });
        } else if (isMain === false) {
            product.images[imageIndex].isMain = false;
        }

        await product.save();

        ResponseHelper.success(res, product.images[imageIndex], 'Cập nhật thông tin ảnh thành công');

    } catch (error) {
        console.error('Error in updateProductImage:', error);
        ResponseHelper.serverError(res, 'Lỗi khi cập nhật thông tin ảnh');
    }
};

/**
 * @desc    Xóa ảnh sản phẩm
 * @route   DELETE /api/products/:id/images/:imageId
 * @access  Private (Admin only)
 */
const deleteProductImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return ResponseHelper.notFound(res, 'Không tìm thấy sản phẩm');
        }

        const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
        if (imageIndex === -1) {
            return ResponseHelper.notFound(res, 'Không tìm thấy ảnh');
        }

        const imageToDelete = product.images[imageIndex];

        // Delete from Cloudinary
        if (imageToDelete.publicId) {
            try {
                await deleteFromCloudinary(imageToDelete.publicId);
            } catch (cloudinaryError) {
                console.error('Error deleting from Cloudinary:', cloudinaryError);
            }
        }

        // Remove from product
        product.images.splice(imageIndex, 1);

        // If deleted image was main, set first image as main
        if (imageToDelete.isMain && product.images.length > 0) {
            product.images[0].isMain = true;
        }

        await product.save();

        ResponseHelper.success(res, {
            deletedImageId: imageId,
            remainingImages: product.images.length
        }, 'Xóa ảnh sản phẩm thành công');

    } catch (error) {
        console.error('Error in deleteProductImage:', error);
        ResponseHelper.serverError(res, 'Lỗi khi xóa ảnh sản phẩm');
    }
};

module.exports = {
    getProductImages,
    uploadProductImages,
    updateProductImage,
    deleteProductImage
};