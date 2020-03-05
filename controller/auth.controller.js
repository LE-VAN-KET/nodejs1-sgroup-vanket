var db = require('../db');
var md5 = require('md5-nodejs');

module.exports.getlogin = (req, res) => {
    res.render('auth/login');
};

module.exports.postLogin = (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    var user = db.get('users').find({ email: email}).value();
    
    if (!user) {
        res.render('auth/login', {
            errors: [
                'User does not exist'
            ],
            values: req.body
        });
        return;
    }

    var hashpassword = md5(password);

    if (user.password !== hashpassword) {
        res.render('auth/login', {
            errors: [
                'Wrong password'
            ],
            values: req.body
        })
    }

    res.cookie('userId', user.id, {
        signed: true
    });
    res.redirect('/dashboard');
}