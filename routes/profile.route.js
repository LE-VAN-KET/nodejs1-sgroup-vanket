var express = require('express');

var controller = require('../controller/dash.controller');

var router = express.Router();

router.get('/', controller.profile);

module.exports = router;