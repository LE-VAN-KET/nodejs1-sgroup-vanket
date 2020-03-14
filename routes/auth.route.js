const express = require('express');
const controller = require('../controller/auth.controller');

const router = express.Router();

router.get('/register', controller.get_register);

router.post('/register',controller.post_register);

router.get('/login', controller.getlogin);

router.post('/login',controller.postLogin);

module.exports = router;