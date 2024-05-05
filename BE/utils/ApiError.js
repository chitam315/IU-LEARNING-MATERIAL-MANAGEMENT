class ApiError {
  constructor(statusCode, message) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default ApiError
