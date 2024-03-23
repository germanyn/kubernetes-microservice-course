
import { startDb } from './database'
import { app } from './app'

const start = async () => {
    console.log('Starting up.........')

    if (!process.env.JWT_KEY)
        throw new Error('JWT_KEY must be defined')
    
    await startDb()

    app.listen(3000, () => {
        console.log(`listening on http://localhost:3000`)
    })
}

start()
