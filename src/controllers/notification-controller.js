const GetAllNotifications = require('../models/use-cases/notification-uc');

const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await GetAllNotifications(req, res);
  } catch (error) {
    return next(console.log(error));
  }
};

module.exports = getAllNotifications;
