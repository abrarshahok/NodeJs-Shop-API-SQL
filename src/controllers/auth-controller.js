const User = require("../models/user.js");

const { validationResult } = require("express-validator");
const errorHandler = require("../utils/error-handler.js");

const getLogin = async (req, res, next) => {
  const cookie = await req.get("Cookie");

  const isLoggedIn = cookie.split("=")[1] === "true";

  if (isLoggedIn) {
    return res.send({ success: true, loginStatus: true });
  }

  return res.send({ success: false, loginStatus: false });
};

const postLogin = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username: username, password: password },
    });

    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    if (user.username == username && user.password == password) {
      res.setHeader("Set-Cookie", "isLoggedIn=true");

      return res.send({
        success: true,
        message: "Login Success",
      });
    } else {
      return res.send({
        success: false,
        message: "Login Failed",
      });
    }
  } catch (error) {
    next(errorHandler);
  }
};

module.exports = {
  getLogin,
  postLogin,
};
