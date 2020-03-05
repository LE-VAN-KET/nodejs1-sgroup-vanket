require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var dashRoutes = require('./routes/dash.route');
var cookieParser = require('cookie-parser');
var authRoutes = require('./routes/auth.route');
var authmiddleware = require('./middleware/auth.middleware');

var port = 8000;
var app = express();

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

app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log('listening on port'+ port);
});