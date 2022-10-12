class CustomError extends Error {
  status: number;
  message: string;
  validationErrors: [];
  constructor(status: number, message: string, validationErrors: []) {
    super(message);
    this.status = status;
    this.message = message;
    this.validationErrors = validationErrors;
  }
}

export default CustomError;
