const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order-controller.js");

// cart/place-order => POST
router.post("/place-order", orderController.placeOrder);

// cart/all-orders => GET
router.get("/all-orders", orderController.getAllOrders);

// cart/get-all-cart-products => GET
router.get("/all-orders/:orderId", orderController.getInvoice);

module.exports = router;
