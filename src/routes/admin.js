const express = require("express");
const router = express.Router();

const productController = require("../controllers/product-controller.js");
const isAuth = require("../middlewares/is-auth.js");

// admin/products => GET
router.get("/products", productController.getProducts);

// admin/products/id => GET
router.get("/products/:productId", productController.getProductById);

// admin/product => POST
router.post("/add-product", isAuth, productController.addProduct);

// admin/product => PATCH
router.patch(
  "/update-product/:productId",
  isAuth,
  productController.updateProduct
);

// admin/product => POST
router.post(
  "/delete-product/:productId",
  isAuth,
  productController.deleteProduct
);

module.exports = router;
