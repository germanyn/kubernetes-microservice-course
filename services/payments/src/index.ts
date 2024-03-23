
import { startDb } from './infra/database'
import { app } from './infra/app'
import { natsWrapper } from './libs/nats-wrapper'
import { startEventClient } from './infra/event-client'

const start = async () => {
    console.log('Starting...')

    if (!process.env.JWT_KEY)
        throw new Error('JWT_KEY must be defined')

    await Promise.all([
        startDb(),
        startEventClient(),
    ])

    natsWrapper.client.on('close', () => {
        console.log('NATS connection closed!')
        process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    app.listen(3000, () => {
        console.log(`listening on http://localhost:3000`)
    })
}

start()
