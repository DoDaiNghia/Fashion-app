// Quản lý giỏ hàng
const Response = require('../utils/responseHelper');

// Tạm thời lưu giỏ trên session để tách controller; có thể thay bằng DB sau
const ensureCart = (req) => {
    if (!req.session) {
        req.session = {};
    }
    if (!req.session.cart) {
        req.session.cart = { items: [] };
    }
    return req.session.cart;
};

// Thêm sản phẩm vào giỏ
const addToCart = (req, res) => {
    const { productId, quantity = 1, price = 0 } = req.body || {};
    if (!productId || quantity <= 0) {
        return Response.error(res, 'Dữ liệu giỏ hàng không hợp lệ', 400);
    }
    const cart = ensureCart(req);
    const existing = cart.items.find(i => i.productId === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.items.push({ productId, quantity, price });
    }
    return Response.success(res, cart, 'Đã thêm vào giỏ');
};

// Cập nhật số lượng
const updateItem = (req, res) => {
    const { productId, quantity } = req.body || {};
    if (!productId || quantity == null || quantity < 0) {
        return Response.error(res, 'Dữ liệu cập nhật không hợp lệ', 400);
    }
    const cart = ensureCart(req);
    const item = cart.items.find(i => i.productId === productId);
    if (!item) return Response.notFound(res, 'Mục không tồn tại trong giỏ');
    if (quantity === 0) {
        cart.items = cart.items.filter(i => i.productId !== productId);
    } else {
        item.quantity = quantity;
    }
    return Response.success(res, cart, 'Đã cập nhật giỏ');
};

// Xóa một mục
const removeItem = (req, res) => {
    const { productId } = req.params;
    if (!productId) return Response.error(res, 'Thiếu productId', 400);
    const cart = ensureCart(req);
    const before = cart.items.length;
    cart.items = cart.items.filter(i => i.productId !== productId);
    if (cart.items.length === before) return Response.notFound(res, 'Mục không tồn tại');
    return Response.success(res, cart, 'Đã xóa mục');
};

// Lấy giỏ hiện tại
const getCart = (req, res) => {
    const cart = ensureCart(req);
    return Response.success(res, cart, 'Giỏ hiện tại');
};

// Xóa toàn bộ giỏ
const clearCart = (req, res) => {
    ensureCart(req);
    req.session.cart = { items: [] };
    return Response.success(res, req.session.cart, 'Đã xóa giỏ');
};

module.exports = {
    addToCart,
    updateItem,
    removeItem,
    getCart,
    clearCart
};


