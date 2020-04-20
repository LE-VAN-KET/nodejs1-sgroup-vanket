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

const readProduct = async (req, res) => {
    const product = await knex('product').select('product.*', 'product_types.product_type_name')
        .innerJoin('product_types', 'product.product_type_slug', 'product_types.product_type_slug')
        .where('product_slug', req.params.product_slug)
        .first();
    return res.render('client/product/activeProduct-list', { product });
};

const deleteProduct = async (req, res) => {
    await knex('product').select().where('product_slug', req.params.product_slug).del();
    return res.redirect('/products');
};

const updateProduct = async (req, res) => {
    const { productName, productDescription } = req.body;
    const productSlug = slugify(`product ${productName} ${Date.now()}`, {
        replacement: '-',
        lower: true,
      });
    await knex('product').select()
        .update({
            product_name: productName,
            product_description: productDescription,
            product_slug: productSlug,
        })
        .where('product.product_slug', req.params.product_slug);
    return res.redirect('/products');
};

const createProduct = async (req, res) => {
    const { productName, productDescription, ProductTypeName } = req.body;
    const userId = await knex('table_users').select('id').where({ email: req.session.userEmail }).first();
    const productTypeSlug = slugify(`product type ${ProductTypeName}`, {
        replacement: '-',
        lower: true,
      });
    const productSlug = slugify(`product ${productName} ${Date.now()}`, {
        replacement: '-',
        lower: true,
    });
    const newProductType = await {
        user_id: userId.id,
        product_type_name: ProductTypeName,
        product_type_slug: productTypeSlug,
    };
    await knex('product_types').select().insert(newProductType)
        .catch((err) => res.status(500, { message: err }));
    await knex('product').select().insert({
        user_id: userId.id,
        product_name: productName,
        product_description: productDescription,
        image: req.file.path.split('/').slice(1).join('/'),
        product_slug: productSlug,
        product_type_slug: productTypeSlug,
    });
    return res.redirect('/products');
};

module.exports = {
    readAllProduct,
    readProductType,
    readProduct,
    deleteProduct,
    updateProduct,
    createProduct,
};
