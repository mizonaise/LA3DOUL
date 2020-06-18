const express = require('express');

const router = express.Router();

const { validRegister, validVerifyEmail } = require('../helpers/checkValid');
const { registerController, verifyEmailController } = require('./usersController');

// @route    POST api/register
// @desc     Register user
// @access   Public
router.post('/register', validRegister, registerController);
router.post('/verify_email', validVerifyEmail, verifyEmailController);

module.exports = router;
