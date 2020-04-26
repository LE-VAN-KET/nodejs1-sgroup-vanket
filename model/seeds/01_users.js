
const bcrypt = require('bcrypt');
require('dotenv').config();

const salt = 10;

const newUser = {
  name: 'Le Van Ket',
  email: process.env.emailSuperAdmin,
  address: 'duy phuoc',
  password: process.env.passwordSuperAdmin,
};

exports.seed = async (knex) => {
  await knex('table_users').del();
  newUser.password = await bcrypt.hash(process.env.passwordSuperAdmin, salt);
  return knex('table_users').insert(newUser);
};
