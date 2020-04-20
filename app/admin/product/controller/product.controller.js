const slugify = require('slugify');
const knex = require('../../../../model/knex');

const readAllProducts = async (req, res) => {
    const productTypes = await knex('product_types').select('id');
    const products = await knex('product').select('product.*', 'table_users.name as userCreate', 'product_types.product_type_name')
        .leftJoin('table_users', 'table_users.id', 'product.user_id')
        .leftJoin('product_types', 'product.product_type_slug', 'product_types.product_type_slug');
    return res.render('admin/products/product', {
        productTypes,
        products,
    });
};

const createProducts = async (req, res) => {
    const userId = await knex('table_users').select('id').where({ email: req.session.userEmail }).first();
    const { productName, productDescription, option } = req.body;
    const productSlug = slugify(`product ${productName} ${Date.now()}`, {
        replacement: '-',
        lower: true,
      });
    const productTypeSlug = knex('product_types').select('product_type_slug')
      .where('id', option);
    await knex('product').select().insert({
        user_id: userId.id,
        product_name: productName,
        product_description: productDescription,
        product_type_id: option,
        image: req.file.path.split('/').slice(1).join('/'),
        product_slug: productSlug,
        product_type_slug: productTypeSlug,
    }).catch((err) => {
        return res.redirect('/admin/products');
    });
    return res.redirect('/admin/products');
};

const updateProduct = async (req, res) => {
    const { productName, productDescription, option } = req.body;
    const productTypeSlug = knex('product_types').select('product_type_slug')
      .where('id', option);
    const productSlug = slugify(`product ${productName} ${Date.now()}`, {
        replacement: '-',
        lower: true,
      });
    await knex('product').select()
        .update({
            product_name: productName,
            product_description: productDescription,
            product_type_id: option,
            product_slug: productSlug,
            product_type_slug: productTypeSlug,
        })
        .where({ id: req.params.product_id })
        .catch((err) => {
            res.error(err);
        });
    return res.redirect('/admin/products');
};

const deleteProduct = async (req, res) => {
    await knex('product').select().where({ id: req.params.product_id }).del();
    return res.redirect('/admin/products');
};

const readOneProduct = async (req, res) => {
    const product = await knex('product').select('product.*', 'product_types.product_type_name')
        .leftJoin('product_types', 'product.product_type_id', 'product_types.id')
        .where('product.product_slug', req.params.product_slug)
        .first();
    return res.render('admin/products/viewProduct', { product });
};

module.exports = {
    readAllProducts,
    createProducts,
    updateProduct,
    deleteProduct,
    readOneProduct,
};
