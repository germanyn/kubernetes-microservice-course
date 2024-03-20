import { Listener, OrderCancelledData, OrderCancelledEvent, OrderStatus, Subject } from "@germanyn-org/tickets-common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subject.OrderCancelled = Subject.OrderCancelled
    queueGroupName = queueGroupName
    
    async onMessage(orderData: OrderCancelledData, msg: Message) {
        const order = await Order.findOneAndUpdate({
            _id: orderData.id,
            version: orderData.version - 1,
        }, {
            status: OrderStatus.Canceled,
        })

        if (!order) {
            throw new Error('Order not found')
        }

        msg.ack()
    }
}