const { Redis } = require('ioredis');
const Course = require('../entities/course-entity');
const redisClient = require('../../utils/redis');
const AppError = require('../../utils/AppError');
const sendMail = require('../../utils/send-mail');
const ejs = require('ejs');
const path = require('path');
const Notification = require('../entities/notifications-entity');

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
  const isCached = await redisClient.get('allCourses');
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

const removeCourse = async (courseId, res, next) => {
  const isCached = await redisClient.get(courseId);
  if (isCached) {
    await redisClient.del(isCached);
  }
  const course = await Course.findByIdAndDelete(courseId);
  if (!course)
    return res.status(400).send('course with the given id not found');
  res.status(201).json({
    success: true,
    message: 'Successfully deleted',
  });
};

const courseByUser = async (courseId, res) => {
  const course = await Course.findById(courseId);
  res.status(200).json({
    success: true,
    course,
  });
};

const courseQuestions = async (data, req, res) => {
  const question = data?.question;
  const course = await Course.findById(data.courseId);
  const courseContent = course?.courseData?.find((item) =>
    item._id.equals(data.contentId)
  );
  if (!courseContent) {
    return res.status(400).send('invalid content id');
  }
  const newQuestion = {
    user: req.user,
    question,
    questionReplies: [],
  };

  courseContent.questions.push(newQuestion);

  await Notification.create({
    user: req.user?._id,
    title: 'New Question Posted',
    message: `New Question has been posted in ${courseContent?.title}`,
  });

  await course.save();
  res.status(201).json({
    success: true,
    course,
  });
};

const answerQuestion = async (data, req, res) => {
  const answer = data.answer;
  const course = await Course.findById(data.courseId);

  const courseContent = course?.courseData?.find((item) =>
    item._id.equals(data.contentId)
  );
  if (!courseContent) {
    return res.status(400).send('invalid content id');
  }

  const question = courseContent?.questions?.find((item) =>
    item._id.equals(data.questionId)
  );
  if (!question) return res.status(400).send('Question doesnot exist');

  const newAnswer = {
    user: req.user,
    answer,
  };

  question.questionReplies.push(newAnswer);

  await Notification.create({
    user: req.user?._id,
    title: 'Reply received',
    message: `Reply to the Question ${courseContent?.title} received`,
  });
  await course.save();

  //   if (req.user._id === question.user._id) {
  //     //send notification
  //   } else {
  //     const data = {
  //       name: question.user.name,
  //       title: courseContent.title,
  //     };
  //     const html = await ejs.renderFile(
  //       path.join(__dirname, '../../mails/question-reply.ejs'),
  //       data
  //     );
  //     try {
  //       await sendMail({
  //         email: question.user.email,
  //         subject: 'Question Reply',
  //         template: 'question-reply.ejs',
  //         data,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  res.status(201).json({
    success: true,
    course,
  });
};

const addReviewsRatings = async (courseId, data, req, res) => {
  const course = await Course.findById(courseId);
  if (!course) return res.status(400).send('Course id not found');

  const reviewData = {
    user: req.user,
    comments: data.review,
    rating: data.rating,
  };

  course.reviews.push(reviewData);

  //calculate the average for the ratings...
  let average = 0;
  course?.reviews.forEach((review) => {
    average = average + review.rating;
  });
  if (course) {
    course.ratings = average / course.reviews.length;
  }
  await course?.save();

  const notification = {
    title: 'New Review Received',
    message: `${req.user.name} has reviewed your course ${course?.title}`,
  };
  // Todo: Create a notification here
  res.status(201).json({
    success: true,
    course,
  });
};

const addReplyToReviewUseCase = async (data, req, res) => {
  const course = await Course.findById(data.courseId);
  const replyReview = data.comment;
  if (!course)
    return res.status(400).send('Course with the given id not found');
  const review = course?.reviews?.find(
    (review) => review._id.toString() === data.reviewId
  );
  if (!review) return res.status(400).send('Review not found');
  const replyData = {
    user: req.user,
    replyReview,
  };

  if (!review.commentReplies) {
    review.commentReplies = [];
  }

  review.commentReplies.push(replyData);
  await course.save();
  res.status(201).json({
    success: true,
    course,
  });
};

module.exports = {
  createCourse,
  updateCourse,
  getCourses,
  getOneCourse,
  removeCourse,
  courseByUser,
  courseQuestions,
  answerQuestion,
  addReviewsRatings,
  addReplyToReviewUseCase,
};
