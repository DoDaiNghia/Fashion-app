const express = require('express');
const router = express.Router();

const orderFromCartController = require('../controllers/orderFromCartController');
const orderController = require('../controllers/orderController');

// Create order from cart
router.post('/from-cart', orderFromCartController.createOrderFromCart);

// Orders CRUD-lite
router.post('/', orderController.create);
router.get('/', orderController.list);
router.get('/:id', orderController.getById);
router.patch('/:id/status', orderController.updateStatus);
router.delete('/:id', orderController.remove);

module.exports = router;


