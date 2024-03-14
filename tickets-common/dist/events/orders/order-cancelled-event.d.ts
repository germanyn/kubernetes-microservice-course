import { Event } from "../event";
import { Subject } from "../subjects";
export interface OrderCancelledData {
    id: string;
    version: number;
    ticket: {
        id?: string;
    };
}
export interface OrderCancelledEvent extends Event<OrderCancelledData, Subject.OrderCancelled> {
}
