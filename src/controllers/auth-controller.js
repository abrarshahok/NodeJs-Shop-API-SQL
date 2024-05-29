const bcrypt = require("bcrypt");
const User = require("../models/user.js");

const { validationResult } = require("express-validator");
const errorHandler = require("../utils/error-handler.js");

// getLogin using session
const getLogin = async (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;

  console.log(req.sessionID);

  console.log(req.session);

  if (isLoggedIn) {
    return res.send({ success: true, loginStatus: true });
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

  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username: username },
    });

    if (!user) {
      return res.send({
        success: false,
        message: "Username or password incorrect",
      });
    }

    if (
      user.username == username &&
      (await bcrypt.compare(password, user.password))
    ) {
      req.session.isLoggedIn = true;

      req.session.user = user;

      return res.send({
        success: req.session.isLoggedIn,
        message: "Login Success",
      });
    } else {
      return res.send({
        success: false,
        message: "Username or password incorrect",
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

  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username: username },
    });

    if (user) {
      return res.send({
        success: false,
        message: "Username already exist! Please change username.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const success = await User.create({
      username: username,
      password: hashedPassword,
    });

    if (success) {
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
