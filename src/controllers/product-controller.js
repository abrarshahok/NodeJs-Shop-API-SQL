const Product = require("../models/product.js");
const { validationResult } = require("express-validator");
const errorHandler = require("../utils/error-handler.js");

const addProduct = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const image = req.file;
  const { title, price, description } = req.body;

  if (!image) {
    return res.status(400).json({ success: true, data: "Invalid Image" });
  }

  try {
    const imageUrl = `http://localhost:3000/${image.path}`;
    const newProduct = await req.session.user.createProduct({
      image: imageUrl,
      title,
      price,
      description,
    });

    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    let products;
    if (req.session.user) {
      products = await req.session.user.getProducts();
    } else {
      products = await Product.findAll();
    }

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId } = req.params;
  const image = req.file;
  const { title, price, description } = req.body;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with id: ${productId} not found`,
      });
    }

    if (title !== undefined) product.title = title;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (image) product.image = image.path;

    await product.save();

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId } = req.params;
  try {
    const deleted = await Product.destroy({
      where: { id: productId, userId: req.session.user.id },
    });

    console.log(deleted);

    if (deleted) {
      return res
        .status(200)
        .json({ success: true, message: "Product deleted" });
    }

    return res
      .status(404)
      .json({ success: false, message: "Failed to delete product" });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId } = req.params;
  try {
    const product = await Product.findByPk(productId);

    if (product) {
      return res.status(200).json({ success: true, data: product });
    }

    return res.status(404).json({
      success: false,
      message: `Product with id: ${productId} not found`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  errorHandler,
};
