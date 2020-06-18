const express = require('express');

const User = require('../models/User');
const auth = require('../middleware/auth');
const { validLogin } = require('../helpers/checkValid');
const { loginController } = require('./authController');

const router = express.Router();

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/auth', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/login
// @desc     Authenticate user & get token
// @access   Public
router.post('/login', validLogin, loginController);

module.exports = router;
