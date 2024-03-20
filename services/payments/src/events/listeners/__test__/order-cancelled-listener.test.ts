import { OrderCancelledData, OrderCreatedData, OrderStatus } from "@germanyn-org/tickets-common";
import { Types } from "mongoose";
import { natsWrapper } from "../../../libs/nats-wrapper";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";

it('cancel a order', async () => {
    const { data, listener, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(data.id)
    expect(updatedOrder!.status).toBe(OrderStatus.Canceled)
})

it('acks the message', async () => {
    const { data, listener, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toBeCalled()
})

async function setup() {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const order = Order.build({
        id: new Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        status: OrderStatus.Created,
        userId: new Types.ObjectId().toHexString(),
    })
    await order.save()

    const data: OrderCancelledData = {
        id: order.id,
        version: 1,
        ticket: {
            id: new Types.ObjectId().toHexString(),
        },
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