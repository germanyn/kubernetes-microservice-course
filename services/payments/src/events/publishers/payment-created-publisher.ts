import { PaymentCreatedEvent, Publisher, Subject } from "@germanyn-org/tickets-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subject.PaymentCreated = Subject.PaymentCreated
}
