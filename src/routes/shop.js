const express = require("express");
const productController = require("../controllers/product-controller.js");

const router = express.Router();

// shop/products => GET
router.get("/products", productController.getProducts);

// shop/products/id => GET
router.get("/products/:productId", productController.getProductById);

module.exports = router;
