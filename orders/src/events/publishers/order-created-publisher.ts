import { OrderCreatedEvent, Publisher, Subject } from "@germanyn-org/tickets-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subject.OrderCreated;
}