import { Types } from 'mongoose'
import request from 'supertest'
import { app } from '../../infra/app'
import { natsWrapper } from '../../libs/nats-wrapper'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'

it('has a route handler listening to /api/orders for post requests', async () => {
    const response = await request(app)
        .post('/api/orders')
        .send({})
    expect(response.status).not.toEqual(404)

})

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/orders')
        .send({})
        .expect(401)
})

it('returns a status other than 401 if user is signed in', async () => {
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({})
    expect(response.status).not.toEqual(401)
})

it('return error if invalid ticketId is provided', async () => {
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({})
        .expect(400)
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: '',
        })
        .expect(400)
})

it('return error if ticket does not exists', async () => {
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: new Types.ObjectId().toHexString(),
        })
        .expect(400)
    expect(response.body.errors[0].message).toBe('Ticket not found')
})

it('return error if ticket already is reserved', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    })
    await ticket.save()
    
    const order = Order.build({
        ticket,
        userId: new Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date(),
    })
    await order.save()
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id,
        })
        .expect(400)
    expect(response.body.errors[0].message).toBe('Ticket already reserved')
})

it('reserve a ticket', async () => {
    const userId = new Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    })
    await ticket.save()

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin(userId))
        .send({
            ticketId: ticket.id,
        })
        .expect(201)
    
    expect(response.body).toBeDefined()
    
    const orders = await Order.find({})
    expect(orders.length).toEqual(1)
    expect(orders[0].status).toEqual(OrderStatus.Created)
    expect(orders[0].userId).toEqual(userId)
    expect(orders[0].ticket).toBeDefined()
    expect(orders[0].ticket.id.toString('hex')).toBe(ticket.id)
})

it('emits an order created event', async () => {
    const userId = new Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    })
    await ticket.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin(userId))
        .send({
            ticketId: ticket.id,
        })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})