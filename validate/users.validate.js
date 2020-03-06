module.exports.postlogin = (req, res, next) => {
    var errors = [];

    if (!req.body.email) {
        errors.push("Email is require.");
    }

    if (!req.body.password) {
        errors.push("Password is require.");
    }

    if (errors.length) {
        res.render('auth/login', {
            errors: errors,
            values: req.body
        });
        return;
    }
    next();
}