const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database.js");

// Route Imports
const adminRoutes = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");

// Model Imports
const Product = require("./models/product.js");
const User = require("./models/user.js");
const Cart = require("./models/cart.js");
const Order = require("./models/order.js");
const CartItem = require("./models/cart-item.js");

const error404 = require("./middlewares/error404.js");

// Initialize App
const app = express();

// Parsing Request Bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Get User
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

// App Routes
app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

// Called when no route is matched
app.use(error404);

// Listening to Server
app.listen(3000);

// Association (Relations)
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Order);

Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Cart);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// Logging ORM Output
sequelize
  // .sync({ force: true })
  .sync()
  .then((_) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ username: "abrar", password: "12345" });
    }
    return user;
  })
  .then(async (user) => {
    const cart = await user.getCart();
    if (!cart) {
      return user.createCart();
    }
  })
  .catch((err) => {
    console.log(err);
  });
