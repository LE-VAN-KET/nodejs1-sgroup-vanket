const notAuth = (req, res, next) => {
    if (!req.session.userEmail) {
      return res.redirect('/auth/login');
    }
    next();
};

const userAuth = (req, res, next) => {
    if (typeof req.session.userEmail !== 'undefined') {
      return res.redirect('/products');
    }
    next();
};

const adminAuth = (req, res, next) => {
    if (req.session.role !== 'admin') {
        return res.redirect('/auth/login');
    }
    next();
};

module.exports = {
  notAuth,
  userAuth,
  adminAuth,
};
