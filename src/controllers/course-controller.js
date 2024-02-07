const cloudinary = require('cloudinary');
const createCourse = require('../services/course-service');
require('dotenv').config();

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
    createCourse(data, res, next);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { uploadCourse };
