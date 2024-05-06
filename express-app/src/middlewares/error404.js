const error404 = (req, res, next) => {
  res.status(404).send({ status: 404, message: "Page Not Found" });
};

module.exports = error404;
