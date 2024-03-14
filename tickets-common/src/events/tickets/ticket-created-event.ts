import { Event } from "../event";
import { Subject } from "../subjects";

export interface TicketCreatedEventData {
    id: string
    version: number
    title: string
    price: number
    userId: string
}

export interface TicketCreatedEvent extends Event<TicketCreatedEventData, Subject.TicketCreated> {}
