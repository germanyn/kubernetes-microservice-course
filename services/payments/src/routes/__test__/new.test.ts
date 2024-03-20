import { OrderStatus } from '@germanyn-org/tickets-common'
import { Types } from 'mongoose'
import request from 'supertest'
import { app } from '../../infra/app'
import { stripe } from '../../libs/stripe'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'

it('returns a 404 when purchasing a nonexisting order', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'any-token',
            orderId: new Types.ObjectId().toHexString(),
        })
        .expect(404)
})

it('returns a 401 when purchasing other user order', async () => {
    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        userId: new Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created,
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'any-token',
            orderId: order.id,
        })
        .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new Types.ObjectId().toHexString()
    
    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Canceled,
    })
    
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'any-token',
            orderId: order.id,
        })
        .expect(400)
})

it('successfully create a charge', async () => {
    const userId = new Types.ObjectId().toHexString()
    
    const token = 'tok_visa'
    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Created,
    })
    
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token,
            orderId: order.id,
        })
        .expect(201)

    expect(stripe.charges.create).toBeCalledWith({
        amount: order.price * 100,
        currency: 'brl',
        source: token,
    })
})

it('successfully create a payment', async () => {
    const userId = new Types.ObjectId().toHexString()
    
    const token = 'tok_visa'
    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Created,
    })
    
    await order.save()

    const response = await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token,
            orderId: order.id,
        })
        .expect(201)

    const payment = await Payment.findById(response.body.id)
    expect(payment).not.toBe(null)
    expect(payment!.chargeId).toBe('stripe-id')
    expect(payment!.orderId).toBe(order.id)
})
