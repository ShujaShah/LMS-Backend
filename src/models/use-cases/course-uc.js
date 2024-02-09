const { Redis } = require('ioredis');
const Course = require('../entities/course-entity');
const redisClient = require('../../utils/redis');

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
  try {
    const isCached = redisClient.get('allCourses');
    if (isCached) {
      const courses = JSON.parse(isCached);
      res.status(200).json({
        success: true,
        courses,
      });
    } else {
      const courses = await Course.find().select(
        '-courseData.videoUrl -courseData.questions -courseData.links'
      );
      await redisClient.set('allCourses', JSON.stringify(courses));
      if (!courses) return res.status(400).send('no courses in DB');
      const count = await Course.countDocuments();
      res.status(201).json({
        success: true,
        count: count,
        data: courses,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//Get Single Course
const getOneCourse = async (courseId, res) => {
  const isCached = await redisClient.get(courseId);
  if (isCached) {
    const course = JSON.parse(isCached);
    res.status(200).json({
      success: true,
      course,
    });
  } else {
    const course = await Course.findById(courseId).select(
      '-courseData.videoUrl -courseData.questions -courseData.links'
    );
    await redisClient.set(courseId, JSON.stringify(course));
    if (!course)
      return res.status(400).send('course with this id does not exist');
    res.status(201).json({
      success: true,
      data: course,
    });
  }
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
