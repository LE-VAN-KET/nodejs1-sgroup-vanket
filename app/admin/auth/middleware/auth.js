
const notAuth = (req, res, next) => {
    if (!req.session.userEmail) {
      return res.redirect('/admin/auth/login');
    }
    next();
};

const userAuth = (req, res, next) => {
    if (typeof req.session.userEmail !== 'undefined') {
      return res.redirect('/admin/dashboard');
    }
    next();
};

module.exports = {
  notAuth,
  userAuth,
};
