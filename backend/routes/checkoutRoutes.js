const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.post('/', checkoutController.createCheckout);
router.post('/', checkoutController.getCheckout);
router.post('/checkoutItem', checkoutController.addCheckoutItem);
router.post('/checkoutItem', checkoutController.removeCheckoutItem);
router.post('/clearcart',checkoutController.clearCheckout);
router.delete('/deleteAll', checkoutController.deleteAll)


module.exports = router;