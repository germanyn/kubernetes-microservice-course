import { ExpirationCompleteEvent, Listener, OrderStatus, Subject } from "@germanyn-org/tickets-common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
    queueGroupName = queueGroupName

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findByIdAndUpdate(data.orderId, {
            status: OrderStatus.Canceled,
        }, {
            new: true,
        }).populate('ticket')

        if (!order) {
            throw new Error('Order not found')
        }

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            },
        })

        msg.ack()
    }

}