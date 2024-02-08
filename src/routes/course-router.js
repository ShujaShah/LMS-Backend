const express = require('express');
const {
  uploadCourse,
  editCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
} = require('../controllers/course-controller');
const isAuthenticated = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');
const courseRouter = express.Router();

courseRouter.post('/create-course', isAuthenticated, isAdmin, uploadCourse);
courseRouter.patch('/edit-course/:id', isAuthenticated, isAdmin, editCourse);
courseRouter.get('/', getAllCourses);
courseRouter.get('/:id', getSingleCourse);
courseRouter.delete('/:id', isAuthenticated, isAdmin, deleteCourse);

module.exports = courseRouter;
