const express = require('express');
const router = express.Router();
const supplierController = require('../controller/supplierController');

// Define routes for suppliers
router.get('/', supplierController.getAllSuppliers);
router.post('/', supplierController.addSupplier);
router.put('/:id', supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;