const express = require('express');
const {
  uploadCourse,
  editCourse,
} = require('../controllers/course-controller');
const isAuthenticated = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');
const courseRouter = express.Router();

courseRouter.post('/create-course', isAuthenticated, uploadCourse);
courseRouter.patch('/edit-course/:id', isAuthenticated, editCourse);

module.exports = courseRouter;
