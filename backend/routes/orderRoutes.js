const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const jwtAuth = require('../middleware/authMiddleware');

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);

module.exports = router;
