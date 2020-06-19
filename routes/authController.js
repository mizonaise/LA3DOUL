const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/User');

exports.loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '1 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateController = async (req, res) => {
  //Check errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        user.name = name;
        return user
          .save()
          .then(() =>
            res.status(200).json({
              success: true,
              message: 'Name Update Successfully',
            })
          )
          .catch((err) =>
            res.status(400).json({
              errors: [{ msg: err.message }],
            })
          );
      } else {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }
    })
    .catch((err) => res.status(400).json({ errors: [{ msg: err.message }] }));
};
