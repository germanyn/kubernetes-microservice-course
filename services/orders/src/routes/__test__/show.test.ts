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
        .get(`/api/orders/${new Types.ObjectId().toHexString()}`)
    expect(response.status).not.toEqual(404)

})

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
        .get(`/api/orders/${new Types.ObjectId().toHexString()}`)
        .expect(401)
})

it('returns 404 for resource not found', async () => {
    const response = await request(app)
        .get(`/api/orders/${new Types.ObjectId().toHexString()}`)
        .set('Cookie', global.signin())
        .expect(404)
})

it('returns a status other than 401 if user is signed in', async () => {
    const response = await request(app)
        .get(`/api/orders/${new Types.ObjectId().toHexString()}`)
        .set('Cookie', global.signin())
    expect(response.status).not.toEqual(401)
})

it('cannot return orders for other users', async () => {
    const userId = new Types.ObjectId().toHexString();
    const order = await buildOrder(userId);

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .expect(403)
})

it('returns a order sucessfully', async () => {
    const userId = new Types.ObjectId().toHexString();
    const order = await buildOrder(userId);

    const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin(userId))
        .expect(200)

    expect(response.body.id).toBe(order.id)
    expect(response.body.ticket).toBeDefined()
    expect(response.body.ticket.id).toBe(order.ticket.id)
})