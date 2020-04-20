exports.up = (knex) => knex.schema.createTable('product', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('table_users').onDelete('CASCADE')
    .onUpdate('CASCADE');
    table.integer('product_type_id').unsigned();
    table.foreign('product_type_id').references('id').inTable('product_types').onDelete('CASCADE')
    .onUpdate('CASCADE');
    table.string('product_name', 255).notNullable();
    table.text('product_description').notNullable();
    table.string('image', 255).notNullable();
    table.string('product_slug', 255).unique();
    table.string('product_type_slug', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
});

exports.down = (knex) => knex.schema.dropTable('product');
