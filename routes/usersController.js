const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const nodemailer = require('nodemailer');
const normalize = require('normalize-url');
const { validationResult } = require('express-validator');

const utils = require('../utils');
const User = require('../models/User');

// exports.registerController = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name, email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
//     }

//     user = new User({
//       name,
//       email,
//       password,
//     });

//     const salt = await bcrypt.genSalt(10);

//     user.password = await bcrypt.hash(password, salt);

//     const token = jwt.sign(
//       {
//         name,
//         email,
//         password,
//       },
//       config.get('jwtActivation'),
//       { expiresIn: '5m' }
//     );

//     const emailData = {
//       from: config.get('user'),
//       to: email,
//       subject: 'Account activation link',
//       html: `
//                 <h1>Please use the following to activate your account</h1>
//                 <p>${config.get('client')}/users/activate/${token}</p>
//                 <hr />
//                 <p>This email may containe sensetive information</p>
//                 <p>${config.get('client')}</p>
//             `,
//     };

//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: config.get('user'),
//         pass: config.get('pass'),
//       },
//     });

//     transporter.sendMail(emailData, function (err) {
//       if (err) throw err;
//       else
//         return res.json({
//           message: `Email has been sent to ${email}`,
//         });
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// exports.activationController = async (req, res) => {
//   const { token } = req.body;

//   if (token) {
//     jwt.verify(token, config.get('jwtActivation'), async (err) => {
//       if (err) {
//         console.error(err.message);
//         return res.status(401).json({
//           errors: 'Expired link. Signup again',
//         });
//       } else {
//         try {
//           const { name, email, password } = jwt.decode(token);

//           const avatar = normalize(
//             gravatar.url(email, {
//               s: '200',
//               r: 'pg',
//               d: 'mm',
//             }),
//             { forceHttps: true }
//           );

//           user = new User({
//             name,
//             email,
//             avatar,
//             password,
//           });

//           await user.save();

//           const payload = {
//             user: {
//               id: user.id,
//             },
//           };

//           jwt.sign(
//             payload,
//             config.get('jwtSecret'),
//             { expiresIn: '5 days' },
//             (err, token) => {
//               if (err) throw err;
//               res.json({ token });
//             }
//           );
//         } catch (err) {
//           console.error(err.message);
//           res.status(500).send('Server error');
//         }
//       }
//     });
//   } else {
//     return res
//       .status(400)
//       .json({ errors: [{ msg: 'error happening please try again' }] });
//   }
// };

// exports.registerController = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name, email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
//     }

//     const avatar = normalize(
//       gravatar.url(email, {
//         s: '200',
//         r: 'pg',
//         d: 'mm',
//       }),
//       { forceHttps: true }
//     );

//     user = new User({
//       name,
//       email,
//       avatar,
//       password,
//     });

//     const salt = await bcrypt.genSalt(10);

//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     const payload = {
//       user: {
//         id: user.id,
//       },
//     };

//     jwt.sign(
//       payload,
//       config.get('jwtSecret'),
//       { expiresIn: '5 days' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

exports.registerController = (req, res) => {
  // check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  User.register(name, email, password, 'local')
    .then((rslt) => {
      if (rslt.success) {
        // util.sendConfirmationEmail(email, rslt.username, rslt.email_token);
        return res.status(200).json({
          message: 'register_success_email_sent',
        });
      }
      return res.status(400).json({ message: rslt.message });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json({
        message: `Error Occured in User.controller.register: ${err}`,
      });
    });
};

exports.verifyEmailController = (req, res) => {
  // check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email_token, email } = req.body;

  User.findOne({ token_confirm_account: email_token })
    .then((user) => {
      if (user) {
        // email_token exists
        if (user.email === email) {
          // all infos are ok
          // verify user account
          user.isVerified = true;
          // delete token_confirm_account field
          user.token_confirm_account = undefined;
          return user
            .save()
            .then((user) =>
              res.status(200).json({
                success: true,
                message: 'Account Verified Successfully',
              })
            )
            .catch((err) =>
              res.status(400).json({
                errors: [{ msg: err.message }],
              })
            );
        } else {
          // email does not belong to this email_token
          return res
            .status(400)
            .json({ errors: [{ msg: 'Bad email or email_token' }] });
        }
      } else {
        // email_token does not exists
        return res
          .status(400)
          .json({ errors: [{ msg: 'Bad email or email_token' }] });
      }
    })
    .catch((err) => res.status(400).json({ errors: [{ msg: err.message }] }));
};

/**
 * send email contains link to reset password
 */
exports.forgetPasswordController = async (req, res) => {
  // check validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      // check if email eists in DB
      if (!user)
        return {
          success: false,
          message: 'Email does not belong to any user',
        };
      // if (user.strategy !== "local")
      //   return {
      //     success: false,
      //     message:
      //       "This account does not have a password you can connect using Google or 42 Intranet account"
      //   };
      // email exists
      // generate email_token and send reset_password email
      user.token_reset_password = utils.uniqid();
      return user.save();
    })
    .then((result) => {
      if (
        result &&
        typeof result.success !== 'undefined' &&
        result.success === false
      ) {
        return result;
      }

      const user = result;
      console.log(user.name);
      utils.sendResetPasswordEmail(
        user.name,
        user.email,
        user.token_reset_password
      );
      return {
        success: true,
        message: 'Reset Password Email is sent',
      };
    })
    .then((result) => {
      return res
        .status(result.success ? 200 : 400)
        .json({ message: result.message });
    })
    .catch((err) => {
      return res.status(400).json({ errors: [{ msg: err.message }] });
    });
};

/**
 * Reset Password using email_token
 */
exports.resetPasswordController = (req, res) => {
  // check validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, email_token } = req.body;
  User.findOne({
    email: email,
    token_reset_password: email_token,
    // strategy: 'local',
  })
    .then((user) => {
      if (!user)
        return {
          success: false,
          message: 'Bad email or email_token',
        };
      user.password = password;
      user.token_reset_password = undefined;
      return user.save();
    })
    .then((result) => {
      if (
        result &&
        typeof result.success !== 'undefined' &&
        result.success === false
      ) {
        return result;
      }

      return {
        success: true,
        message: 'Password updated successfully',
      };
    })
    .then((result) => {
      return res
        .status(result.success ? 200 : 400)
        .json({ message: result.message });
    })
    .catch((err) => {
      return res.status(400).json({
        errors: [
          {
            msg: err.message,
          },
        ],
      });
    });
};
