class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    // Set the status code which is passed to this class via constructor
    this.statusCode = statusCode;

    // Set the status based on the status code
    if (`${statusCode}`.startsWith("4")) {
      this.status = "fail";
    } else {
      this.status = "error";
    }

    // This is to see if the error is operational error or not
    // The message is only sent to the client if it is a operational error
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Export this class
module.exports = AppError;
