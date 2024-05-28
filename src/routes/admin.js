const express = require("express");
const router = express.Router();

const productController = require("../controllers/product-controller.js");

// admin/products => GET
router.get("/products", productController.getProducts);

// admin/products/id => GET
router.get("/products/:productId", productController.getProductById);

// admin/product => POST
router.post("/add-product", productController.addProduct);

// admin/product => PATCH
router.patch("/update-product/:productId", productController.updateProduct);

// admin/product => POST
router.post("/delete-product/:productId", productController.deleteProduct);

module.exports = router;
