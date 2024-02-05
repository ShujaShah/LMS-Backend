const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    //ref to instructor schema,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    url: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  demoUrl: {
    type: String,
    required: true,
  },
  reviews: {
    //review Schema
  },
  courseData: {
    //courseData schema
  },
  ratings: {
    type: Number,
    default: 0,
  },
  purchased: {
    type: Number,
    default: 0,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
