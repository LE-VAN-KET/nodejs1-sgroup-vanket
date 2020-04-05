
exports.up = (knex) => knex.schema.createTable('table_users', (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.string('email', 255).unique().notNullable();
        table.string('password', 255).notNullable();
        table.string('address', 255).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });


exports.down = (knex) => knex.schema.dropTable('table_users');
