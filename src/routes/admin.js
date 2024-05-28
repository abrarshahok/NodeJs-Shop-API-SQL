const express = require("express");
const router = express.Router();

const productController = require("../controllers/product-controller.js");
const { authStateChecker } = require("../controllers/auth-controller.js");

// admin/products => GET
router.get("/products", productController.getProducts);

// admin/products/id => GET
router.get("/products/:productId", productController.getProductById);

// admin/product => POST
router.post("/add-product", authStateChecker, productController.addProduct);

// admin/product => PATCH
router.patch(
  "/update-product/:productId",
  authStateChecker,
  productController.updateProduct
);

// admin/product => POST
router.post(
  "/delete-product/:productId",
  authStateChecker,
  productController.deleteProduct
);

module.exports = router;
