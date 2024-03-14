import { ErrorRequestHandler } from 'express'
import { CustomError } from '../errors/CustomError'

export const errorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next,
) => {
    if (error instanceof CustomError) {
        return res.status(error.statusCode).send({
            errors: error.serializeError(),
        })
    }

    console.error(error)
    res.status(500).send({
        errors: [{
            message: 'Something went wrong',
        }],
    })
}