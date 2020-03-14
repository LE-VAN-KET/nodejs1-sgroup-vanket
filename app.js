require('dotenv').config();
const cors = require('cors');
const knex = require('./db/knex');

const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const dashRoutes = require('./routes/dash.route');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const authmiddleware = require('./middleware/auth.middleware');
const infouserRoutes = require('./routes/profile.route');
const logger = require('morgan');
const logout_router = require('./routes/logout.route');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');

const options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
  database: 'admin',
  ClearExpired : true ,
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
        data: 'data'
    }
}
};

const connection = mysql.createConnection(options); // or mysql.createPool(options);
const sessionStore = new MySQLStore({}/* session store options */, connection);

const app = express();
const SESS_LIFETIME = 1000*60*60;//TOW_HOURS
const IN_PROD = process.env.NODE === 'production';


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSTION_SECRET));

app.use(session({
  name: process.env.SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSTION_SECRET,
  store: sessionStore,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD
  }
}));

app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true,
}));

app.set('view engine', 'ejs');
// app.set('views', './views');

app.get('/', (req, res) => {
  res.render('home');
});

app.use(express.static('public'));

app.use('/dashboard', authmiddleware.requirelogin, dashRoutes);

app.use('/userprofile', authmiddleware.requirelogin, infouserRoutes);

app.use('/auth', authRoutes);

app.use('/logout', authmiddleware.requirelogin, logout_router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
