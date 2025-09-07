// Tiện ích upload Cloudinary
const cloudinary = require('../config/cloudinary');
const { deleteFile } = require('./imageProcessor');

// Upload một ảnh lên Cloudinary
const uploadToCloudinary = async (filePath, folder = 'products') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });

        // Xóa file local sau khi upload
        await deleteFile(filePath);

        return {
            public_id: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes
        };
    } catch (error) {
        // Xóa file local nếu upload thất bại
        await deleteFile(filePath);
        throw new Error(`Upload Cloudinary thất bại: ${error.message}`);
    }
};

// Upload nhiều ảnh lên Cloudinary
const uploadMultipleToCloudinary = async (filePaths, folder = 'products') => {
    const uploadPromises = filePaths.map(filePath =>
        uploadToCloudinary(filePath, folder)
    );

    try {
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        // Dọn dẹp các file local còn lại
        for (const filePath of filePaths) {
            await deleteFile(filePath);
        }
        throw error;
    }
};

// Xóa ảnh từ Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error(`Xóa Cloudinary thất bại: ${error.message}`);
    }
};

// Lấy URL biến đổi ảnh Cloudinary
const getTransformedUrl = (publicId, transformations) => {
    return cloudinary.url(publicId, {
        transformation: transformations
    });
};

module.exports = {
    uploadToCloudinary,
    uploadMultipleToCloudinary,
    deleteFromCloudinary,
    getTransformedUrl
};
