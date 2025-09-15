// Quản lý đơn hàng lưu DB (Mongoose)
const Response = require('../utils/responseHelper');
const Order = require('../models/Order');

const create = async (req, res) => {
    try {
        const { items = [], amounts = {}, status = 'created', notes, meta } = req.body || {};
        if (!Array.isArray(items) || items.length === 0) {
            return Response.error(res, 'Đơn hàng trống', 400);
        }
        if (amounts.subtotal == null || amounts.total == null) {
            return Response.error(res, 'Thiếu thông tin tiền hàng', 400);
        }

        const order = await Order.create({
            user: req.user?.id || null,
            items,
            amounts: {
                subtotal: Number(amounts.subtotal) || 0,
                tax: Number(amounts.tax) || 0,
                shipping: Number(amounts.shipping) || 0,
                total: Number(amounts.total) || 0
            },
            status,
            notes,
            meta
        });

        return Response.created(res, order, 'Đã tạo đơn hàng');
    } catch (error) {
        console.error('Create order error:', error);
        return Response.serverError(res, 'Không tạo được đơn hàng');
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('user', 'username email');
        if (!order) return Response.notFound(res, 'Không tìm thấy đơn hàng');
        return Response.success(res, order, 'Chi tiết đơn hàng');
    } catch (error) {
        console.error('Get order error:', error);
        return Response.serverError(res, 'Lỗi khi lấy đơn hàng');
    }
};

const list = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const filter = {};
        if (status) filter.status = status;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [orders, total] = await Promise.all([
            Order.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Order.countDocuments(filter)
        ]);
        return Response.success(res, { orders, total, page: parseInt(page), limit: parseInt(limit) }, 'Danh sách đơn hàng');
    } catch (error) {
        console.error('List orders error:', error);
        return Response.serverError(res, 'Lỗi khi lấy danh sách đơn hàng');
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body || {};
        const order = await Order.findById(id);
        if (!order) return Response.notFound(res, 'Không tìm thấy đơn hàng');
        if (status) order.status = status;
        await order.save();
        return Response.success(res, order, 'Đã cập nhật trạng thái');
    } catch (error) {
        console.error('Update order status error:', error);
        return Response.serverError(res, 'Lỗi khi cập nhật trạng thái đơn hàng');
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const existed = await Order.findByIdAndDelete(id);
        if (!existed) return Response.notFound(res, 'Không tìm thấy đơn hàng');
        return Response.noContent(res);
    } catch (error) {
        console.error('Delete order error:', error);
        return Response.serverError(res, 'Lỗi khi xóa đơn hàng');
    }
};

module.exports = {
    create,
    getById,
    list,
    updateStatus,
    remove
};


