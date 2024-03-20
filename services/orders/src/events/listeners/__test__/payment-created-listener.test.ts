import { PaymentCreatedEvent, OrderStatus, PaymentCreatedEventData } from "@germanyn-org/tickets-common"
import { Types } from "mongoose"
import { natsWrapper } from "../../../libs/nats-wrapper"
import { Order } from "../../../models/order"
import { Ticket } from "../../../models/ticket"
import { PaymentCreatedListeners } from "../payment-created-listener"


it('updates the order status to complete', async () => {
    const { data, msg, listener } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(data.orderId)
    expect(updatedOrder!.status).toBe(OrderStatus.Complete)
})

// it('emits a order complete event', async () => {
//     const { data, msg, listener } = await setup()

//     await listener.onMessage(data, msg)
// })

it('acks the message', async () => {
    const { data, msg, listener } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toBeCalled()
})

async function setup() {
    // create a listener
    const listener = new PaymentCreatedListeners(natsWrapper.client)

    // create and save a ticket
    const ticket = Ticket.build({
        id: new Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    })
    await ticket.save()

    const order = Order.build({
        expiresAt: new Date(),
        status: OrderStatus.Created,
        ticket: ticket.id,
        userId: new Types.ObjectId().toHexString(),
    })
    await order.save()

    // create a fake data object
    const data: PaymentCreatedEventData = {
        id: new Types.ObjectId().toHexString(),
        version: 0,
        orderId: order.id,
        chargeId: new Types.ObjectId().toHexString(),
    }

    // create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    // return all of this stuff
    return {
        listener,
        data,
        ticket,
        order,
        msg,
    }
}