const express = require('express');

const router = express.Router();

const { readAllProduct, readProductType } = require('../app/client/product/controller/products.controller');

router.route('/')
    .get(readAllProduct);
router.route('/:product_type_slug')
    .get(readProductType);

module.exports = router;