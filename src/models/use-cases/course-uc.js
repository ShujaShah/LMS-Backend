const Course = require('../entities/course-entity');

//Create Course
const createCourse = async (data, res) => {
  const course = await Course.create(data);
  res.status(201).json({
    success: true,
    course,
  });
};

//Update Course
const updateCourse = async (courseId, data, res) => {
  const editCourse = await Course.findByIdAndUpdate(
    courseId,
    { $set: data },
    { new: true }
  );
  res.status(201).json({
    success: true,
    editCourse,
  });
};

//Get All Courses
const getCourses = async (res) => {
  const courses = await Course.find();
  console.log(courses);
  if (!courses) return res.status(400).send('no courses in DB');
  res.status(201).json({
    success: true,
    data: courses,
  });
};

module.exports = { createCourse, updateCourse, getCourses };
