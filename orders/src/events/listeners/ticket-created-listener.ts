import { Listener, Subject, TicketCreatedEvent } from "@germanyn-org/tickets-common"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../models/ticket"
import { queueGroupName } from "./queue-group-name"

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subject.TicketCreated
    readonly queueGroupName = queueGroupName

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data
        await Ticket.build({
            id,
            title,
            price,
        }).save()
        msg.ack()
    }
}