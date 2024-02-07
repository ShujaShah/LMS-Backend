const express = require('express');
const userRouter = require('./user-router');
const courseRouter = require('./course-router');

const router = express.Router();

router.use('/user', userRouter);
router.use('/course', courseRouter);

module.exports = router;
