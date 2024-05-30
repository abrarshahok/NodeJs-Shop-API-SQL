const User = require("../models/user.js");
const bcrypt = require("bcrypt");

// const nodemailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport");

const { validationResult } = require("express-validator");
const errorHandler = require("../utils/error-handler.js");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_user: "API_USER",
      api_key: "API_KEY",
    },
  })
);

// getLogin using session
const getLogin = async (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;

  console.log(req.sessionID);

  console.log(req.session);

  if (isLoggedIn) {
    return res.send({
      success: true,
      body: {
        user: req.session.user,
        cart: req.session.cart,
      },
    });
  }
  console.log(req.session);

  return res.send({ success: false, loginStatus: false });
};

// postLogin using session
const postLogin = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  if (!email.includes("@")) {
    return res.send({
      success: false,
      message: "Invalid email.",
    });
  }

  try {
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      return res.send({
        success: false,
        message: "email or password incorrect",
      });
    }

    if (
      user.email == email &&
      (await bcrypt.compare(password, user.password))
    ) {
      req.session.isLoggedIn = true;

      req.session.user = user;

      let cart = await req.session.user.getCart();

      if (!cart) {
        cart = await req.session.user.createCart();
      }

      req.session.cart = cart;

      return res.send({
        success: req.session.isLoggedIn,
        message: "Login Success",
      });
    } else {
      return res.send({
        success: false,
        message: "email or password incorrect",
      });
    }
  } catch (error) {
    next(errorHandler);
  }
};

// postLogin using session
const postSignup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  if (!email.includes("@")) {
    return res.send({
      success: false,
      message: "Invalid email.",
    });
  }

  try {
    const user = await User.findOne({
      where: { email: email },
    });

    if (user) {
      return res.send({
        success: false,
        message: "Email already exist! Please change email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const success = await User.create({
      email: email,
      password: hashedPassword,
    });

    if (success) {
      // await transporter.sendMail({
      //   to: email,
      //   from: "abrar-shop-api@gmail.com",
      //   subject: "Signup succeeded",
      //   html: "<h1>Congratulations! You signed up successfully.</h1>",
      // });
      return res.send({
        success: req.session.isLoggedIn,
        message: "Signup Success",
      });
    } else {
      return res.send({
        success: false,
        message: "Signup Failed",
      });
    }
  } catch (error) {
    next(errorHandler);
  }
};

// postLogout using session
const postLogout = async (req, res, next) => {
  const success = await req.session.destroy();

  if (success) {
    return res.send({ success: true, message: "Logout Success" });
  }

  return res.send({ success: false, message: "Logout Failed" });
};

module.exports = {
  getLogin,
  postLogin,
  postSignup,
  postLogout,
};
