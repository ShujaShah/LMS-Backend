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
  if (!courses) return res.status(400).send('no courses in DB');
  res.status(201).json({
    success: true,
    data: courses,
  });
};

//Get Single Course
const getOneCourse = async (courseId, res) => {
  const course = await Course.findById(courseId);
  if (!course)
    return res.status(400).send('course with this id does not exist');
  res.status(201).json({
    success: true,
    data: course,
  });
};

const removeCourse = async (courseId, res) => {
  const course = await Course.findByIdAndDelete(courseId);
  if (!course)
    return res.status(400).send('course with the given id not found');
  res.status(201).json({
    success: true,
    message: 'Successfully deleted',
  });
};

module.exports = {
  createCourse,
  updateCourse,
  getCourses,
  getOneCourse,
  removeCourse,
};
