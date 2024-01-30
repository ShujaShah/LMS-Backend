const { User, validateUser } = require('../models/entities/user-entity');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');

const createUser = catchAsync(async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send('Invalid user data');
  }

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).send('User already exists');
  }

  user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    role: req.body.role,
  });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const auth_token = user.generateAuthToken();
  const refresh_token = user.generateRefreshToken();

  const auth_cookie_options = {
    expires: new Date(Date.now() + 86400000),
    httpOnly: true,
    sameSite: 'None',
  };

  const refresh_cookie_options = {
    expires: new Date(Date.now() + 365 * 86400000),
    httpOnly: true,
    sameSite: 'None',
  };

  res.cookie('auth_token', auth_token, auth_cookie_options);
  res.cookie('refresh_token', refresh_token, refresh_cookie_options);

  //user = await user.save();
  const { activationCode, token } = createActivationToken(user);
  res.status(201).json({
    user: user,
    code: activationCode,
    token: token,
  });
});

//Create 2FA and activation token
const createActivationToken = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a random four-digit code

  // Create a JSON Web Token, token contains the payload with two properties: user and 4 digit activation code
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.JWTPrivateKey,
    {
      expiresIn: '10m',
    }
  );
  return { token, activationCode };
};

//Verify 2FA

const VerifyTwoFa = catchAsync(async (req, res, next) => {
  const { activation_token, activationCode } = req.body;
  const newUser = jwt.verify(activation_token, process.env.JWTPrivateKey);

  if (newUser.activationCode !== activationCode) {
    return res.status(400).send('Invalid code');
  }

  const { email, name, password } = newUser.user;

  //check if the email already exists
  let existing_user = await User.findOne({ email });
  if (existing_user)
    return res.status(500).send('User with that email already exists');

  let new_user = await User.create({
    email,
    name,
    password,
  });

  res.status(201).json({
    success: true,
    data: new_user,
  });
});

module.exports = { createUser, VerifyTwoFa };
