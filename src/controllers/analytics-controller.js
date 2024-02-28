const generateLastTwelveMonthsData = require('../utils/AnalyticsGenerator');
const { User } = require('../models/entities/user-entity');

const getUserAnalytics = async (req, res, next) => {
  try {
    const users = await generateLastTwelveMonthsData(User);

    if (!users) return res.status(400).send('no users');
    res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = getUserAnalytics;
