const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const reportCtrl = require('../controllers/reportController');

// Admin only
router.use(auth, adminAuth);

router.get('/revenue', reportCtrl.revenueReport);
router.get('/top-products', reportCtrl.topProducts);

module.exports = router;


