const isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.send({
      success: false,
      message: "Please Login First",
    });
  }
  next();
};

module.exports = isAuth;
