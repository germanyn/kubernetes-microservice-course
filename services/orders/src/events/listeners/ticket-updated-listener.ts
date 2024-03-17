import { Listener, Subject, TicketUpdatedEvent } from "@germanyn-org/tickets-common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subject.TicketUpdated;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data)
        if (!ticket) throw new Error('Ticket not found')

        const { title, price } = data
        await ticket.set({ title, price }).save()
        msg.ack()
    }
}