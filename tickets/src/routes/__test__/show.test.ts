import { Types } from 'mongoose'
import request from 'supertest'
import { app } from '../../infra/app'

it('returns a 404 if the ticket not found', async () => {
    const id = new Types.ObjectId().toHexString()
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404)
})

it('returns the ticket if the ticket is found', async () => {
    const title = 'concert'
    const price = 20
    
    const createResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title, price,
        })
        .expect(201)
    const getResponse = await request(app)
        .get(`/api/tickets/${createResponse.body.id}`)
        .send()
        .expect(200)

    expect(getResponse.body.title).toEqual(title)
    expect(getResponse.body.price).toEqual(price)
})