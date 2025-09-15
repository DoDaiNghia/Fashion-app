const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');
const cartTotalsController = require('../controllers/cartTotalsController');

// Cart items
router.post('/items', cartController.addToCart);
router.patch('/items', cartController.updateItem);
router.delete('/items/:productId', cartController.removeItem);

// Cart
router.get('/', cartController.getCart);
router.delete('/', cartController.clearCart);

// Totals
router.get('/totals', cartTotalsController.getTotals);

module.exports = router;


