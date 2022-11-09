const AppError = require("./appError");

exports.errHandling = (err, req, res, next) => {
  console.log(err.name, err.message);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // let error={...err}

  //   if (err.name === "ValidationError") {
  //     const e = Object.values(err.errors).map((el) => el.message);
  //     err = new AppError(`Invalide input data. ${e.join(". ")}`, 400);
  //   }
  if (err.name === "ReferenceError") {
    err = new AppError(`${err.message}`, 500);
  }
  if (err.name === "MulterError" && err?.code == "LIMIT_FILE_SIZE") {
    err = new AppError(`${err.message}`, 400);
  }
  if (err.name === "JsonWebTokenError") {
    err = new AppError(`${err.message}`, 400);
  }
  if (err.name === "SequelizeValidationError") {
    const fields = err.errors.map((field) => field.path);

    err = new AppError(
      `These fields should not be empty: ${fields.join(", ")}`,
      400
    );
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors.map((error) => error.path)[0];

    err = new AppError(`The ${field} is already taken`, 400);
  }

  if (err.isOprational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
    });
  } else {
    console.log("Error🔥", err);
    res.status(500).json({
      status: "error",
      message: "Something is very wrong",
      error: err,
    });
  }
};
