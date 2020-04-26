
exports.up = (knex) => knex.schema.createTable('categories', (table) => {
    table.increments('category_id').primary();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('table_users').onDelete('CASCADE')
    .onUpdate('CASCADE');
    table.string('category_name', 255).unique().notNullable();
    table.string('category_slug', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
});

exports.down = (knex) => knex.schema.dropTable('categories');
