
exports.up = (knex) => knex.schema.createTable('product_types', (table) => {
    table.increments('id').primary();
    table.string('product_type_name', 255).unique().notNullable();
    table.string('product_type_slug', 255).unique();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('table_users').onDelete('CASCADE')
    .onUpdate('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
});

exports.down = (knex) => knex.schema.dropTable('product_types');
