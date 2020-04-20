const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'public/uploads/' });

const router = express.Router();

const { validateRegister, validateLogin } = require('../app/admin/auth/middleware/auth.validate');

const clientController = require('../app/client/product/controller/products.controller');

const { notAuth, userAuth, adminAuth } = require('../app/client/auth/middleware/auth');

const {
    getRegister,
    getLogin,
    getLogout,
    postRegister,
    postLogin,
} = require('../app/client/auth/controller/auth.controller');

router.route('/products')
    .get(notAuth, clientController.readAllProduct)
    .post(notAuth, upload.single('imageProduct'), clientController.createProduct);

router.route('/products/:product_type_slug')
    .get(notAuth, clientController.readProductType);

router.route('/product/read/:product_slug')
    .get(notAuth, clientController.readProduct);

router.route('/product/:product_slug/delete')
    .delete(notAuth, adminAuth, clientController.deleteProduct);

router.route('/product/:product_slug/update')
    .put(notAuth, adminAuth, clientController.updateProduct);

// auth register
router.route('/auth/register')
    .get(userAuth, getRegister)
    .post(userAuth, validateRegister(), postRegister);

router.route('/auth/login')
    .get(userAuth, getLogin)
    .post(userAuth, validateLogin(), postLogin);

// logout
router.get('/auth/logout', notAuth, getLogout);

module.exports = router;
