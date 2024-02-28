const generateLastTwelveMonthsData = require('../utils/AnalyticsGenerator');
const { User } = require('../models/entities/user-entity');
const Course = require('../models/entities/course-entity');
const Order = require('../models/entities/order-entity');

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

const getCourseAnalytics = async (req, res, next) => {
  try {
    const courses = await generateLastTwelveMonthsData(Course);

    if (!courses) return res.status(400).send('no courses');
    res.status(201).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrderAnalytics = async (req, res, next) => {
  try {
    const orders = await generateLastTwelveMonthsData(Order);

    if (!orders) return res.status(400).send('no orders');
    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getUserAnalytics, getCourseAnalytics, getOrderAnalytics };
