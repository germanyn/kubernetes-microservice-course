import express, { json } from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import {
    currentUser,
    errorHandler,
    NotFoundError,
} from '@germanyn-org/tickets-common'

export const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
)
app.use(currentUser)

// app.use('/api/orders', createOrderRouter)
// app.use('/api/orders', showOrderRouter)
// app.use('/api/orders', indexOrderRouter)
// app.use('/api/orders', editOrderRouter)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)