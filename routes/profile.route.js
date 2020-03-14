const express = require('express');

const controller = require('../controller/dash.controller');

const router = express.Router();

router.get('/', controller.profile);

module.exports = router;