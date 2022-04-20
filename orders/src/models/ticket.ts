import { Document, Model, model, Schema } from 'mongoose'
import { TICKET_REF } from './contants'
import { Order, OrderStatus } from './order'

interface TicketAttrs {
    id?: string
    title: string
    price: number
}

interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
    findByEvent(event: { id:string, version: number }): Promise<TicketDoc | null>
}

export interface TicketDoc extends Document {
    title: string
    price: number
    isReserved: () => Promise<boolean>
}

const ticketSchema = new Schema<TicketDoc, TicketModel>({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id.toString()
            delete ret._id
        }
    }
})

ticketSchema.static('build', ({id, ...attrs}: TicketAttrs) => new Ticket({
    ...attrs,
    _id: id,
}))
ticketSchema.static('findByEvent', ({ id, version }: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: id,
        version: version -1,
    })
})

ticketSchema.methods.isReserved = async function() {
    return Order.exists({
        ticket: this,
        status: {
            $nin: [OrderStatus.Canceled],
        },
    })
}

export const Ticket = model<TicketDoc, TicketModel>(TICKET_REF, ticketSchema)
