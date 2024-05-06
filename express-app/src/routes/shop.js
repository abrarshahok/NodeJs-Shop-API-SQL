const express = require("express");
const productController = require("../controllers/product-controller.js");

const routes = express.Router();

// shop/products => GET
routes.get("/products", productController.getProducts);

// shop/products/id => GET
routes.get("/products/:productId", productController.getProductById);

module.exports = routes;
