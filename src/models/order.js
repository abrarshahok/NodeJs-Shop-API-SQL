const Sequelize = require("sequelize");
const sequelize = require("../utils/database.js");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
});

module.exports = Order;
