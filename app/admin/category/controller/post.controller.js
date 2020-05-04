const slugify = require('slugify');
const knex = require('../../../../model/knex');

const readAllPosts = async (req, res) => {
    const categories = await knex('categories').select('category_name');
    const postsCategories = await knex('posts_categories').select('posts_categories.*', 'table_users.name as userCreate', 'categories.category_name')
        .leftJoin('table_users', 'table_users.id', 'posts_categories.user_id')
        .leftJoin('categories', 'posts_categories.category_slug', 'categories.category_slug');
    return res.render('admin/categories/posts', { postsCategories, categories });
};

const createPost = async (req, res) => {
    const userId = await knex('table_users').where({ email: req.session.userEmail }).first();
    const { postTitle, postContent, option } = req.body;
    const tags = req.body.tags.split(',');
    const postSlug = slugify(`post ${postTitle} ${Date.now()}`, {
        replacement: '-',
        lower: true,
      });
    const categorySlug = knex('categories').select('category_slug')
      .where('category_name', option);
    await knex('posts_categories').insert({
        user_id: userId.id,
        post_title: postTitle,
        post_content: postContent,
        post_slug: postSlug,
        category_slug: categorySlug,
    }).catch((err) => {
        res.status(501, { message: err });
    });
    // createPost
    const postId = await knex('posts_categories').where({ post_slug: postSlug }).first('post_id');
    await tags.forEach(async (tag) => {
        const tagSlug = slugify(`tag ${tag} ${Date.now()}`, {
            replacement: '-',
            lower: true,
        });
        await knex('tags').insert({ tag_name: tag, tag_slug: tagSlug }).catch((err) => {
            if (err === 'ER_DUP_ENTRY') {
                res.json(err);
            }
        });
        const tagId = await knex('tags').where({ tag_name: tag }).first('tag_id');
        await knex('tag_post').insert({ post_id: postId.post_id, tag_id: tagId.tag_id });
    });
    return res.redirect('/admin/posts');
};

const updatePost = async (req, res) => {
    const userId = await knex('table_users').where({ email: req.session.userEmail }).first();
    const { postTitle, postContent, option } = req.body;
    const categorySlug = knex('categories').select('category_slug')
      .where('category_name', option);
    const postSlug = slugify(`post ${postTitle} ${Date.now()}`, {
        replacement: '-',
        lower: true,
      });
    await knex('posts_categories').select()
        .update({
            user_id: userId.id,
            post_title: postTitle,
            post_content: postContent,
            post_slug: postSlug,
            category_slug: categorySlug,
        })
        .where({ post_slug: req.params.post_slug })
        .catch((err) => {
            res.status(501, { message: err });
        });
    return res.redirect('/admin/posts');
};

const deletePost = async (req, res) => {
    await knex('posts_categories').where({ post_slug: req.params.post_slug }).del();
    return res.redirect('/admin/posts');
};

const readOnePost = async (req, res) => {
    // const post = await knex('posts_categories')
    //     .leftJoin('categories', 'posts_categories.category_slug', 'categories.category_slug')
    //     .where('posts_categories.post_slug', req.params.post_slug)
    //     .first('posts_categories.*', 'categories.category_name');
    const post = await knex('posts_categories').select('*')
    .leftJoin('categories', 'posts_categories.category_slug', 'categories.category_slug')
    .rightJoin('tag_post', 'posts_categories.post_id', 'tag_post.post_id')
    .leftJoin('tags', 'tag_post.tag_id', 'tags.tag_id')
    .where('posts_categories.post_slug', req.params.post_slug);
    return res.render('admin/categories/viewPost', { post });
};

const getCreatePost = async (req, res) => {
    const categories = await knex('categories').select('category_name');
    return res.render('admin/categories/newpost', { categories });
};

const getupdatePost = async (req, res) => {
    const categories = await knex('categories').select('category_name');
    const post = await knex('posts_categories')
        .leftJoin('categories', 'posts_categories.category_slug', 'categories.category_slug')
        .where('posts_categories.post_slug', req.params.post_slug)
        .first('posts_categories.*', 'categories.category_name');
    return res.render('admin/categories/updatePost', { post, categories });
};

module.exports = {
    readAllPosts,
    createPost,
    updatePost,
    deletePost,
    readOnePost,
    getCreatePost,
    getupdatePost,
};
