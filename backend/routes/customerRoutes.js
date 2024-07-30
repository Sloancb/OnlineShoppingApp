const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const jwtAuth = require('../middleware/authMiddleware');

router.post('/register', customerController.register);
router.post('/login', customerController.login);

// Protected routes
router.get('/fetchAll', jwtAuth, customerController.fetchAll);
router.delete('/deleteAll', jwtAuth, customerController.deleteAll);
router.get('/fetchAll', customerController.fetchAll);
router.post('/fetchByName', customerController.fetchByName);
router.post('/update', customerController.update);
router.post('/createCreditCard', customerController.createCreditCard);

module.exports = router;
