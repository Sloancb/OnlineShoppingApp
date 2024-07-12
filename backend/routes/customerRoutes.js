const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/register', customerController.register);
router.post('/login', customerController.login);

router.get('/fetchAll', customerController.fetchAll);
router.get('/fetchByName', customerController.fetchByName);

router.delete("/deleteAll", customerController.deleteAll);
module.exports = router;
