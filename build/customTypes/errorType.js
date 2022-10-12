"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(status, message, validationErrors) {
        super(message);
        this.status = status;
        this.message = message;
        this.validationErrors = validationErrors;
    }
}
exports.default = CustomError;
