
exports.up = (knex) => knex.schema.createTable('role', (table) => {
    table.integer('role_id').unsigned().primary();
    table.foreign('role_id').references('id').inTable('table_users').onDelete('CASCADE')
    .onUpdate('CASCADE');
    table.string('role_name', 255);
});

exports.down = (knex) => knex.schema.dropTable('role');
