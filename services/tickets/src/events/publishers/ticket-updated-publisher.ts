import { Publisher, Subject, TicketUpdatedEvent } from "@germanyn-org/tickets-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subject.TicketUpdated;
}