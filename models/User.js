const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const utils = require('../utils');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: 'profile_default_image.png',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  token_reset_password: {
    type: String,
  },
  token_confirm_account: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', function (next) {
  if (
    this.password !== undefined &&
    (this.isModified('password') || this.isNew)
  ) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.statics.register = (name, email, password) => {

  const User = mongoose.model('user', UserSchema);
  // check if email already exists
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        // a field already exists
        const rslt = {
          success: false,
          message: '',
        };
        if (user.email === email) rslt.message = 'Email already exists. ';
        return rslt;
      } else {
        // register user
        return new User({
          name: name,
          email: email,
          password: password,
          isVerified: false,
          token_confirm_account: utils.uniqid(),
        })
          .save()
          .then((user) => {
            // send verification email
            utils.sendConfirmationEmail(
              user.name,
              user.email,
              user.token_confirm_account
            );
            // return rslt
            return {
              success: true,
              message: 'User inserted successfully',
            };
          })
          .catch((err) => {
            throw new Error(`### Exception in User.methods.register : ${err}`);
          });
      }
    })
    .then((result) => {
      return Promise.resolve(result);
    })
    .catch((err) => {
      return Promise.reject(
        new Error(`### Exception in User.methods.register : ${err}`)
      );
    });
};

module.exports = mongoose.model('user', UserSchema);
