const Product = require("../models/product.js");

const addProduct = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: "Body cannot be empty" });
  }

  const { name, price, description } = req.body;

  let id = Date.now().toString();

  const product = new Product(id, name, price, description);

  const resp = await Product.addProduct(product);

  res.send(resp);
};

const getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.send(products);
};

const updateProduct = async (req, res, next) => {
  console.log(req.body);
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: "Body cannot be empty" });
  }
  const id = req.params.productId;
  const { name, price, description } = req.body;
  try {
    const updatedProduct = await Product.updateProduct(
      id,
      name,
      price,
      description
    );
    res.send(updatedProduct);
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
};

const deleteProduct = async (req, res, next) => {
  const id = req.params.productId;
  try {
    const resp = await Product.deleteProduct(id);
    res.send(resp);
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const product = await Product.getProductById(id);
    res.send(product);
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
};

exports.getProducts = getProducts;
exports.addProduct = addProduct;
exports.getProductById = getProductById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
