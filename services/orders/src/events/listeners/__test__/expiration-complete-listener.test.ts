import { ExpirationCompleteEvent, OrderCancelledEvent, OrderStatus } from "@germanyn-org/tickets-common"
import { Types } from "mongoose"
import { natsWrapper } from "../../../libs/nats-wrapper"
import { Order } from "../../../models/order"
import { Ticket } from "../../../models/ticket"
import { ExpirationCompleteListener } from "../expiration-complete-listener"


it('updates the order status to cancelled', async () => {
    const { data, msg, listener } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(data.orderId)
    expect(updatedOrder!.status).toBe(OrderStatus.Canceled)
})

it('emits a order cancelled event', async () => {
    const { data, msg, listener } = await setup()

    await listener.onMessage(data, msg)

    // write assertions to make sure ack function is called
    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const orderCancelledEvent: OrderCancelledEvent['data'] = JSON.parse(
        jest.mocked(natsWrapper.client).publish.mock.calls[0][1] as string
    )
    expect(orderCancelledEvent.id).toEqual(data.orderId)
})

it('acks the message', async () => {
    const { data, msg, listener } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toBeCalled()
})

async function setup() {
    // create a listener
    const listener = new ExpirationCompleteListener(natsWrapper.client)

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
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
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