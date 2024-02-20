const User = require('../entities/user-entity');
const Course = require('../entities/course-entity');
const Order = require('../entities/order-entity');
const sendMail = require('../../utils/send-mail');
const Notification = require('../entities/notifications-entity');

const CreateOrderUseCase = async (data, req, res, next) => {
  const user = await User.findById(req.user._id);

  const courseAlreadyPurchased = await user.courses.some(
    (course) => course._id.toString() == data.courseId
  );

  if (courseAlreadyPurchased)
    return res.status(400).send('Course is already Purchased...');

  const course = await Course.findById(data.courseId);
  if (!course) return res.status(400).send('Course not found');
  const data = {
    courseId: data.course._id,
    userId: user._id,
  };
  const newOrder = await Order.create(data);

  //Send Mail to the user
  const mailData = {
    order: {
      _id: course._id.slice(0, 6),
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
    path(__dirname, '../../mails/order-confirmation.ejs'),
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

  const notification = Notification.create({
    user: user._id,
    title: 'New order',
    message: `Course ${course?.name} has been purchased by ${user.name}`,
  });
  res.status(201).json({
    success: true,
    order: course,
  });
};

module.exports = CreateOrderUseCase;
