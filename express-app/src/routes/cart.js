const express = require("express");
const routes = express.Router();

const cartController = require("../controllers/cart-controller.js");

// cart/add-product => POST
routes.post("/add-product", cartController.addToCart);

// cart/get-all-cart-products => GET
routes.get("/products", cartController.getAllCartProducts);

module.exports = routes;
