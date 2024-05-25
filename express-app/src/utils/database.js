const Sequelize = require("sequelize");

const sequelize = new Sequelize("Shop", "root", "@A2b3c4567@", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
