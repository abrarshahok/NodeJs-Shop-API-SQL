const Order = require("../models/order.js");
const Cart = require("../models/cart.js");

const { validationResult } = require("express-validator");
const errorHandler = require("../utils/error-handler.js");

const addOrder = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId } = req.body;

  try {
    const cartProducts = await Cart.findAll({ where: { userId: userId } });

    const success = cartProducts.map(async (cart) => {
      const created = await req.user.createOrder({ productId: cart.productId });
      console.log(cart);
      if (created) {
        await cart.destroy();
      }
    });

    if (!success) {
      return res.send({ success: false, body: "Order failed to place" });
    }

    res.send({ success: true, body: "Order placed" });
  } catch (error) {
    next(errorHandler);
  }
};

const getAllOrders = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId } = req.body;
  try {
    const orders = await Order.findAll({ where: { userId: userId } });
    res.send({ success: true, body: orders });
  } catch (error) {
    next(errorHandler);
  }
};

module.exports = {
  addOrder,
  getAllOrders,
};
