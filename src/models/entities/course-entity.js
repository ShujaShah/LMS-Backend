const mongoose = require('mongoose');

//======================================================Review Schema========================================================
const reviewSchema = new mongoose.Schema({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comments: String,
});
const Review = mongoose.model('Review', reviewSchema);

//======================================================Links Schema========================================================
const linkSchema = new mongoose.Schema({
  title: String,
  url: String,
});
const Link = mongoose.model('Links', linkSchema);

//======================================================Comments Schema========================================================
const commentsSchema = new mongoose.Schema({
  user: Object,
  comment: String,
  commentReplies: [Object],
});
const Comment = mongoose.model('Comment', commentsSchema);

//======================================================Course Data Schema========================================================
const courseData = new mongoose.schema({
  videoUrl: String,
  videoThumbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  links: [Link],
  questions: [Comment],
});

const CourseData = mongoose.model('CourseData', courseData);

//======================================================Course Schema========================================================
const courseSchema = new mongoose.schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  tags: {
    type: String,
    required: true,
  },
  demoUrl: {
    type: String,
    required: true,
  },
  reviews: [Review],
  courseData: [CourseData],
  ratings: {
    type: Number,
    defatult: 0,
  },
  purchased: {
    type: Number,
    default: 0,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
