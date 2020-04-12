const slugify = require('slugify');
const knex = require('../../../../model/knex');

const readAllProduct = async (req, res) => {
    const productTypes = await knex('product_types').select();
    const products = await knex('product').select();
    return res.render('client/product/product-list', {
        productTypes,
        products,
    });
};

const readProductType = async (req, res) => {
    const productTypes = await knex('product_types').select();
    const products = await knex('product').select()
        .where({ product_type_slug: req.params.product_type_slug });
    return res.render('client/product/product-list', {
        productTypes,
        products,
    });
};

module.exports = {
    readAllProduct,
    readProductType,
};