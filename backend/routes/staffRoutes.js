const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

router.post('/product', staffController.createProduct);
router.post('/stock', staffController.updateStock);

module.exports = router;
