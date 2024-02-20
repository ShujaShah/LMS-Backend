const express = require('express');
const isAuthenticated = require('../middlewares/auth');
const CreateOrder = require('../controllers/order-controller');

const orderRouter = express.Router();

orderRouter.post('/create-order', isAuthenticated, CreateOrder);

module.exports = orderRouter;
