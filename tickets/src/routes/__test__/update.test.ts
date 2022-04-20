import { Types } from 'mongoose'
import request from 'supertest'
import { app } from '../../infra/app'
import { natsWrapper } from '../../libs/nats-wrapper'
import { Ticket } from '../../models/ticket'

it('returns a 404 if the provided id does not exists', async () => {
    const id = new Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Valid title',
            price: 20,
        })
        .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
    const id = new Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'Valid title',
            price: 20,
        })
        .expect(401)
})

it('returns a 403 if the user does not ownt the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Valid title',
            price: 10,
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Valid title 2',
            price: 15,
        })
        .expect(403)
})

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookies = global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookies)
        .send({
            title: 'Valid title',
            price: 10,
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookies)
        .send({
            title: '',
            price: 15,
        })
        .expect(400)
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookies)
        .send({
            title: 'Valid title',
            price: -15,
        })
        .expect(400)
})

it('updates ticket sucessfully', async () => {
    const cookies = global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookies)
        .send({
            title: 'Previous title',
            price: 10,
        })
    const newTitle = 'New title'
    const newPrice = 55
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookies)
        .send({
            title: newTitle,
            price: newPrice,
        })
        .expect(200)

    const tickets = await Ticket.find({})
    expect(tickets[0].title).toEqual(newTitle)
    expect(tickets[0].price).toEqual(newPrice)

})


it('publishes an event', async () => {
    const cookies = global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookies)
        .send({
            title: 'Previous title',
            price: 10,
        })
    const newTitle = 'New title'
    const newPrice = 55
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookies)
        .send({
            title: newTitle,
            price: newPrice,
        })
        .expect(200)

    expect(natsWrapper.client.publish).toBeCalledTimes(2)
})
