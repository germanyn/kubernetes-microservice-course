import { ValidationError } from 'express-validator'
import { CustomError } from './CustomError'

export class RequestValidationError extends CustomError {
    statusCode = 400

    constructor(public errors: ValidationError[]) {
        super('Error validating request')

        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeError() {
        return this.errors
            .map(error => ({
                message: error.msg,
                field: error.param,
            }))
    }
}
