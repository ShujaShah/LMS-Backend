const Course = require('../entities/course-entity');
const Order = require('../entities/order-entity');
const { User } = require('../entities/user-entity');
const Notification = require('../entities/notifications-entity');
const sendMail = require('../../utils/send-mail');
const ejs = require('ejs');
const path = require('path');

const CreateOrderUseCase = async (data, req, res, next) => {
  const user = await User.findById(req.user._id);

  const courseAlreadyPurchased = await user.courses.some(
    (course) => course._id.toString() == data.courseId
  );

  if (courseAlreadyPurchased)
    return res.status(400).send('Course is already Purchased...');

  const course = await Course.findById(data.courseId);
  if (!course) return res.status(400).send('Course not found');
  const createOrder = {
    courseId: data.courseId,
    userId: user._id,
    paymentInfo: data.paymentInfo,
  };

  const order = await Order.create(createOrder);

  //Send Mail to the user
  const mailData = {
    order: {
      _id: course._id.toString().slice(0, 6),
      name: course.name,
      price: course.price,
      data: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },
  };
  const html = await ejs.renderFile(
    path.join(__dirname, '../../mails/order-confirmation.ejs'),
    { order: mailData }
  );
  try {
    if (user) {
      await sendMail({
        email: user.email,
        subject: 'Order Confirmation',
        template: 'order-confirmation.ejs',
        data: mailData,
      });
    }
  } catch (error) {
    return next(console.log(error));
  }
  user?.courses.push(course?._id);
  await user?.save();

  const notification = await Notification.create({
    user: user._id,
    title: 'New order',
    message: `Course ${course?.title} has been purchased by ${user.name}`,
  });

  course.purchased += 1;

  await course.save();

  res.status(201).json({
    success: true,
    order,
  });
};

module.exports = CreateOrderUseCase;
