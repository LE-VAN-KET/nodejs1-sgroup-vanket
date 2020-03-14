require('dotenv').config();
module.exports.get = (req, res) => {
    delete req.session.userId;
    req.session.destroy(async function(err) {
        if (err) {
            return res.redirect('/dashboard');
        }
        await res.clearCookie(process.env.SESS_NAME);
        res.redirect('/auth/login');
    });
}
