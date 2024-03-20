import { Event } from "../event";
import { Subject } from "../subjects";
export interface PaymentCreatedEventData {
    id: string;
    version: number;
    chargeId: string;
    orderId: string;
}
export interface PaymentCreatedEvent extends Event<PaymentCreatedEventData, Subject.PaymentCreated> {
}
