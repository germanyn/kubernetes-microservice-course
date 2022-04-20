import { Publisher, Subject, TicketCreatedEvent } from "@germanyn-org/tickets-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subject.TicketCreated;
}