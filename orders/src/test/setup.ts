import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
    var signin: (userId?: string) => string[];
}

global.signin = (userId = new mongoose.Types.ObjectId().toHexString()) => {
    const payload = {
        id: userId,
        email: 'test@email.com',
    }
    const token = jwt.sign(payload, process.env.JWT_KEY!)
    const session = { jwt: token }
    const sessionJSON = JSON.stringify(session)
    const base64 = Buffer.from(sessionJSON).toString('base64')
    return [`express:sess=${base64}`]
}

jest.mock('../libs/nats-wrapper')

let mongo: MongoMemoryServer
beforeAll(async () => {
    jest.setTimeout(30000)
    process.env.JWT_KEY = 'supertestsecret'
    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()

    await mongoose.connect(mongoUri)

})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    jest.setTimeout(30000)
    await mongo.stop()
    await mongoose.connection.close()
})
