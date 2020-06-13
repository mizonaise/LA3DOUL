const express = require('express');

const router = express.Router();

const { validSign } = require('../helpers/checkValid');
const { registerController } = require('./usersController');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', validSign, registerController);

module.exports = router;
