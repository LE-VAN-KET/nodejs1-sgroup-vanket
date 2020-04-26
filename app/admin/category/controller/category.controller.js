const slugify = require('slugify');
const knex = require('../../../../model/knex');

const readAllCatogories = async (req, res) => {
    const categories = await knex.select('categories.*', 'table_users.name', 'table_users.email')
        .from('categories').innerJoin('table_users', 'categories.user_id', 'table_users.id');
    return res.render('admin/categories/category', {
        categories,
    });
};

const createCategory = async (req, res) => {
    const userId = await knex('table_users').where({ email: req.session.userEmail }).first();
    const categorySlug = slugify(`category ${req.body.categoryName}`, {
        replacement: '-',
        lower: true,
      });
    const newCategory = {
        user_id: userId.id,
        category_name: req.body.categoryName,
        category_slug: categorySlug,
    };
    await knex('categories').insert(newCategory)
    .catch((err) => {
        return res.redirect('/admin/categories');
    });
    return res.redirect('/admin/categories');
};

const updateCategory = async (req, res) => {
    const { categoryName } = req.body;
    const categorySlug = slugify(`category ${categoryName}`, {
        replacement: '-',
        lower: true,
      });
    await knex('categories').select()
        .update({ category_name: categoryName, category_slug: categorySlug })
        .where({ category_slug: req.params.category_slug })
        .catch((err) => {
            res.error(err);
        });
    await knex('posts_categories').select().update({ category_slug: categorySlug })
        .where({ category_slug: req.params.category_slug });
    return res.redirect('/admin/categories');
};

const deleteCategory = async (req, res) => {
    await knex('categories').select().where('category_slug', req.params.category_slug).del();
    return res.redirect('/admin/categories');
};

const readAllCategorySlug = async (req, res) => {
    const categories = await knex('categories').select('category_name');
    const postsCategories = await knex('posts_categories').select('posts_categories.*', 'table_users.name as userCreate', 'categories.category_name')
        .leftJoin('table_users', 'table_users.id', 'posts_categories.user_id')
        .leftJoin('categories', 'posts_categories.category_slug', 'categories.category_slug')
        .where('posts_categories.category_slug', req.params.category_slug);
    return res.render('admin/categories/posts', { postsCategories, categories });
};

module.exports = {
    readAllCatogories,
    createCategory,
    updateCategory,
    deleteCategory,
    readAllCategorySlug,
};
