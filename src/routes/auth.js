const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/auth-controller.js");
const User = require("../models/user.js");

router.get("/signin", authController.getLogin);

router.post(
  "/signin",
  check("email").exists().withMessage("Please enter email").normalizeEmail(),
  check("password").exists().withMessage("Please enter password").trim(),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Please enter password with atleas 5 character")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  authController.postLogin
);

router.post(
  "/signup",
  check("email").exists().withMessage("Please enter email").normalizeEmail(),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Please enter password with atleas 5 character")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject("Email already exists");
      }
    })
    .normalizeEmail(),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.post(
  "/reset-password",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  authController.postResetPassword
);

router.post("/set-new-password/:token", authController.setNewPassword);

module.exports = router;
