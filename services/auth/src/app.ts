import express, { json } from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import {
    errorHandler,
    NotFoundError,
    validateRequest,
} from '@germanyn-org/tickets-common'
import { currentUserRouter } from './routes/current-user'
import { signoutRouter } from './routes/signout'
import { signinRouter } from './routes/siginin'
import { signupRouter } from './routes/signup'

export const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        source: false,
    })
)
app.use(validateRequest)

app.use('/api/users/current-user', currentUserRouter)
app.use('/api/users/signout', signoutRouter)
app.use('/api/users/signin', signinRouter)
app.use('/api/users/signup', signupRouter)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)