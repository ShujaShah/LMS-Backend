const mongoose = require('mongoose');
const { User } = require('./user-entity');

//======================================================Review Schema========================================================
const reviewSchema = new mongoose.Schema({
  // user: Object,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rating: {
    type: Number,
    default: 0,
  },
  comments: String,
  commentReplies: [Object],
});

//======================================================Links Schema========================================================
const linkSchema = new mongoose.Schema({
  title: String,
  url: String,
});

//======================================================Comments Schema========================================================
const commentsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  question: String,
  questionReplies: [Object],
});

//======================================================Course Data Schema========================================================
const courseDataSchema = new mongoose.Schema({
  videoUrl: String,
  title: String,
  videoSection: String,
  description: String,
  links: [linkSchema],
  questions: [commentsSchema],
});

//======================================================Course Schema========================================================
const courseSchema = new mongoose.Schema(
  {
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
        //required: true,
      },
      url: {
        type: String,
        //required: true,
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
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
      type: Number,
      defatult: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
    courseDetails: [
      {
        title: String,
      },
    ],
    preRequisits: [
      {
        title: String,
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
