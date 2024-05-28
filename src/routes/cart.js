const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart-controller.js");

// cart/add-product => POST
router.post("/add-product", cartController.addToCart);

// cart/add-product => POST
router.post("/remove-product", cartController.removeProductFromCart);

// cart/get-all-cart-products => GET
router.get("/products", cartController.getAllCartProducts);

module.exports = router;
