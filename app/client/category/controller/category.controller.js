const slugify = require('slugify');
const knex = require('../../../../model/knex');

const readAllCatogory = async (req, res) => {
    const categories = await knex('categories').select('category_name', 'category_slug');
    const posts = await knex('posts_categories').select();
    return res.render('client/categories/category-list', { categories, posts });
};

const readCategory = async (req, res) => {
    const categories = await knex('categories').select('category_name', 'category_slug');
    const posts = await knex('posts_categories').where({ category_slug: req.params.category_slug }).select();
    return res.render('client/categories/category-list', { categories, posts });
};

const getCreatePost = async (req, res) => {
    const categories = await knex('categories').select('category_name');
    return res.render('client/categories/newPost', { categories });
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
        res.status(500).json(err);
    });
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
    return res.redirect('/categories');
};

const getupdatePost = async (req, res) => {
    const categories = await knex('categories').select('category_name');
    const post = await knex('posts_categories').select('*')
    .leftJoin('categories', 'posts_categories.category_slug', 'categories.category_slug')
    .rightJoin('tag_post', 'posts_categories.post_id', 'tag_post.post_id')
    .leftJoin('tags', 'tag_post.tag_id', 'tags.tag_id')
    .where('posts_categories.post_slug', req.params.post_slug);
    return res.render('client/categories/updatePost', { post, categories });
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
            res.status(500).json(err);
        });
    return res.redirect(`/categories/post/${postSlug}/show`);
};

const deletePost = async (req, res) => {
    await knex('posts_categories').where({ post_slug: req.params.post_slug }).del();
    return res.redirect('/categories');
};

const readOnePost = async (req, res) => {
    const post = await knex('tag_post').select('tag_post.*', 'posts_categories.*', 'tags.*')
    .leftJoin('posts_categories', 'tag_post.post_id', 'posts_categories.post_id')
    .leftJoin('tags', 'tag_post.tag_id', 'tags.tag_id')
    .where({ post_slug: req.params.post_slug });
    return res.render('client/categories/show-post', { post });
};

const readAllPostTag = async (req, res) => {
    const categories = await knex('categories').select('category_name', 'category_slug');
    const posts = await knex('tag_post').select('tag_post.*', 'tags.*', 'posts_categories.*')
    .leftJoin('tags', 'tag_post.tag_id', 'tags.tag_id')
    .leftJoin('posts_categories', 'tag_post.post_id', 'posts_categories.post_id')
    .where({ tag_slug: req.params.tag_slug });
    return res.render('client/categories/category-list', { categories, posts });
};

module.exports = {
    readAllCatogory,
    readCategory,
    getCreatePost,
    createPost,
    getupdatePost,
    updatePost,
    deletePost,
    readOnePost,
    readAllPostTag,
};
