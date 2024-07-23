const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/register', customerController.register);
router.post('/login', customerController.login);

router.get('/fetchAll', customerController.fetchAll);
router.post('/fetchByName', customerController.fetchByName);
router.post('/update', customerController.update);
router.post('/createCreditCard', customerController.createCreditCard);

router.delete("/deleteAll", customerController.deleteAll);
module.exports = router;