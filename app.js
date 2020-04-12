require('dotenv').config();
const cors = require('cors');

const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const moment = require('moment');

const adminRoute = require('./routes/adminRoute');
const clientProductRoute = require('./routes/clientProductRoute');
const { sessionModules } = require('./config/session');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSTION_SECRET));

app.use(methodOverride('_method'));

// Setting up sessions
app.set('trust proxy', 1);
app.use(sessionModules);

app.use(flash());
app.use((req, res, next) => {
  // res.locals.messages = req.flash();
  res.locals = {
    messages: req.flash(),
    moment,
  };
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res, next) => {
  // local variable to hold user info
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res) => res.redirect('/admin/auth/login'));

app.use('/admin', adminRoute);

app.use('/products', express.static(path.join(__dirname, 'public')), clientProductRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
