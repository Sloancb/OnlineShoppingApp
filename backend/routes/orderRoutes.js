const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
//const jwtAuth = require('../middleware/authMiddleware');

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.post('/deliveryPlan',orderController.createDeliveryPlan);

//protect paths
//router.post('/', jwtAuth, orderController.createOrder);
//router.get('/', jwtAuth, orderController.getOrders);

module.exports = router;
