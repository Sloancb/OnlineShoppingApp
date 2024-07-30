const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/create', cartController.createCartItem);		// create item
router.post('/addToCart', cartController.addToCart);		// add / update item for id
router.post('/update', cartController.updateCartItem);		// update item for id

router.get('/getItems/:customer_id', cartController.getCartItems);		// get all items for id
router.get('/getAll', cartController.getCart);				// get all

router.delete('/deleteItem', cartController.deleteCartItem);	// delete item
router.delete('/empty', cartController.emptyCart);			// empty customer cart
router.delete('/deleteAll', cartController.deleteAll);		// delete all

module.exports = router;