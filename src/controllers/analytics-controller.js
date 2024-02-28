const generateLastTwelveMonthsData = require('../utils/AnalyticsGenerator');
const { User } = require('../models/entities/user');

const getUserAnalytics = catchAsync(async (req, res, next) => {
  try {
    const users = await generateLastTwelveMonthsData(User);
    res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(console.log(error));
  }
});

module.exports = getUserAnalytics;
