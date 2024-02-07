const express = require('express');
const { uploadCourse } = require('../controllers/course-controller');
const isAuthenticated = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');
const courseRouter = express.Router();

courseRouter.post('/create-course', isAuthenticated, uploadCourse);

module.exports = courseRouter;
