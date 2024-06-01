const errorHandler = require("../utils/error-handler.js");
const { validationResult } = require("express-validator");

const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const placeOrder = async (req, res, next) => {
  try {
    const cart = await req.session.user.getCart();

    const cartProducts = await cart.getProducts();

    if (cartProducts.length <= 0) {
      return res.send({ success: false, message: "Cart is empty!" });
    }

    const order = await req.session.user.createOrder();

    const success = await order.addProducts(
      cartProducts.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );

    if (!success) {
      return res.send({ success: false, message: "Order failed to place" });
    }

    await cart.setProducts(null);

    res.send({ success: true, body: "Order placed" });
  } catch (error) {
    next(errorHandler);
  }
};

const getAllOrders = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const orders = await req.session.user.getOrders({ include: ["products"] });

    res.send({ success: true, body: orders });
  } catch (error) {
    console.log(error);
    next(errorHandler);
  }
};

const getInvoice = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const orderId = req.params.orderId;
  try {
    const orders = await req.session.user.getOrders({
      include: ["products"],
      where: { id: orderId },
    });

    const order = orders[0];

    if (order.userId.toString() !== req.session.user.id.toString()) {
      return res.send({ success: true, message: "User not authorized" });
    }
    const invoicePath = generateInvoicedPdf(order);

    // Set headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${order.id}.pdf"`
    );

    fs.createReadStream(invoicePath).pipe(res);
  } catch (error) {
    console.log(error);
    next(errorHandler);
  }
};

const generateInvoicedPdf = (order) => {
  const doc = new PDFDocument();

  const invoiceName = `invoice-${order.id}.pdf`;

  const invoicePath = path.join(
    path.resolve(),
    "data",
    "invoices",
    invoiceName
  );

  doc.pipe(fs.createWriteStream(invoicePath));

  const orderId = order.id;
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  const userId = order.userId;
  const products = order.products;

  doc.font("Helvetica-Bold").fontSize(24).text("Invoice", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: ${orderId}`);
  doc.text(`Order Date: ${orderDate}`);
  doc.text(`User ID: ${userId}`);
  doc.moveDown();

  doc.font("Helvetica-Bold").text("Products:").font("Helvetica").moveDown();

  let totalAmount = 0;

  products.forEach((product, index) => {
    const productId = product.id;
    const title = product.title;
    const price = product.price / 100; // Assuming price is in cents
    const quantity = product.orderItem.quantity;
    const totalPrice = price * quantity;
    totalAmount += totalPrice;

    doc.font("Helvetica-Bold").text(`${index + 1}.${title}`);
    doc.font("Helvetica").text(`  Product ID: ${productId}`);
    doc.text(`  Quantity: ${quantity}`);
    doc.text(`  Price per Unit: $${price.toFixed(2)}`);
    doc.text(`  Total Price: $${totalPrice.toFixed(2)}`);
    doc.moveDown();
  });

  doc.moveDown();
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(`Total Amount: $${totalAmount.toFixed(2)}`, { align: "right" });

  doc.end();

  return invoicePath;
};

module.exports = {
  placeOrder,
  getAllOrders,
  getInvoice,
};
