const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
//const jwtAuth = require('../middleware/authMiddleware');

router.post('/createProduct', staffController.createProduct);
router.post('/updateStock', staffController.updateStock);
//router.post('/stock', staffController.updateStock);

//protected
// router.post('/create', jwtAuth, staffController.createStaff);
// router.post('/product', jwtAuth, staffController.createProduct);
// router.post('/stock', jwtAuth, staffController.updateStock);
router.post('/register', staffController.register);
router.post('/product', staffController.createProduct);
router.post('/stock', staffController.updateStock);

module.exports = router;
