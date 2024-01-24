const express = require('express');

const userRouter = express.Router();

userRouter.post('/test', (req, res) => {
  res.status(201).send('hello');
});

module.exports = userRouter;
