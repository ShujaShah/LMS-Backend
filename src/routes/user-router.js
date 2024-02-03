const express = require('express');
const catchAsync = require('../utils/catchAsync');

const {
  createUser,
  VerifyTwoFa,
  Login,
  LoggedInUser,
  LogOut,
} = require('./../controllers/user-controller');
const isAuthenticated = require('../middlewares/auth');

const userRouter = express.Router();

userRouter.get(
  '/test',
  catchAsync(async (req, res, next) => {
    res.status(201).send('hello');
  })
);

userRouter.post('/', createUser);

userRouter.post('/verify-code', VerifyTwoFa);

userRouter.post('/login', Login);

userRouter.get('/me', isAuthenticated, LoggedInUser);

userRouter.post('/logout', isAuthenticated, LogOut);

module.exports = userRouter;
