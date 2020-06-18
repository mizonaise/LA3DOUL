const express = require('express');

const router = express.Router();

const {
  validRegister,
  validVerifyEmail,
  validResetPassword,
  validForgetPassword,
} = require('../helpers/checkValid');

const {
  registerController,
  verifyEmailController,
  resetPasswordController,
  forgetPasswordController,
} = require('./usersController');

// @access   Public
router.post('/register', validRegister, registerController);
router.post('/verify_email', validVerifyEmail, verifyEmailController);
router.post(
  '/forget_password',
  validForgetPassword,
  forgetPasswordController
);
router.post(
  '/reset_password',
  validResetPassword,
  resetPasswordController
);

module.exports = router;
