import { Listener, OrderCreatedEvent, Subject } from "@germanyn-org/tickets-common"
import { Message } from "node-nats-streaming"
import { expirationQueue } from "../../queues/expiration-queue"
import { queueGroupName } from "./queue-group-name"

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subject.OrderCreated
    readonly queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

        console.log('Waiting this many to process the cancel', delay)

        expirationQueue.add({
            orderId: data.id,
        }, {
            delay,
        })

        msg.ack()
    }
}
