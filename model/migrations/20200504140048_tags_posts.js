
exports.up = (knex) => knex.schema.createTable('tag_post', (table) => {
    table.integer('post_id').unsigned();
    table.foreign('post_id').references('post_id').inTable('posts_categories').onDelete('CASCADE')
    .onUpdate('CASCADE');
    table.integer('tag_id').unsigned();
    table.foreign('tag_id').references('tag_id').inTable('tags').onDelete('CASCADE')
    .onUpdate('CASCADE');
});

exports.down = (knex) => knex.schema.dropTable('tag_post');
