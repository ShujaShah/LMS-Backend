const express = require('express');
const catchAsync = require('../utilities/catchAsync');

const userRouter = express.Router();

userRouter.get(
  '/test',
  catchAsync(async (req, res, next) => {
    res.status(201).send('hello');
  })
);

module.exports = userRouter;
