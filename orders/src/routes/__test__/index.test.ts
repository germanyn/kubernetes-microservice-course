import { Types } from 'mongoose'
import request from 'supertest'
import { app } from '../../infra/app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
    return Ticket.build({
        title: 'concert',
        price: 20,
    }).save()
}

const buildOrder = async (userId: string) => {
    const ticket = await buildTicket()
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + 15 * 60)
    return Order.build({
        status: OrderStatus.Created,
        ticket,
        userId,
        expiresAt,
    }).save()
}

it('has a route handler listening to /api/orders for post requests', async () => {
    const response = await request(app)
        .get('/api/orders')
    expect(response.status).not.toEqual(404)

})

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
        .get('/api/orders')
        .expect(401)
})

it('returns a status other than 401 if user is signed in', async () => {
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', global.signin())
    expect(response.status).not.toEqual(401)
})

it('returns a list of user orders', async () => {
    const userId = new Types.ObjectId().toHexString();

    const orders = await Promise.all([
        buildOrder(userId),
        buildOrder(userId),
        buildOrder(userId),
    ])

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', global.signin(userId))
        .expect(200)
    
    expect(response.body.length).toBe(3)
    expect(response.body[0].id).toBe(orders[0].id)
    expect(response.body[0].ticket.id).toBe(orders[0].ticket.id)
    expect(response.body[1].id).toBe(orders[1].id)
    expect(response.body[2].id).toBe(orders[2].id)
})

it('not return orders for other users', async () => {
    const userId = new Types.ObjectId().toHexString();

    await Promise.all([
        buildOrder(userId),
        buildOrder(userId),
        buildOrder(userId),
    ])

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', global.signin())
        .expect(200)
    
    expect(response.body.length).toBe(0)
})
