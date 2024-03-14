import { OrderCancelledEvent, Publisher, Subject } from "@germanyn-org/tickets-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subject.OrderCancelled;
}
