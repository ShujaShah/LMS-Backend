const Notification = require('../entities/notifications-entity');

const GetAllNotifications = async (req, res, next) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  if (!notifications) return res.status(400).send('No notifications found');
  const notificationCount = await Notification.countDocuments();
  res.status(201).json({
    success: true,
    notificationCount,
    notifications,
  });
};

const UpdateNotificationStatus = async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification)
    return res.status(400).send('Notification with the given id not found');
  notification.status = 'read';

  await notification.save();
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    notification,
  });
};

const DeleteNotification = async (thirtyDaysAgo, req, res, next) => {
  const notification = await Notification.deleteMany({
    status: 'read',
    createAt: { $lt: thirtyDaysAgo },
  });
  console.log('Deleted the read notification');
};

module.exports = {
  GetAllNotifications,
  UpdateNotificationStatus,
  DeleteNotification,
};
