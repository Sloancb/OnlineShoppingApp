const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/fetchCode', adminController.fetchCode);

module.exports = router;
