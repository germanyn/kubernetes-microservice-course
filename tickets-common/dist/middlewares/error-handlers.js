"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const CustomError_1 = require("../errors/CustomError");
const errorHandler = (error, req, res, next) => {
    if (error instanceof CustomError_1.CustomError) {
        return res.status(error.statusCode).send({
            errors: error.serializeError(),
        });
    }
    console.error(error);
    res.status(500).send({
        errors: [{
                message: 'Something went wrong',
            }],
    });
};
exports.errorHandler = errorHandler;
