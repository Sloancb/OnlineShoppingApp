const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.post('/editProduct', productController.editProduct);
router.delete('/deleteAll', productController.deleteAll);
router.delete('/delete', productController.deleteProduct)
module.exports = router;
