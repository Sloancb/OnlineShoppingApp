const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/fetchAll', stockController.fetchAll);
router.get('/fetchStock', stockController.fetchStock);

router.post('/addStock', stockController.addStock)
router.post('/editStock', stockController.editStock)

module.exports = router;
