exports.up = (knex) => knex.schema.createTable('tags', (table) => {
    table.increments('tag_id').primary();
    table.string('tag_name', 255).unique().notNullable();
    table.string('tag_slug', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
});

exports.down = (knex) => knex.schema.dropTable('tags');
