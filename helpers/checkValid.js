const { check } = require('express-validator');

const validName = (fieldName) =>
  check(fieldName)
    .exists()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 52 })
    .withMessage('name must be between 2 to 52 characters')
    .isAlpha()
    .withMessage('Name must be only alphabetical chars');

const validEmail = (email) =>
  check(email)
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address');

const validPassword = (passwoed) =>
  check(passwoed)
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be String')
    .isLength({ min: 8, max: 52 })
    .withMessage('Password must be between 8 to 52 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number (0-9)')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter (a-z)');

exports.validLogin = [validEmail('email'), validPassword('password')];

exports.validRegister = [
  validName('name'),
  validEmail('email'),
  validPassword('password'),
];

exports.validVerifyEmail = [
  validEmail('email'),
  // email_token
  check('email_token')
    .exists()
    .withMessage('Email token is required')
    .isString()
    .withMessage('Email token must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email token must be at least 1 character'),
];

exports.validForgetPassword = [validEmail('email')];

exports.validResetPassword = [
  // email
  validEmail('email'),
  // email_token
  check('email_token')
    .exists()
    .withMessage('Email token is required')
    .isString()
    .withMessage('Email token must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email token must be at least 1 character'),
  // new password
  validPassword('password'),
  // confirm new password
  // check('confirmNewPwd')
  //   .exists()
  //   .withMessage('Confirm new password is required')
  //   .custom((confirmNewPwd, { req }) => {
  //     if (confirmNewPwd !== req.body.newPwd) {
  //       // trow error if passwords do not match
  //       throw new Error('Passwords mismatch');
  //     } else {
  //       return confirmNewPwd;
  //     }
  //   }),
];
