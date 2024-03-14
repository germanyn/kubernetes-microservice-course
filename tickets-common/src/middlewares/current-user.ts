import { Handler } from "express"
import jwt from 'jsonwebtoken'

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

export const currentUser: Handler = (
    req,
    res,
    next,
) => {
    try {
        if (!req.session?.jwt)
            throw new Error('No JWT session found')
        const payload = jwt.verify(
            req.session.jwt,
            process.env.JWT_KEY!
        ) as UserPayload
        req.currentUser = payload
    } catch (error) {}

    next()
}