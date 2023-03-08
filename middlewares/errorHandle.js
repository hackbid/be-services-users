const errMsg = (error, req, res, next) => {
  // console.log(error);
  let statusCode;
  let statusMessage;
  switch (error.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      statusCode = 400;
      statusMessage = error.errors[0].message;
      break;
    case "invalid":
      statusCode = 400;
      statusMessage = "Invalid email or password";
      break;
    case "notImage":
      statusCode = 400;
      statusMessage = "please insert image";
      break;
    case "balance_0":
      statusCode = 400;
      statusMessage = "balance not enough";
      break;
    case "not_found":
      statusCode = 404;
      statusMessage = "User Not Found!";
      break;
    // case "notReport":
    //   statusCode = 404;
    //   statusMessage = "Report Not Found";
    //   break;
    default:
      statusCode = 500;
      statusMessage = "internal server error";
      break;
  }
  res.status(statusCode).json({ message: statusMessage });
};

module.exports = errMsg;
