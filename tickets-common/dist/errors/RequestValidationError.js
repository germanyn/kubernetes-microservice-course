"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const CustomError_1 = require("./CustomError");
class RequestValidationError extends CustomError_1.CustomError {
    constructor(errors) {
        super('Error validating request');
        this.errors = errors;
        this.statusCode = 400;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeError() {
        return this.errors
            .map(error => ({
            message: error.msg,
            field: error.param,
        }));
    }
}
exports.RequestValidationError = RequestValidationError;
