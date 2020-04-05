const knex = require('../../../../model/knex');

const readAllProductTypes = async (req, res) => {
    const productTypes = await knex.select('product_types.*', 'table_users.name', 'table_users.email')
        .from('product_types').innerJoin('table_users', 'product_types.user_id', 'table_users.id');
    res.render('admin/products/product-type', {
        productTypes,
    });
};

const createProductType = async (req, res) => {
    const userId = await knex('table_users').select('id').where({ email: req.session.userEmail }).first();
    const newProductType = await {
        user_id: userId.id,
        product_type_name: req.body.product_type_name,
    };
    await knex('product_types').select().insert(newProductType)
    .catch((err) => {
        res.error(err);
    });
    return res.redirect('/admin/product_types');
};

const updateProductType = async (req, res) => {
    const { productTypeName } = await req.body;
    await knex('product_types').select()
        .update({ product_type_name: productTypeName })
        .where({ id: req.params.product_type_id })
        .catch((err) => {
            res.error(err);
        });
    return res.redirect('/admin/product_types');
};

const deleteProductType = async (req, res) => {
    await knex('product_types').select().where({ id: req.params.product_type_id }).del();
    await knex('product').select().where({ product_type_id: req.params.product_type_id }).del();
    return res.redirect('/admin/product_types');
};

const readAllProductTypeId = async (req, res) => {
    const productTypes = await knex('product_types').select('id');
    const products = await knex('product_types').select()
    .rightJoin('product', 'product_types.id', 'product.product_type_id')
    .where('product.product_type_id', req.params.product_type_id);
    return res.render('admin/products/product', {
        products,
        productTypes,
    });
};

module.exports = {
    readAllProductTypes,
    createProductType,
    updateProductType,
    deleteProductType,
    readAllProductTypeId,
};
