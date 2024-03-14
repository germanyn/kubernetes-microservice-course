import { Handler } from "express"
import { validationResult } from "express-validator"
import { RequestValidationError } from "../errors/RequestValidationError"

export const validateRequest: Handler = (
    req,
    res,
    next,
) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array())

    next()
}