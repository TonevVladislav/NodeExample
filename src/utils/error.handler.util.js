class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperationlal = true;
  }
}

module.exports = AppError;
