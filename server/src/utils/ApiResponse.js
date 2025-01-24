class ApiResponse {
  constructor(statusCode, message = "success", data) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.data = data;
    this.message = message;
  }
}

export {ApiResponse}