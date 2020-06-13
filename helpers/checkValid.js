const { check } = require('express-validator');

exports.validSign = [
  check('name', 'Name is required')
    .notEmpty()
    .isLength({
      min: 2,
      max: 52,
    })
    .withMessage('name must be between 2 to 52 characters'),
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password', 'password is required').notEmpty(),
  check('password')
    .isLength({
      min: 8,
    })
    .withMessage('Password must contain at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number (0-9)')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter (a-z)'),
];

exports.validLogin = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password', 'password is required').notEmpty(),
  check('password')
    .isLength({
      min: 8,
    })
    .withMessage('Password must contain at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number (0-9)')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter (a-z)'),
];

// exports.forgotPasswordValidator = [
//   check('email')
//     .not()
//     .isEmpty()
//     .isEmail()
//     .withMessage('Must be a valid email address'),
// ];

// exports.resetPasswordValidator = [
//   check('newPassword')
//     .not()
//     .isEmpty()
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least  6 characters long'),
// ];
