require('dotenv').config();
const knex = require('../db/knex');
const errors = [];
const bcrypt = require('../custom-bcrypt');

module.exports.getlogin = (req, res) => {
    res.render('auth/login', {
        errors: errors
    });
};

module.exports.postLogin = (req, res) => {

    const emailReq = req.body.email;
    const passwordReq = bcrypt.hash(req.body.password, {salt: process.env.salt, rounds: 20});

    knex.select('email')
    .from("users")
    .where("email", emailReq)
    .andWhere("password", passwordReq)
    .then(async function(result) {
            // const user = getUserData(emailReq);
            const users = await knex("users");
            if (result.length !== 0) {
                //login           
                let user = users.find(result => result.email = emailReq);
                req.session.userId = user.id;
                return res.redirect('/dashboard');
            } else {
                // failed login
                return res.render('auth/login', {
                    errors: [
                        'User or password does not exist'
                    ],
                    values: req.body
                })
            }
        })
    .catch(function(error) {
        console.log(error);
    });

}

module.exports.get_register = (req, res) => {
    res.render('auth/register', {
        errors: errors
    });
};

module.exports.post_register = (req, res) => {

    knex.select("email")
    .from("users")
    .where("email", req.body.email)
    .then(async (emailList) => {
        try {
            const insertUser = await knex('users')
                .insert({
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hash(req.body.password, {salt: process.env.salt, rounds: 20})
                })
                .then(()=>{})
            if (emailList.length === 0) {
                insertUser;
                return  res.redirect('/auth/login');
            }
        }
        catch {
            console.log('not inserting user');

            return res.render('auth/register', {
                errors: [
                    'Email is already in use'
                ],
                values: req.body
            })
        }

});

}


