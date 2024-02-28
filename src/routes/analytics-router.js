const express = require('express');
const isAuthenticated = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');
const {
  getUserAnalytics,
  getCourseAnalytics,
  getOrderAnalytics,
} = require('../controllers/analytics-controller');
const analyticsRouter = express.Router();

//TODO: isAdmin middleware is having some issues
analyticsRouter.get('/user-analytics', isAuthenticated, getUserAnalytics);
analyticsRouter.get('/course-analytics', isAuthenticated, getCourseAnalytics);
analyticsRouter.get('/order-analytics', isAuthenticated, getOrderAnalytics);

module.exports = analyticsRouter;
