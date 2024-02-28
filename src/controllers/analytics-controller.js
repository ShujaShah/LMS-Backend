const generateLastTwelveMonthsData = require('../utils/AnalyticsGenerator');
const { User } = require('../models/entities/user-entity');

const getUserAnalytics = async (req, res, next) => {
  console.log('here in the controller');
  try {
    const users = await generateLastTwelveMonthsData(User);
    res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = getUserAnalytics;
