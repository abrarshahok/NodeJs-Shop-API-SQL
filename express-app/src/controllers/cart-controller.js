const Product = require("../models/product.js");

const { validationResult, body } = require("express-validator");
const errorHandler = require("../utils/error-handler.js");

const addToCart = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId } = req.body;
  try {
    const cart = await req.user.getCart();

    const cartProducts = await cart.getProducts({
      where: { id: productId },
    });

    let success = null;

    if (cartProducts.length > 0) {
      const product = cartProducts[0];

      product.cartItem.quantity += 1;

      success = await product.cartItem.save();
    } else {
      const newQuantity = 1;

      const product = await Product.findByPk(productId);

      if (product) {
        success = await cart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      } else {
        return res.send({ success: false, body: "Product not found!" });
      }
    }

    if (success) {
      return res.send({
        success: true,
        body: `Product with id:${productId} added to cart`,
      });
    }

    return res.send({ success: false, message: "Failed to add product" });
  } catch (error) {
    console.log(error);
    next(errorHandler);
  }
};

const removeProductFromCart = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId } = req.body;

  try {
    const cart = await req.user.getCart();

    const cartProducts = await cart.getProducts({
      where: { id: productId },
    });

    let success = null;

    if (cartProducts.length > 0) {
      const product = cartProducts[0];

      if (product.cartItem.quantity > 1) {
        product.cartItem.quantity -= 1;

        success = await product.cartItem.save();

        if (success) {
          return res.send({
            success: true,
            body: `Quantity decreased of product with id:${productId}. New Quantity: ${product.cartItem.quantity}`,
          });
        }
      } else {
        success = await product.cartItem.destroy();

        if (success) {
          return res.send({
            success: true,
            body: `Product with id:${productId} removed from cart`,
          });
        }
      }
    } else {
      return res.send({
        success: false,
        message: "Product not found in cart!",
      });
    }

    return res.send({ success: false, message: "Failed to add product" });
  } catch (error) {
    console.log(error);
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
    const cart = await req.user.getCart();

    const cartProducts = await cart.getProducts({ where: { userId: userId } });

    if (cartProducts.length > 0) {
      return res.send({ success: true, body: cartProducts });
    }

    return res.send({ success: false, body: "Cart is empty!" });
  } catch (error) {
    console.log(error);
    next(errorHandler);
  }
};

module.exports = {
  addToCart,
  getAllCartProducts,
  removeProductFromCart,
};
