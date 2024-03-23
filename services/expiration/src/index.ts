import { startEventClient } from './infra/event-client'

const start = async () => {
    console.log('Starting up')
    await startEventClient()
}

start()
