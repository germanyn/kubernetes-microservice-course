import { OrderCreatedData, OrderStatus } from "@germanyn-org/tickets-common";
import { Types } from "mongoose";
import { natsWrapper } from "../../../libs/nats-wrapper";
import { Order } from "../../../models/order";
import { OrderCreatedListener } from "../order-created-listener";

it('creates a order', async () => {
    const { data, listener, msg } = setup()

    await listener.onMessage(data, msg)

    const createdOrder = await Order.findById(data.id)

    expect(createdOrder!.id).toBe(data.id)
    expect(createdOrder!.version).toBe(data.version)
    expect(createdOrder!.status).toBe(data.status)
    expect(createdOrder!.price).toBe(data.ticket.price)
    expect(createdOrder!.userId).toBe(data.userId)
})

it('acks the message', async () => {
    const { data, listener, msg } = setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toBeCalled()
})

function setup() {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const data: OrderCreatedData = {
        id: new Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: new Types.ObjectId().toHexString(),
            price: 10,
        },
        expiresAt: new Date().toISOString(),
        status: OrderStatus.Created,
        userId: new Types.ObjectId().toHexString(),
    }
    
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return {
        listener,
        data,
        msg,
    }
}