const express = require('express');

const logout = require('../controller/logout.controller');

const router = express.Router();

router.get('/', logout.get);

module.exports = router;