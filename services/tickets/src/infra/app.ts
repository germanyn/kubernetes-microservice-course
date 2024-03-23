import express, { json } from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import {
    currentUser,
    errorHandler,
    NotFoundError,
    validateRequest,
} from '@germanyn-org/tickets-common'
import { createTicketRouter } from '../routes/new'
import { showTicketRouter } from '../routes/show'
import { indexTicketRouter } from '../routes'
import { updateTicketRouter } from '../routes/update'

export const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        source: false,
    })
)
app.use(currentUser)
app.use(validateRequest)

app.use('/api/tickets', createTicketRouter)
app.use('/api/tickets', showTicketRouter)
app.use('/api/tickets', indexTicketRouter)
app.use('/api/tickets', updateTicketRouter)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)