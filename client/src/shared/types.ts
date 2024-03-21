import { OrderStatus } from '@germanyn-org/tickets-common'

export interface Ticket {
    id: string
    price: number
    title: string
    userId: string
    version: number
}

export interface Order {
    id: string
    status: `${OrderStatus}`
    expiresAt: string
    ticket: {
        id: string
        price: number
        title: string
    }
}

export interface CreateOrderParams {
    orderId: string
    token: string
}
