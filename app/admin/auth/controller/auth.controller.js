
require('dotenv').config();
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const knex = require('../../../../model/knex');

const salt = 10;

// get register
const getRegister = (req, res) => res.render('admin/auth/register', {
        errors: '',
    });

const postRegister = (req, res) => {
    const {
         name, email, address, password,
        } = req.body;
    // Check for Errors
    const errors = validationResult(req);

	if (!errors.isEmpty()) {
        req.flash('error', errors.array());
        return res.redirect('/admin/auth/register');
	}
    // CReating a MOdal for New User
    const newUser = {
        name,
        email,
        address,
        password,
    };
    bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw err;

        newUser.password = await hash; // set hash password

        // Create New User
        await knex('table_users').insert(newUser)
        .catch(() => {
            req.flash('error', 'Email is already in use');
            return res.redirect('/admin/auth/register');
        });

        // Success Message
        req.flash('success', `${name} are now registered and may log in`);

        return res.redirect('/admin/auth/login');
    });
};

const getLogin = (req, res) => res.render('admin/auth/login', {
        errors: '',
    });

// comparePassword
const comparePassword = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

const postLogin = async (req, res) => {
   const { email, password } = req.body;
   const User = await knex('table_users').select().where({ email });
    // Check for Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
		return res.render('admin/auth/login', {
			errors: errors.array(),
			email,
            password,
            message: '',
		});
    } if (User.length === 0) {
        // Not exist Email user
        req.flash('error', 'Email is not exist');
        return res.redirect('/admin/auth/login');
    }
        comparePassword(password, User[0].password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                // Success Message
                // req.flash("success",'You are Logged In');
                req.session.userEmail = email;
                return res.redirect('/admin/dashboard');
            }
                // failed to login
                req.flash('error', 'Wrong password');
                return res.redirect('/admin/auth/login');
        });
};

const getLogout = async (req, res) => {
    delete req.session.userEmail;
    await req.flash('error', 'your account logout successful');
    await req.session.destroy((err) => {
        if (err) {
            return res.redirect('/admin/dashboard');
        }
        res.clearCookie(process.env.SESS_NAME);
       return res.redirect('/admin/auth/login');
    });
};

const getDash = (req, res) => res.render('admin/home/dashboard');

module.exports = {
    getRegister,
    getLogin,
    getLogout,
    postRegister,
    postLogin,
    getDash,
};