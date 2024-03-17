import { ExpirationCompleteEvent, Publisher, Subject } from "@germanyn-org/tickets-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
}
