"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const CustomError_1 = require("./CustomError");
class UnauthorizedError extends CustomError_1.CustomError {
    constructor() {
        super('Unauthorized');
        this.statusCode = 401;
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}
exports.UnauthorizedError = UnauthorizedError;
