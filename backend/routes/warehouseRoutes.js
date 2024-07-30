const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
router.get('/fetchAll', warehouseController.fetchAll);

module.exports = router;
