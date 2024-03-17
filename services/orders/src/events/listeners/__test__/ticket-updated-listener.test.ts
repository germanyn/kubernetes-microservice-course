import { TicketUpdatedEvent } from "@germanyn-org/tickets-common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { natsWrapper } from "../../../libs/nats-wrapper"
import { Ticket } from "../../../models/ticket"
import { TicketUpdatedListener } from "../ticket-updated-listener"

it('finds, updates. and saves a ticket', async () => {
    const { msg, data, ticket, listener } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it ('acks the message', async () => {
    const { listener, data, msg } = await setup()

    // call the on Message function with the object + message object
    await listener.onMessage(data, msg)

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event is out of order', async () => {
    const { listener, data, msg } = await setup()

    data.version = 10
    
    try {
        await listener.onMessage(data, msg)
    } catch {}

    expect(msg.ack).not.toHaveBeenCalled()
})

const setup = async () => {
    // create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    // create and save a ticket
    const ticket = Ticket.build({
        id: new Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    })
    await ticket.save()

    // create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: new Types.ObjectId().toHexString(),
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
        msg,
    }
}