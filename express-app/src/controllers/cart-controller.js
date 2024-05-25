const Cart = require("../models/cart.js");

const { validationResult, body } = require("express-validator");
const errorHandler = require("../utils/error-handler.js");

const Product = require("../models/product.js");
const { Sequelize } = require("sequelize");

const addToCart = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId } = req.body;
  try {
    const cartProduct = await Cart.create({
      productId: productId,
      userId: req.user.id,
    });
    res.send({ success: true, body: cartProduct });
  } catch (error) {
    next(errorHandler);
  }
};

const getAllCartProducts = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { userId } = req.body;
  try {
    const cartProducts = await Cart.findAll({ where: { userId: userId } });

    const productIds = cartProducts.map((product) => product.productId);

    const products = await Product.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: productIds,
        },
      },
    });

    res.send({ success: true, body: products });
  } catch (error) {
    next(errorHandler);
  }
};

module.exports = {
  addToCart,
  getAllCartProducts,
};
