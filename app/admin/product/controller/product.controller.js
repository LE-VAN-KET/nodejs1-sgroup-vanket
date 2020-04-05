const knex = require('../../../../model/knex');

const readAllProducts = async (req, res) => {
    const productTypes = await knex('product_types').select('id');
    const products = await knex('product').select();
    return res.render('admin/products/product', {
        productTypes,
        products,
    });
};

const createProducts = async (req, res) => {
    const userId = await knex('table_users').select('id').where({ email: req.session.userEmail }).first();
    const { productName, productDescription, option } = await req.body;
    await knex('product').select().insert({
        user_id: userId.id,
        product_name: productName,
        product_description: productDescription,
        product_type_id: option,
    });
    return res.redirect('/admin/products');
};

const updateProduct = async (req, res) => {
    const { productName, productDescription, option } = await req.body;
    await knex('product').select()
        .update({
            product_name: productName,
            product_description: productDescription,
            product_type_id: option,
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

module.exports = {
    readAllProducts,
    createProducts,
    updateProduct,
    deleteProduct,
};
