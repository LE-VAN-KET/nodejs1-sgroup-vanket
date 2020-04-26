
const notAuth = (req, res, next) => {
    if (!req.session.userEmail || req.session.role === 'user') {
      return res.redirect('/auth/login');
    }
    next();
};

const userAuth = (req, res, next) => {
    if (typeof req.session.userEmail !== 'undefined' && req.session.role === 'admin') {
      return res.redirect('/admin/dashboard');
    }
    next();
};

module.exports = {
  notAuth,
  userAuth,
};
