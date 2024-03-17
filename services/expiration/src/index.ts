import { natsWrapper } from './libs/nats-wrapper'
import { startEventClient } from './infra/event-client'

const start = async () => {
    await startEventClient()
}

start()
