module.exports.createpost = (req, res, next) => {
    var errors = [];

    if (!req.body.name) {
        errors.push("Name is require.");
    }

    if (!req.body.phone) {
        errors.push("Phone is require.");
    }

    if (!req.body.email) {
        errors.push("Email is require.");
    }

    if (errors.length) {
        res.render('users/create', {
            errors: errors,
            values: req.body
        });
        return;
    }
    next();
}