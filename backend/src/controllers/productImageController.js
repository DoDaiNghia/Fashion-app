// SCRUM-9: Controller upload ảnh sản phẩm - LC
<<<<<<< HEAD
const Product = require('../models/Product');
const ResponseHelper = require('../utils/responseHelper');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const { processImage } = require('../utils/imageProcessor');
const fs = require('fs').promises;
const path = require('path');
=======
const Product = require("../models/Product");
const ResponseHelper = require("../utils/responseHelper");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");
const {
  processImage,
  generateResponsiveSizes,
} = require("../utils/imageProcessor");
const fs = require("fs").promises;
const path = require("path");
>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f

/**
 * @desc    Lấy tất cả ảnh của sản phẩm
 * @route   GET /api/products/:id/images
 * @access  Public
 */
const getProductImages = async (req, res) => {
<<<<<<< HEAD
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
=======
  try {
    const { id } = req.params;

    const product = await Product.findById(id).select("name images");
    if (!product) {
      return ResponseHelper.notFound(res, "Không tìm thấy sản phẩm");
    }

    const images = product.images.map((img) => ({
      id: img._id,
      url: img.url,
      alt: img.alt,
      isMain: img.isMain,
      sizes: img.sizes,
      publicId: img.publicId,
    }));

    ResponseHelper.success(
      res,
      {
        productId: product._id,
        productName: product.name,
        images,
        totalImages: images.length,
      },
      "Lấy danh sách ảnh sản phẩm thành công"
    );
  } catch (error) {
    console.error("Error in getProductImages:", error);
    ResponseHelper.serverError(res, "Lỗi khi lấy danh sách ảnh sản phẩm");
  }
>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f
};

/**
 * @desc    Upload nhiều ảnh cho sản phẩm
 * @route   POST /api/products/:id/images
 * @access  Private (Admin only)
 */
const uploadProductImages = async (req, res) => {
<<<<<<< HEAD
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
=======
  try {
    const { id } = req.params;
    const { alts = [], setMainImage = false } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return ResponseHelper.notFound(res, "Không tìm thấy sản phẩm");
    }

    if (!req.files || req.files.length === 0) {
      return ResponseHelper.error(
        res,
        "Vui lòng chọn ít nhất một ảnh để upload",
        400
      );
    }

    const uploadedImages = [];
    const errors = [];

    // Validate và process từng file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const altText = Array.isArray(alts) ? alts[i] : alts || product.name;

      try {
        // Validate file type
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.mimetype)) {
          errors.push(`File ${file.originalname}: Định dạng không hỗ trợ`);
          continue;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          errors.push(
            `File ${file.originalname}: Kích thước quá lớn (max 5MB)`
          );
          continue;
        }

        // Process image (resize, optimize)
        const processedImagePath = await processImage(file.path, {
          maxWidth: 1200,
          quality: 85,
          format: "jpeg",
        });

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(
          processedImagePath,
          "products",
          {
            folder: `products/${product._id}`,
            transformation: [
              { width: 1200, height: 1200, crop: "limit" },
              { quality: "auto:good" },
              { format: "auto" },
            ],
          }
        );

        // Generate responsive sizes
        const responsiveSizes = await generateResponsiveSizes(
          uploadResult.public_id
        );

        const imageData = {
          url: uploadResult.url,
          alt: altText,
          isMain:
            setMainImage === "true" && i === 0 && product.images.length === 0,
          publicId: uploadResult.public_id,
          sizes: responsiveSizes,
        };

        uploadedImages.push(imageData);

        // Clean up processed file
        try {
          await fs.unlink(processedImagePath);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        errors.push(`File ${file.originalname}: Lỗi xử lý ảnh`);
      }
    }

    if (uploadedImages.length === 0) {
      return ResponseHelper.error(
        res,
        "Không có ảnh nào được upload thành công",
        400
      );
    }

    // Nếu đặt ảnh chính, remove isMain khỏi ảnh khác
    if (setMainImage === "true" && uploadedImages[0]) {
      product.images.forEach((img) => {
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
      images: uploadedImages,
    };

    if (errors.length > 0) {
      response.warnings = errors;
    }

    ResponseHelper.success(
      res,
      response,
      `Upload thành công ${uploadedImages.length}/${req.files.length} ảnh`
    );
  } catch (error) {
    console.error("Error in uploadProductImages:", error);
    ResponseHelper.serverError(res, "Lỗi khi upload ảnh sản phẩm");
  }
>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f
};

/**
 * @desc    Cập nhật thông tin ảnh sản phẩm
 * @route   PUT /api/products/:id/images/:imageId
 * @access  Private (Admin only)
 */
