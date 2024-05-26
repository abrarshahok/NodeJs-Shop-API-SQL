const express = require("express");
const routes = express.Router();

const productController = require("../controllers/product-controller.js");

// admin/products => GET
routes.get("/products", productController.getProducts);

// admin/products/id => GET
routes.get("/products/:productId", productController.getProductById);

// admin/product => POST
routes.post("/add-product", productController.addProduct);

// admin/product => PATCH
routes.patch("/update-product/:productId", productController.updateProduct);

// admin/product => POST
routes.post("/delete-product/:productId", productController.deleteProduct);

module.exports = routes;
