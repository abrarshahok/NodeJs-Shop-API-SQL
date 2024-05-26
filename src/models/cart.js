const Sequelize = require("sequelize");

const sequelize = require("../utils/database.js");

const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
});

module.exports = Cart;
