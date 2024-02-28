const express = require('express');
const analyticsRouter = express.Router();
const getUserAnalytics = require('../controllers/analytics-controller');
const isAuthenticated = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');

analyticsRouter.get('/user-analytics', getUserAnalytics);

module.exports = analyticsRouter;
