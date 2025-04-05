const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

router.get('/', productController.getProducts);
router.post('/', productController.addProduct);
router.put('/:id', productController.editProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
