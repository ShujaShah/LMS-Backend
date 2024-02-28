const express = require('express');
const userRouter = require('./user-router');
const courseRouter = require('./course-router');
const orderRouter = require('./order-router');
const notificationRouter = require('./notification-router');
const analyticsRouter = require('./analytics-router');

const router = express.Router();

router.use('/user', userRouter);
router.use('/course', courseRouter);
router.use('/order', orderRouter);
router.use('/notifications', notificationRouter);
router.use('/analytics', analyticsRouter);

module.exports = router;
