const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  console.log(statusCode, "error");
  res.json({
    status: "error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
    meta: { error: err.message },
  });
};

module.exports = { notFound, errorHandler };
