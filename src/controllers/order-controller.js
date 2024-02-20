const Course = require('../models/entities/course-entity');
const { User } = require('../models/entities/user-entity');
const CreateOrderUseCase = require('../models/use-cases/order-uc');

const CreateOrder = async (req, res, next) => {
  try {
    const data = {
      courseId: req.body.courseId,
      payment_info: req.body.payment_info,
    };
    await CreateOrderUseCase(data);
  } catch (error) {
    next(console.log(error));
  }
};

module.exports = CreateOrder;
