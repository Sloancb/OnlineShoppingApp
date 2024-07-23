const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const jwtAuth = require('../middleware/authMiddleware');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.delete('/deleteAll', productController.deleteAll)

module.exports = router;
