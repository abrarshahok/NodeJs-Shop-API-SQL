const User = require("../models/user.js");

const { validationResult } = require("express-validator");
const errorHandler = require("../utils/error-handler.js");

// getLogin using cookie
// const getLogin = async (req, res, next) => {
//   const cookie = await req.get("Cookie");

//   const isLoggedIn = cookie.split("=")[1] === "true";

//   if (isLoggedIn) {
//     return res.send({ success: true, loginStatus: true });
//   }

//   return res.send({ success: false, loginStatus: false });
// };

// postLogin using cookie
// const postLogin = async (req, res, next) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({
//       where: { username: username, password: password },
//     });

//     if (!user) {
//       return res.send({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (user.username == username && user.password == password) {
//       res.setHeader("Set-Cookie", "isLoggedIn=true");

//       return res.send({
//         success: true,
//         message: "Login Success",
//       });
//     } else {
//       return res.send({
//         success: false,
//         message: "Login Failed",
//       });
//     }
//   } catch (error) {
//     next(errorHandler);
//   }
// };

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
      where: { username: username, password: password },
    });

    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    if (user.username == username && user.password == password) {
      req.session.isLoggedIn = true;

      req.session.user = user;

      return res.send({
        success: req.session.isLoggedIn,
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

// postLogout using session
const postLogout = async (req, res, next) => {
  const success = await req.session.destroy();

  if (success) {
    return res.send({ success: true, message: "Logout Success" });
  }

  return res.send({ success: false, message: "Logout Failed" });
};

const authStateChecker = (req, res, next) => {
  if (
    !req.session.isLoggedIn ||
    req.session.isLoggedIn === undefined ||
    !req.session.user
  ) {
    return res.send({
      success: false,
      message: `Please Login First`,
    });
  }
  next();
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  authStateChecker,
};
