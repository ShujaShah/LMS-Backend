const express = require('express');
const isAuthenticated = require('../middlewares/auth');
const {
  getAllNotifications,
  updateNotificationStatus,
} = require('../controllers/notification-controller');

const notificationRouter = express.Router();

notificationRouter.get('/', isAuthenticated, getAllNotifications);
notificationRouter.put('/:id', isAuthenticated, updateNotificationStatus);

module.exports = notificationRouter;
