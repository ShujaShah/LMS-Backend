const cloudinary = require('cloudinary');
const {
  createCourse,
  updateCourse,
  getCourses,
  getOneCourse,
  removeCourse,
} = require('../models/use-cases/course-uc');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

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
  } catch (error) {
    return next(new AppError(`${error}`, 400));
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
    return next(new AppError(`${error}`, 400));
  }
};

const getAllCourses = catchAsync(async (req, res, next) => {
  try {
    await getCourses(res);
  } catch (error) {
    return next(new AppError(`${error}`, 400));
    //console.log(error);
  }
});

const getSingleCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    await getOneCourse(courseId, res);
  } catch (error) {
    return next(new AppError(`${error}`, 400));
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    await removeCourse(courseId, res);
  } catch (error) {
    return next(new AppError(`${error}`, 400));
  }
};

module.exports = {
  uploadCourse,
  editCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
};