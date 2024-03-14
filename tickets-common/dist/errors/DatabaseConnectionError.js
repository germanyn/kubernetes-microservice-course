"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const CustomError_1 = require("./CustomError");
class DatabaseConnectionError extends CustomError_1.CustomError {
    constructor() {
        super('Error connecting to database');
        this.statusCode = 500;
        this.reason = 'Error connecting to database';
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeError() {
        return [{
                message: this.reason,
            }];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
