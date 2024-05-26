const Sequelize = require("sequelize");

const sequelize = require("../utils/database.js");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: { type: Sequelize.STRING, allowNull: false },
  price: { type: Sequelize.DOUBLE, allowNull: false },
  description: { type: Sequelize.STRING, allowNull: false },
});

module.exports = Product;
