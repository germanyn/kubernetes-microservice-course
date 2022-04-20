import { OrderUpdatedEvent, Publisher, Subject } from "@germanyn-org/tickets-common";

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
    readonly subject = Subject.OrderUpdated;
}