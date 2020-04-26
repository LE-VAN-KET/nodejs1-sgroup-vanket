
exports.up = (knex) => knex.schema.createTable('posts_categories', (table) => {
    table.increments('post_id').primary();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('table_users').onDelete('CASCADE')
    .onUpdate('CASCADE');
    table.string('post_title', 255).notNullable();
    table.longText('post_content').notNullable();
    table.string('post_slug', 255).notNullable();
    table.string('category_slug', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
});

exports.down = (knex) => knex.schema.dropTable('posts_categories');
