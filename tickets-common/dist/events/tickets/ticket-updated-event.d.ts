import { Event } from "../event";
import { Subject } from "../subjects";
export interface TicketUpdatedEvent extends Event<{
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
    orderId?: string;
}, Subject.TicketUpdated> {
}
