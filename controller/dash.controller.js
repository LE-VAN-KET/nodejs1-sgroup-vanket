
var db = require('../db');

module.exports.getdash = (req, res) => {
    res.render('dashboard');
};

module.exports.profile = (req, res) => {
    var user = db.get('users').find({ id: req.signedCookies.userId }).value();
    res.render('userprofile', {
        user: user
    });
};