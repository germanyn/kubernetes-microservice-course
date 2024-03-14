import { Handler } from "express"
import { UnauthorizedError } from "../errors/UnauthorizedError"

interface UserPayload {
    id: string
    email: string
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const requireAuth: Handler = (
    req,
    res,
    next,
) => {
    if (!req.currentUser)
        throw new UnauthorizedError()
    next()
}