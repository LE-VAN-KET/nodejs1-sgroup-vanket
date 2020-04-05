const { check } = require('express-validator');
/**
 * check value input form register
 * @return { errors }
 */
const validateRegister = () => [
    check('name', 'username more than 3 degits').isLength({ min: 3 }),
    check('password', 'password more than 6 degits').isLength({ min: 6 }),
    check('email', 'email is invalid').isEmail(),
    check('password', 'password must be Alphanumeric').isAlphanumeric(),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        } else {
            return true;
        }
    }),
  ];

/**
 * check value input form login
 * @return { errors }
 */
const validateLogin = () => [
    check('email', 'Invalid email').isEmail(),
    check('password', 'password more than 6 degits').isLength({ min: 6 }),
  ];

module.exports = {
    validateRegister,
    validateLogin,
};
