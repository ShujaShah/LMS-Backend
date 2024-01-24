const express = require('express');

const userRouter = express.Router();

userRouter.get('/test', (req, res) => {
  res.status(201).send('hello');
});

module.exports = userRouter;
