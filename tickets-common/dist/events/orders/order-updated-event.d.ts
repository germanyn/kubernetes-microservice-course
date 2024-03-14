import { OrderStatus } from "../..";
import { Event } from "../event";
import { Subject } from "../subjects";
export interface OrderUpdatedData {
    id: string;
    version: number;
    status?: OrderStatus;
    ticket?: {
        id?: string;
    };
}
export interface OrderUpdatedEvent extends Event<OrderUpdatedData, Subject.OrderUpdated> {
}
