
require('dotenv').config();

exports.seed = async (knex) => {
  await knex('role').del();
  const user = await knex('table_users').where({ email: process.env.emailSuperAdmin }).first();
  return knex('role').insert({
    role_id: user.id, role_name: 'super admin',
  });
};
