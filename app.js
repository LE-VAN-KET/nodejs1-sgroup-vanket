require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var dashRoutes = require('./routes/dash.route');
var cookieParser = require('cookie-parser');
var authRoutes = require('./routes/auth.route');
var authmiddleware = require('./middleware/auth.middleware');
var infouserRoutes = require('./routes/profile.route');
var logger = require('morgan');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSTION_SECRET));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

app.use(express.static('public'));

app.use('/dashboard', authmiddleware.requirelogin, dashRoutes);

app.use('/userprofile', authmiddleware.requirelogin, infouserRoutes);

app.use('/auth', authRoutes);

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
