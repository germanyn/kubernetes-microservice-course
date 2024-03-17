import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { BadRequestError } from '@germanyn-org/tickets-common'
import { validateRequest } from '@germanyn-org/tickets-common'
import { User } from '../models/user'

const router = Router()

router.post(
    '/',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body

        const emailAlreadyExists = await User.exists({
            email,
        })
        if (emailAlreadyExists)
            throw new BadRequestError('Email in use')

        const user = User.build({
            email,
            password,
        })

        const createdUser = await User.create(user)

        const token = jwt.sign({
            id: createdUser.id,
            email: user.email
        }, process.env.JWT_KEY!)

        req.session = {
            jwt: token,
        }

        res.status(201).send(createdUser.toJSON())
    },
)

export { router as signupRouter }
