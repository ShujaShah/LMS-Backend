const ejs = require('ejs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User, validateUser } = require('../models/entities/user-entity');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const sendMail = require('../utils/send-mail');

// Function to create a user
//(This function is responsible for sending email to user for the activation of account )
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

  //send email
  const data = { user: { name: user.name }, activationCode };
  const html = ejs.renderFile(
    path.join(__dirname, '../mails/activation-email.ejs'),
    data
  );
  console.log('here is the ejs');
  try {
    await sendMail({
      email: user.email,
      subject: 'Activate your account',
      template: 'activation-email.ejs',
      data,
    });
    res.status(201).json({
      success: true,
      activationCode: activationCode,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'Failed to send activation email',
    });
  }
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

//Function to Verify the users Two Factor Authentication
//After successfully giving the code and token, user gets saved into the DataBase
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
