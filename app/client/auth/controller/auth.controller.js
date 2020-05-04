require('dotenv').config();
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const knex = require('../../../../model/knex');

const salt = 10;

// get register
const getRegister = (req, res) => res.render('client/auth/register', {
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
        return res.redirect('/auth/register');
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
            return res.redirect('/auth/register');
        });

        // Success Message
        req.flash('success', `${name} are now registered and may log in`);

        const roleId = await knex('table_users').select('id').where('email', email).first();

        const roleNew = { role_id: roleId.id, role_name: 'user' };

        await knex('role').insert(roleNew);

        return res.redirect('/auth/login');
    });
};

const getLogin = (req, res) => res.render('client/auth/login', {
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
   const User = await knex('table_users').select('table_users.*', 'role.role_name')
        .innerJoin('role', 'table_users.id', 'role.role_id').where({ email })
        .first();
    // Check for Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
		return res.render('client/auth/login', {
			errors: errors.array(),
			email,
            password,
            message: '',
		});
    } if (User.length === 0) {
        // Not exist Email user
        req.flash('error', 'Email is not exist');
        return res.redirect('/auth/login');
    }
    comparePassword(password, User.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
            // Success Message
            // req.flash("success",'You are Logged In');
            req.session.role = User.role_name;
            req.session.userEmail = email;
            return res.redirect('/home');
        }
        // failed to login
        req.flash('error', 'Wrong password');
        return res.redirect('/auth/login');
    });
};

const getLogout = (req, res) => {
    delete req.session.userEmail;
    req.flash('error', 'your account logout successful');
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie(process.env.SESS_NAME);
       return res.redirect('/auth/login');
    });
};

module.exports = {
    getRegister,
    getLogin,
    getLogout,
    postRegister,
    postLogin,
};
