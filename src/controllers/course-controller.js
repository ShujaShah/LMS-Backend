const cloudinary = require('cloudinary');
const {
  createCourse,
  updateCourse,
  getCourses,
} = require('../models/use-cases/course-uc');

//Create Course
const uploadCourse = async (req, res, next) => {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: 'courses',
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    await createCourse(data, res, next);
    // const course = await Course.create(data);
    // res.status(201).json({
    //   success: true,
    //   course,
    // });
  } catch (error) {
    console.log(error);
  }
};

//Edit Course
const editCourse = async (req, res, next) => {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      await cloudinary.v2.uploader.destroy(thumbnail.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: 'courses',
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const courseId = req.params.id;
    if (!courseId)
      return res.status(404).send('Course with the given id does not exist');
    await updateCourse(courseId, data, res);
  } catch (error) {
    console.log(error);
  }
};

const getAllCourses = async (req, res, next) => {
  try {
    await getCourses(res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { uploadCourse, editCourse, getAllCourses };
