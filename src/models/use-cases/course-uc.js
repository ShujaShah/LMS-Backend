const Course = require('../entities/course-entity');

//Create Course
const createCourse = async (data, res) => {
  console.log(data);
  const course = await Course.create(data);
  res.status(201).json({
    success: true,
    course,
  });
};

module.exports = createCourse;
