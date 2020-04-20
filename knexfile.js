require('dotenv').config();

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: process.env.HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      charset: 'utf8',
    },
    migrations: {
      directory: `${__dirname}/model/migrations`,
    },
    seeds: {
      directory: `${__dirname}/model/seeds`,
    },
  },

};
