const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'public/uploads/' });

const router = express.Router();

const { validateRegister, validateLogin } = require('../app/admin/auth/middleware/auth.validate');

const clientController = require('../app/client/product/controller/products.controller');

const {
    notAuth,
    userAuth,
    adminAuth,
    adminAuthCategory,
} = require('../app/client/auth/middleware/auth');

const {
    getRegister,
    getLogin,
    getLogout,
    postRegister,
    postLogin,
} = require('../app/client/auth/controller/auth.controller');

const {
    readAllCatogory,
    readCategory,
    getCreatePost,
    createPost,
    getupdatePost,
    updatePost,
    deletePost,
} = require('../app/client/category/controller/category.controller');

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

router.get('/categories', notAuth, readAllCatogory);
router.get('/categories/:category_slug', readCategory);

router.route('/posts/add')
    .get(notAuth, getCreatePost)
    .post(notAuth, createPost);

router.route('/posts/:post_slug/update')
    .get(notAuth, getupdatePost)
    .put(notAuth, adminAuthCategory, updatePost);

router.delete('/posts/:post_slug/delete', notAuth, adminAuthCategory, deletePost);

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
