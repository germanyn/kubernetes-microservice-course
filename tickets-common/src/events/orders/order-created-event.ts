import { OrderStatus } from "../.."
import { Event } from "../event"
import { Subject } from "../subjects"

export interface OrderCreatedData {
    id: string
    version: number
    userId: string
    status: OrderStatus
    expiresAt: string
    ticket: {
        id: string
        price: number
    }
}

export interface OrderCreatedEvent extends Event<OrderCreatedData, Subject.OrderCreated> {}
