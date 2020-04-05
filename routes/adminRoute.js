const express = require('express');

const router = express.Router();

const { validateRegister, validateLogin } = require('../app/admin/auth/middleware/auth.validate');

const {
    getTable,
    updateUser,
    deleteUser,
    postAddUser,
    profile,
    viewUser,
    searchUser,
} = require('../app/admin/user/controller/users.controller');

const {
    getRegister,
    getLogin,
    getLogout,
    postRegister,
    postLogin,
    getDash,
} = require('../app/admin/auth/controller/auth.controller');

const { notAuth, userAuth } = require('../app/admin/auth/middleware/auth');

const {
    readAllProductTypes,
    createProductType,
    updateProductType,
    deleteProductType,
    readAllProductTypeId,
 } = require('../app/admin/product/controller/product-type.controller');

const {
    createProducts,
    readAllProducts,
    updateProduct,
    deleteProduct,
} = require('../app/admin/product/controller/product.controller');

router.get('/', notAuth);

  // register
router.route('/auth/register')
    .get(userAuth, getRegister)
    .post(userAuth, validateRegister(), postRegister);

    // login
router.route('/auth/login')
    .get(userAuth, getLogin)
    .post(userAuth, validateLogin(), postLogin);

    // logout
router.get('/auth/logout', notAuth, getLogout);

router.get('/dashboard', notAuth, getDash);

router.get('/userprofile', notAuth, profile);

// show all info user
router.route('/table')
    .get(notAuth, getTable)
    .post(notAuth, validateRegister(), postAddUser);

router.get('/table/search', searchUser);

// delete and update profile user
router.route('/table/user/:id')
    .put(notAuth, updateUser)
    .delete(notAuth, deleteUser);

// view user profile
router.get('/user/:id', notAuth, viewUser);

/**
 * Read all product-types
 * add product-type new
 */
router.route('/product_types')
    .get(notAuth, readAllProductTypes)
    .post(notAuth, createProductType);

/**
 * update Product Types
 * delete Product Types */
router.put('/product_type/:product_type_id/update', notAuth, updateProductType);
router.delete('/product_type/:product_type_id/delete', notAuth, deleteProductType);

router.route('/products')
    .get(notAuth, readAllProducts)
    .post(notAuth, createProducts);
/**
 * update Product
 * delete Product
 */
router.put('/product/:product_id/update', notAuth, updateProduct);
router.delete('/product/:product_id/delete', notAuth, deleteProduct);

/**
 * show all product on product-type-id
 */
router.get('/product/:product_type_id', readAllProductTypeId);

module.exports = router;