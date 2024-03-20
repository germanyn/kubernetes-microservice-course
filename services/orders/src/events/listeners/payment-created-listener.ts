import { Listener, OrderStatus, PaymentCreatedEvent, PaymentCreatedEventData, Subject } from "@germanyn-org/tickets-common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListeners extends Listener<PaymentCreatedEvent> {
    subject: Subject.PaymentCreated = Subject.PaymentCreated
    queueGroupName = queueGroupName

    async onMessage(data: PaymentCreatedEventData, msg: Message) {
        const order = await Order.findById(data.orderId)
        if (!order) {
            throw new Error('Order not found')
        }

        order.set({ status: OrderStatus.Complete })

        await order.save()

        msg.ack()
    }

}
