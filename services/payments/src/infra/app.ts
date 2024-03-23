import express, { json } from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import {
    currentUser,
    errorHandler,
    NotFoundError,
} from '@germanyn-org/tickets-common'
import { createChargeRouter } from '../routes/new'

export const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
)
app.use(currentUser)

app.use('/api/payments', createChargeRouter)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)