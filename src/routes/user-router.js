const express = require('express');
const catchAsync = require('../utilities/catchAsync');

const { createUser, VerifyTwoFa } = require('./../controllers/user-controller');

const userRouter = express.Router();

userRouter.get(
  '/test',
  catchAsync(async (req, res, next) => {
    res.status(201).send('hello');
  })
);

userRouter.post('/', createUser);

userRouter.post('/verify-code', VerifyTwoFa);

module.exports = userRouter;
