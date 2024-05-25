const Sequelize = require("sequelize");

const sequelize = require("../utils/database.js");

const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Cart;
