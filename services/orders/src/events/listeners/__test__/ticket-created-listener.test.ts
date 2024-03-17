import { TicketCreatedEvent } from "@germanyn-org/tickets-common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { natsWrapper } from "../../../libs/nats-wrapper"
import { Ticket } from "../../../models/ticket"
import { TicketCreatedListener } from "../ticket-created-listener"

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client)

    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        title: 'concert',
        userId: new Types.ObjectId().toHexString(),
    }

    // create a fake message object
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

it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup()

    // call the on Message function with the object + message object
    await listener.onMessage(data, msg)

    // write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data!.title)
    expect(ticket!.price).toEqual(data!.price)
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup()

    // call the on Message function with the object + message object
    await listener.onMessage(data, msg)

    // write assertions to make sure ack function is called
    expect(msg.ack).toBeCalled()
})