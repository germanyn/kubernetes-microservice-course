import { Listener, OrderCreatedData, OrderCreatedEvent, Subject } from "@germanyn-org/tickets-common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated
    queueGroupName = queueGroupName
    
    async onMessage(orderData: OrderCreatedData, msg: Message) {
        const order = Order.build({
            id: orderData.id,
            price: orderData.ticket.price,
            status: orderData.status,
            userId: orderData.userId,
            version: orderData.version,
        })

        await order.save()

        msg.ack()
    }
}