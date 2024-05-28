const { validationResult } = require("express-validator");
const errorHandler = require("../utils/error-handler.js");

const placeOrder = async (req, res, next) => {
  try {
    const cart = await req.session.user.getCart();

    const cartProducts = await cart.getProducts();

    if (cartProducts.length <= 0) {
      return res.send({ success: false, message: "Cart is empty!" });
    }

    const order = await req.session.user.createOrder();

    const success = await order.addProducts(
      cartProducts.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );

    if (!success) {
      return res.send({ success: false, message: "Order failed to place" });
    }

    await cart.setProducts(null);

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

  try {
    const orders = await req.session.user.getOrders({ include: ["products"] });

    res.send({ success: true, body: orders });
  } catch (error) {
    console.log(error);
    next(errorHandler);
  }
};

module.exports = {
  placeOrder,
  getAllOrders,
};
