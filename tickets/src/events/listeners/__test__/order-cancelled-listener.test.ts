import { OrderCancelledEvent, OrderStatus } from "@germanyn-org/tickets-common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { natsWrapper } from "../../../libs/nats-wrapper"
import { Ticket } from "../../../models/ticket"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client)

    const orderId = new Types.ObjectId().toHexString()

    const ticket = await Ticket.build({
        title: 'Concert',
        price: 10,
        userId: new Types.ObjectId().toHexString(),
    })

    ticket.set({ orderId })
    await ticket.save()

    // create a fake data event
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 2,
        ticket: {
            id: ticket.id,
        },
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return {
        listener,
        ticket,
        data,
        msg,
    }
}

it('creates and saves a ticket', async () => {
    const { listener, data, msg, ticket } = await setup()

    // call the on Message function with the object + message object
    await listener.onMessage(data, msg)

    // write assertions to make sure a ticket was created
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket).toBeDefined()
    expect(updatedTicket!.orderId).toBeUndefined()
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup()

    // call the on Message function with the object + message object
    await listener.onMessage(data, msg)

    // write assertions to make sure ack function is called
    expect(msg.ack).toBeCalled()
})

it('publishes a ticket updated event', async () => {
    const { listener, data, msg } = await setup()

    // call the on Message function with the object + message object
    await listener.onMessage(data, msg)

    // write assertions to make sure ack function is called
    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const ticketUpdatedData = JSON.parse(
        jest.mocked(natsWrapper.client).publish.mock.calls[0][1] as string
    )
    expect(ticketUpdatedData.id).toEqual(data.ticket.id)
    expect(ticketUpdatedData.orderId).toBeUndefined()
})
