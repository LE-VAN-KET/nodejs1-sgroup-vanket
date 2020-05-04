const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}.png`);
    },
  });

const upload = multer({ storage });
const router = express.Router();

const { validateRegister, validateLogin } = require('../app/admin/auth/middleware/auth.validate');
const userController = require('../app/admin/user/controller/users.controller');
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
    readOneProduct,
} = require('../app/admin/product/controller/product.controller');

const categoryController = require('../app/admin/category/controller/category.controller');
const postController = require('../app/admin/category/controller/post.controller');

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

router.get('/userprofile', notAuth, userController.profile);

// show all info user
router.route('/table')
    .get(notAuth, userController.getTable)
    .post(notAuth, userAuth, validateRegister(), userController.postAddUser);

router.get('/table/search', userController.searchUser);

// delete and update profile user
router.route('/table/user/:id')
    .put(notAuth, userAuth, userController.updateUser)
    .delete(notAuth, userAuth, userController.deleteUser);

// view user profile
router.get('/user/:id', notAuth, userController.viewUser);

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
    .post(notAuth, upload.single('imageProduct'), createProducts);
/**
 * update Product
 * delete Product
 */
router.put('/product/:product_id/update', notAuth, updateProduct);
router.delete('/product/:product_id/delete', notAuth, deleteProduct);

/**
 * show all product on product-type-id
 */
router.get('/product/:product_type_id', notAuth, readAllProductTypeId);

router.get('/product/show/:product_slug', notAuth, readOneProduct);

/**
 * Read all categories
 * add category new
 */
router.route('/categories')
    .get(notAuth, categoryController.readAllCatogories)
    .post(notAuth, categoryController.createCategory);

router.put('/categories/:category_slug/update', notAuth, categoryController.updateCategory);
router.delete('/categories/:category_slug/delete', notAuth, categoryController.deleteCategory);

router.get('/posts/:category_slug', notAuth, categoryController.readAllCategorySlug);

router.route('/posts')
    .get(notAuth, postController.readAllPosts);
router.route('/post/add')
    .get(notAuth, postController.getCreatePost)
    .post(notAuth, upload.array('file', 3), postController.createPost);

router.delete('/posts/:post_slug/delete', notAuth, postController.deletePost);
router.route('/posts/:post_slug/update')
    .get(notAuth, postController.getupdatePost)
    .put(notAuth, upload.array('file', 3), postController.updatePost);

router.get('/posts/:post_slug/show', notAuth, postController.readOnePost);

module.exports = router;
