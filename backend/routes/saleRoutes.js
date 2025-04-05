const express = require('express');
const router = express.Router();
const saleController = require('../controller/saleController'); 

router.get('/', saleController.getAllSales);
router.post('/', saleController.createSale);
router.get('/report', saleController.getSalesReport);

module.exports = router;
