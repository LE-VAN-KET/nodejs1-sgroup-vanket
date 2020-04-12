require('dotenv').config();
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const knex = require('../../../../model/knex');

const salt = 10;


const getTable = async (req, res) => {
    const users = await knex('table_users').select();
    return res.render('admin/users/allUser', {
        users,
        errors: '',
    });
};

const updateUser = async (req, res) => {
    const { password, address } = req.body;
    await bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;

        knex('table_users')
        .update({
            password: hash,
            address,
        })
        .where({ id: req.params.id })
        .then((rows) => {
            if (!rows) {
                // error find user
                req.flash('error', 'update failed error');
                return res.redirect('/admin/table');
            }

            // Success update user
            req.flash('success', 'update user success');
            return res.redirect('/admin/table');
        })
        .catch((e) => res.status(500).json(e));
    });
};

const deleteUser = async (req, res) => {
    await knex('table_users').where({ id: req.params.id }).delete();

    // success delete user
    req.flash('success', 'delete user successfully');
    return res.redirect('/admin/table');
};

const postAddUser = async (req, res) => {
    const users = await knex('table_users').select();
    const {
        name, email, address, password,
    } = req.body;
    // Check for Errors
    const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.render('admin/users/allUser', {
			errors: errors.array(),
			users,
		});
	}
    // CReating a MOdal for New User
    const newUser = {
        name,
        email,
        address,
        password,
    };

    bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        // Create New User
        knex('table_users').insert(newUser).then((error) => {
            if (error) throw error;
        });

        // Success create add user
        req.flash('success', `Add user ${name} success`);
        return res.redirect('/admin/table');
    });
};

const searchUser = async (req, res) => {
    const user = await knex('table_users').select();
    const { q } = req.query;
    const matchedUsers = user.filter((data) => data.name
        .toLowerCase().indexOf(q.toLowerCase()) !== -1);

    return res.render('admin/users/allUser', {
        users: matchedUsers,
        errors: '',
    });
};

const profile = async (req, res) => {
    const users = await knex('table_users').select().where({ email: req.session.userEmail });
    const user = users[0];
    return res.render('admin/users/userprofile', {
        user,
    });
};

const viewUser = async (req, res) => {
    const users = await knex('table_users').select().where({ id: req.params.id });
    const user = users[0];
    return res.render('admin/users/viewUser', {
        user,
    });
};

module.exports = {
    getTable,
    updateUser,
    deleteUser,
    postAddUser,
    profile,
    viewUser,
    searchUser,
};
