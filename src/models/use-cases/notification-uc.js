const Notification = require('../entities/notifications-entity');

const GetAllNotifications = async (req, res, next) => {
  const notifications = await Notification.find();
  if (!notifications) return res.status(400).send('No notifications found');
  const notificationCount = await Notification.countDocuments();
  res.status(201).json({
    success: true,
    notificationCount,
    notifications,
  });
};

module.exports = GetAllNotifications;
