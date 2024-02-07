const cloudinary = require('cloudinary');
const createCourse = require('../models/use-cases/course-uc');

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

module.exports = { uploadCourse };
