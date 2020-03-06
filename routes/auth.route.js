var express = require('express');
var controller = require('../controller/auth.controller');
var validate = require('../validate/users.validate');

var router = express.Router();

router.get('/login', controller.getlogin);

router.post('/login', validate.postlogin, controller.postLogin);

module.exports = router;