const express = require('express');
const userRouter = require('./user-router');

const router = express.Router();

router.use('/user', userRouter);

router.get('/', (req, res) => {
  console.log('here ia ma');
  res.status(201).send('it works');
});

module.exports = router;
