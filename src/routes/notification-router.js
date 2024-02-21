const express = require('express');
const isAuthenticated = require('../middlewares/auth');
const getAllNotifications = require('../controllers/notification-controller');

const notificationRouter = express.Router();

notificationRouter.get('/', isAuthenticated, getAllNotifications);

module.exports = notificationRouter;
