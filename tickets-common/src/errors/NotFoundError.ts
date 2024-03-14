import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
    statusCode: number = 404

    constructor() {
        super('Route not found')

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    serializeError(): { message: string; field?: string | undefined; }[] {
        return [{
            message: 'Route not found'
        }]
    }
    
}