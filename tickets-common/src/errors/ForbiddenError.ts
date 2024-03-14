import { CustomError } from "./CustomError";

export class ForbiddenError extends CustomError {
    statusCode = 403

    constructor() {
        super('Forbidden')

        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }

    serializeError(): { message: string; field?: string | undefined; }[] {
        return [{ message: this.message }]
    }
}