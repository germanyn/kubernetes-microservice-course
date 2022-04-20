import { Types } from 'mongoose'
import request from 'supertest'
import { OrderUpdatedPublisher } from '../../events/publishers/order-updated-publisher'
import { app } from '../../infra/app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
    return Ticket.build({
        title: 'concert',
        price: 20,
    }).save()
}

const buildOrder = async (userId: string = new Types.ObjectId().toHexString()) => {
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
        .patch(`/api/orders/${new Types.ObjectId().toHexString()}`)
    expect(response.status).not.toEqual(404)

})

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .patch(`/api/orders/${new Types.ObjectId().toHexString()}`)
        .expect(401)
})

it('returns a status other than 401 if user is signed in', async () => {
    const response = await request(app)
        .patch(`/api/orders/${new Types.ObjectId().toHexString()}`)
        .set('Cookie', global.signin())
    expect(response.status).not.toEqual(401)
})

it('returns 404 for resource not found', async () => {
    const response = await request(app)
        .patch(`/api/orders/${new Types.ObjectId().toHexString()}`)
        .set('Cookie', global.signin())
        .expect(404)
})

it('cannot edit orders for other users', async () => {
    const userId = new Types.ObjectId().toHexString();
    const order = await buildOrder(userId);

    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .expect(403)
})

it('edit a order sucessfully', async () => {
    const userId = new Types.ObjectId().toHexString();
    const order = await buildOrder(userId);

    const response = await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', global.signin(userId))
        .send({ status: OrderStatus.Canceled })
        .expect(200)

    expect(response.body.id).toBe(order.id)
    expect(response.body.status).toBe(OrderStatus.Canceled)

    const savedOrder = await Order.findById(order.id)
    if (!savedOrder) return fail('Unexpected Order not found')
    expect(savedOrder.status).toBe(OrderStatus.Canceled)
})

it('rejects invalid status', async () => {
    const userId = new Types.ObjectId().toHexString();
    const order = await buildOrder(userId);

    const response = await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', global.signin(userId))
        .send({ status: 'invalid:status' })
        .expect(400)

    expect(response.body.errors[0].message).toBe('status must be one of: created, canceled, awaiting:payment, complete')
})

it('prevents order cancel status change', async () => {
    const userId = new Types.ObjectId().toHexString();
    const order = await buildOrder(userId);
    
    await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', global.signin(userId))
    .send({ status: OrderStatus.Canceled })
    .expect(200)
    
    const publisherSpy = jest.spyOn(OrderUpdatedPublisher.prototype, 'publish')
    const response = await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', global.signin(userId))
        .send({ status: OrderStatus.Complete })
        .expect(400)

    expect(response.body.errors[0].message).toBe('Order cannot be changed from canceled')  
    expect(publisherSpy).not.toHaveBeenCalled()
})

it('emits a order update event', async () => {
    const userId = new Types.ObjectId().toHexString();
    const order = await buildOrder(userId);
    const spy = jest.spyOn(OrderUpdatedPublisher.prototype, 'publish')

    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', global.signin(userId))
        .send({ status: OrderStatus.Canceled })
        .expect(200)
        
    expect(spy).toBeCalledWith({
        id: order.id,
        version: 1,
        status: OrderStatus.Canceled,
    })
})