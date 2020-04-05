require('dotenv').config();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');

const SESS_LIFETIME = 1000 * 60 * 60;// TOW_HOURS
const IN_PROD = process.env.NODE === 'production';

const options = {
	host: process.env.HOST,
	port: 3306,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ClearExpired: true,
    checkExpirationInterval: process.env.MAX_AGE,
    expiration: 86400000,
    createDatabaseTable: true,
    connectionLimit: 1,
    endConnectionOnClose: true,
    charset: 'utf8_unicode_ci',
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data',
        },
},
};

const connection = mysql.createConnection(options);
const sessionStore = new MySQLStore({}, connection);

const sessionConfig = {
      // name: process.env.SESS_NAME,
  key: process.env.SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSTION_SECRET,
  store: sessionStore,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD,
    },
};

const sessionModules = session(sessionConfig);

module.exports = {
    sessionModules,
};
