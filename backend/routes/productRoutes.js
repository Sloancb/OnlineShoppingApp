const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
//const jwtAuth = require('../middleware/authMiddleware');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.delete('/deleteAll', productController.deleteAll)

//protected
//router.post('/', jwtAuth, productController.createProduct);
//router.get('/', jwtAuth, productController.getProducts);
//router.delete('/deleteAll', jwtAuth, productController.deleteAll);

router.post('/editProduct', productController.editProduct);
router.delete('/deleteAll', productController.deleteAll);
router.delete('/delete', productController.deleteProduct)
module.exports = router;
