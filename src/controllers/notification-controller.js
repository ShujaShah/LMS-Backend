const {
  GetAllNotifications,
  UpdateNotificationStatus,
  DeleteNotification,
} = require('../models/use-cases/notification-uc');
const cron = require('node-cron');

const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await GetAllNotifications(req, res);
  } catch (error) {
    return next(console.log(error));
  }
};

const updateNotificationStatus = async (req, res, next) => {
  try {
    const notification = await UpdateNotificationStatus(req, res);
  } catch (error) {
    return next(console.log(error));
  }
};

//delete notification with cron

cron.schedule('0 0 0 * * *', async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const notification = await DeleteNotification(thirtyDaysAgo, req, res);
});

module.exports = { getAllNotifications, updateNotificationStatus };