const updateProductImage = async (req, res) => {
<<<<<<< HEAD
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
=======
  try {
    const { id, imageId } = req.params;
    const { alt, isMain } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return ResponseHelper.notFound(res, "Không tìm thấy sản phẩm");
    }

    const imageIndex = product.images.findIndex(
      (img) => img._id.toString() === imageId
    );
    if (imageIndex === -1) {
      return ResponseHelper.notFound(res, "Không tìm thấy ảnh");
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

    ResponseHelper.success(
      res,
      product.images[imageIndex],
      "Cập nhật thông tin ảnh thành công"
    );
  } catch (error) {
    console.error("Error in updateProductImage:", error);
    ResponseHelper.serverError(res, "Lỗi khi cập nhật thông tin ảnh");
  }
>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f
};

/**
 * @desc    Xóa ảnh sản phẩm
 * @route   DELETE /api/products/:id/images/:imageId
 * @access  Private (Admin only)
 */
const deleteProductImage = async (req, res) => {
<<<<<<< HEAD
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
=======
  try {
    const { id, imageId } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return ResponseHelper.notFound(res, "Không tìm thấy sản phẩm");
    }

    const imageIndex = product.images.findIndex(
      (img) => img._id.toString() === imageId
    );
    if (imageIndex === -1) {
      return ResponseHelper.notFound(res, "Không tìm thấy ảnh");
    }

    const imageToDelete = product.images[imageIndex];

    // Delete from Cloudinary
    if (imageToDelete.publicId) {
      try {
        await deleteFromCloudinary(imageToDelete.publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
      }
    }

    // Remove from product
    product.images.splice(imageIndex, 1);

    // If deleted image was main, set first image as main
    if (imageToDelete.isMain && product.images.length > 0) {
      product.images[0].isMain = true;
    }

    await product.save();

    ResponseHelper.success(
      res,
      {
        deletedImageId: imageId,
        remainingImages: product.images.length,
      },
      "Xóa ảnh sản phẩm thành công"
    );
  } catch (error) {
    console.error("Error in deleteProductImage:", error);
    ResponseHelper.serverError(res, "Lỗi khi xóa ảnh sản phẩm");
  }
};

/**
 * @desc    Sắp xếp lại thứ tự ảnh sản phẩm
 * @route   PUT /api/products/:id/images/reorder
 * @access  Private (Admin only)
 */
const reorderProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageOrder } = req.body; // Array of image IDs in new order

    const product = await Product.findById(id);
    if (!product) {
      return ResponseHelper.notFound(res, "Không tìm thấy sản phẩm");
    }

    if (!Array.isArray(imageOrder)) {
      return ResponseHelper.error(res, "imageOrder phải là một mảng", 400);
    }

    // Validate all image IDs exist
    const existingImageIds = product.images.map((img) => img._id.toString());
    const invalidIds = imageOrder.filter(
      (id) => !existingImageIds.includes(id)
    );

    if (invalidIds.length > 0) {
      return ResponseHelper.error(
        res,
        `Ảnh không tồn tại: ${invalidIds.join(", ")}`,
        400
      );
    }

    if (imageOrder.length !== product.images.length) {
      return ResponseHelper.error(res, "Số lượng ảnh không khớp", 400);
    }

    // Reorder images
    const reorderedImages = imageOrder.map((imageId) =>
      product.images.find((img) => img._id.toString() === imageId)
    );

    product.images = reorderedImages;
    await product.save();

    ResponseHelper.success(
      res,
      {
        productId: product._id,
        reorderedImages: product.images.map((img) => ({
          id: img._id,
          url: img.url,
          isMain: img.isMain,
        })),
      },
      "Sắp xếp ảnh thành công"
    );
  } catch (error) {
    console.error("Error in reorderProductImages:", error);
    ResponseHelper.serverError(res, "Lỗi khi sắp xếp ảnh sản phẩm");
  }
};

/**
 * @desc    Đặt ảnh chính cho sản phẩm
 * @route   PUT /api/products/:id/images/:imageId/set-main
 * @access  Private (Admin only)
 */
const setMainImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return ResponseHelper.notFound(res, "Không tìm thấy sản phẩm");
    }

    const imageIndex = product.images.findIndex(
      (img) => img._id.toString() === imageId
    );
    if (imageIndex === -1) {
      return ResponseHelper.notFound(res, "Không tìm thấy ảnh");
    }

    // Set all images isMain to false, then set selected image to true
    product.images.forEach((img, index) => {
      img.isMain = index === imageIndex;
    });

    await product.save();

    ResponseHelper.success(
      res,
      {
        productId: product._id,
        mainImageId: imageId,
        mainImageUrl: product.images[imageIndex].url,
      },
      "Đặt ảnh chính thành công"
    );
  } catch (error) {
    console.error("Error in setMainImage:", error);
    ResponseHelper.serverError(res, "Lỗi khi đặt ảnh chính");
  }
};

/**
 * @desc    Tạo responsive images cho ảnh sản phẩm
 * @route   POST /api/products/:id/images/:imageId/generate-responsive
 * @access  Private (Admin only)
 */
