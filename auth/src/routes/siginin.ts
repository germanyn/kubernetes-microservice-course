import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import {
    BadRequestError,
    validateRequest,
} from '@germanyn-org/tickets-common'
import { User } from '../models/user'
import { Password } from '../services/password'

const router = Router()

router.post('/',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body

        const user = await User.findOne({
            email,
        }).select('+password')
        if (!user || !await Password.compare(user.password, password))
            throw new BadRequestError('Invalid Credentials')

        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!)

        req.session = {
            jwt: token,
        }

        res.status(200).send(user.toJSON())
    },
)

export { router as signinRouter }
