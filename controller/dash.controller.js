
const knex = require('../db/knex');

module.exports.getdash = (req, res) => {
    res.render('dashboard');
};

module.exports.profile = async (req, res) => {
    const users = await knex("users"); // making a query to get all users
    const user = users.find(result => result.id = req.session.userId);
    res.render('userprofile', {
        user: user
    });
}