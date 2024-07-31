const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.post('/deliveryPlan',orderController.createDeliveryPlan);

module.exports = router;
