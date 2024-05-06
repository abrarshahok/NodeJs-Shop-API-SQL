const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "Shop",
  password: "@A2b3c4567@",
});

module.exports = pool.promise();
