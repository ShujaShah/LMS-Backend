const Course = require('../models/entities/course-entity');

//Create Course
const createCourse = async (req, res, next, data) => {
  const course = await Course.create(data);
  res.status(201).json({
    success: true,
    course,
  });
};

module.exports = createCourse;
