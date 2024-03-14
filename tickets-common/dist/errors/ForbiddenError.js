"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const CustomError_1 = require("./CustomError");
class ForbiddenError extends CustomError_1.CustomError {
    constructor() {
        super('Forbidden');
        this.statusCode = 403;
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}
exports.ForbiddenError = ForbiddenError;