const generateResponsiveImages = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return ResponseHelper.notFound(res, "Không tìm thấy sản phẩm");
    }

    const imageIndex = product.images.findIndex(
      (img) => img._id.toString() === imageId
    );
    if (imageIndex === -1) {
      return ResponseHelper.notFound(res, "Không tìm thấy ảnh");
    }

    const image = product.images[imageIndex];
    if (!image.publicId) {
      return ResponseHelper.error(
        res,
        "Ảnh không có publicId để tạo responsive sizes",
        400
      );
    }

    // Generate responsive sizes from Cloudinary
    const responsiveSizes = await generateResponsiveSizes(image.publicId);

    // Update image with responsive sizes
    product.images[imageIndex].sizes = responsiveSizes;
    await product.save();

    ResponseHelper.success(
      res,
      {
        imageId: image._id,
        sizes: responsiveSizes,
      },
      "Tạo responsive images thành công"
    );
  } catch (error) {
    console.error("Error in generateResponsiveImages:", error);
    ResponseHelper.serverError(res, "Lỗi khi tạo responsive images");
  }
};

/**
 * @desc    Upload ảnh hàng loạt từ URLs
 * @route   POST /api/products/:id/images/bulk-upload
 * @access  Private (Admin only)
 */
const bulkUploadFromUrls = async (req, res) => {
  try {
    const { id } = req.params;
    const { urls, alts = [] } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return ResponseHelper.notFound(res, "Không tìm thấy sản phẩm");
    }

    if (!Array.isArray(urls) || urls.length === 0) {
      return ResponseHelper.error(res, "Vui lòng cung cấp danh sách URLs", 400);
    }

    const uploadedImages = [];
    const errors = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const altText = alts[i] || product.name;

      try {
        // Upload from URL to Cloudinary
        const uploadResult = await uploadToCloudinary(url, "products", {
          folder: `products/${product._id}`,
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto:good" },
            { format: "auto" },
          ],
        });

        const responsiveSizes = await generateResponsiveSizes(
          uploadResult.public_id
        );

        const imageData = {
          url: uploadResult.url,
          alt: altText,
          isMain: false,
          publicId: uploadResult.public_id,
          sizes: responsiveSizes,
        };

        uploadedImages.push(imageData);
      } catch (urlError) {
        console.error(`Error uploading from URL ${url}:`, urlError);
        errors.push(`URL ${url}: Lỗi upload`);
      }
    }

    if (uploadedImages.length === 0) {
      return ResponseHelper.error(
        res,
        "Không có ảnh nào được upload thành công",
        400
      );
    }

    // Add images to product
    product.images.push(...uploadedImages);
    await product.save();

    const response = {
      productId: product._id,
      uploadedImages: uploadedImages.length,
      totalImages: product.images.length,
      images: uploadedImages,
    };

    if (errors.length > 0) {
      response.warnings = errors;
    }

    ResponseHelper.success(
      res,
      response,
      `Upload thành công ${uploadedImages.length}/${urls.length} ảnh từ URLs`
    );
  } catch (error) {
    console.error("Error in bulkUploadFromUrls:", error);
    ResponseHelper.serverError(res, "Lỗi khi upload ảnh từ URLs");
  }
};

/**
 * @desc    Optimize tất cả ảnh của sản phẩm
 * @route   POST /api/products/:id/images/optimize
 * @access  Private (Admin only)
 */
const optimizeAllImages = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return ResponseHelper.notFound(res, "Không tìm thấy sản phẩm");
    }

    if (product.images.length === 0) {
      return ResponseHelper.error(
        res,
        "Sản phẩm chưa có ảnh nào để optimize",
        400
      );
    }

    let optimizedCount = 0;
    const errors = [];

    for (let i = 0; i < product.images.length; i++) {
      const image = product.images[i];

      if (!image.publicId) {
        errors.push(`Ảnh ${i + 1}: Không có publicId`);
        continue;
      }

      try {
        // Generate new responsive sizes with optimization
        const responsiveSizes = await generateResponsiveSizes(image.publicId, {
          quality: "auto:best",
          format: "auto",
        });

        product.images[i].sizes = responsiveSizes;
        optimizedCount++;
      } catch (optimizeError) {
        console.error(
          `Error optimizing image ${image.publicId}:`,
          optimizeError
        );
        errors.push(`Ảnh ${i + 1}: Lỗi optimize`);
      }
    }

    if (optimizedCount > 0) {
      await product.save();
    }

    const response = {
      productId: product._id,
      totalImages: product.images.length,
      optimizedImages: optimizedCount,
    };

    if (errors.length > 0) {
      response.warnings = errors;
    }

    ResponseHelper.success(
      res,
      response,
      `Optimize thành công ${optimizedCount}/${product.images.length} ảnh`
    );
  } catch (error) {
    console.error("Error in optimizeAllImages:", error);
    ResponseHelper.serverError(res, "Lỗi khi optimize ảnh sản phẩm");
  }
};

module.exports = {
  getProductImages,
  uploadProductImages,
  updateProductImage,
  deleteProductImage,
  reorderProductImages,
  setMainImage,
  generateResponsiveImages,
  bulkUploadFromUrls,
  optimizeAllImages,
};
>>>>>>> 0fa37a6882be3307077f27c6d979957742634d9f
