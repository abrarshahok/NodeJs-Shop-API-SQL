const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order-controller.js");

// cart/add-product => POST
router.post("/place-order", orderController.placeOrder);

// cart/get-all-cart-products => GET
router.get("/all-orders", orderController.getAllOrders);

module.exports = router;
