const { User, validateUser } = require('../models/entities/user-entity');
const bcrypt = require('bcrypt');
const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');

const createUser = catchAsync(async (req, res, next) => {
  const { error } = validateUser(req.body);
  // if (error) return res.status(500).send(error.details[0].message);
  if (error)
    return next(
      new AppError(error.details[0].message || 'something went wrong', 400)
    );

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return next(new AppError('user already exists', 400));
  }

  user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    role: req.body.role,
  });

  //hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const auth_token = user.generateAuthToken();
  const refresh_token = user.generateRefreshToken();

  user = await user.save();
  res.status(201).json({
    succesfull: 'true',
    user,
    auth_token,
    refresh_token,
  });
});

module.exports = { createUser };
