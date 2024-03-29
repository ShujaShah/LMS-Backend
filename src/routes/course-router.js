const express = require('express');
const {
  uploadCourse,
  editCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
  getUserPurchasedCourse,
  addQuestionData,
  addAnswerToQuestion,
  addReview,
  addReplyToReview,
} = require('../controllers/course-controller');
const isAuthenticated = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');
const courseRouter = express.Router();

courseRouter.post('/create-course', isAuthenticated, isAdmin, uploadCourse);
courseRouter.patch('/edit-course/:id', isAuthenticated, isAdmin, editCourse);
courseRouter.get('/', getAllCourses);
courseRouter.get('/:id', getSingleCourse);
courseRouter.delete('/:id', isAuthenticated, isAdmin, deleteCourse);
courseRouter.get(
  '/get-course-content/:id',
  isAuthenticated,
  getUserPurchasedCourse
);
courseRouter.put('/add-question', isAuthenticated, addQuestionData);
courseRouter.put('/add-answer', isAuthenticated, addAnswerToQuestion);
courseRouter.put('/add-review/:id', isAuthenticated, addReview);
courseRouter.put(
  '/add-review-reply',
  isAuthenticated,
  isAdmin,
  addReplyToReview
);

module.exports = courseRouter;
