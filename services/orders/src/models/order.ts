import { OrderStatus } from '@germanyn-org/tickets-common'
import { Document, Model, model, Schema, Types } from 'mongoose'
import { ORDER_REF, TICKET_REF } from './contants'
import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

export { OrderStatus }

interface OrderAttrs {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
}

interface OrderDoc extends Document {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
    version: number
}

interface OrderModel extends Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new Schema<OrderDoc, OrderModel>({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created,
    },
    expiresAt: {
        type: Schema.Types.Date,
        required: true,
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: TICKET_REF,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id.toString()
            delete ret._id
        },
    },
})

orderSchema.set('versionKey', 'version')
// @ts-ignore
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.static('build', (attrs: OrderAttrs) => new Order(attrs))

export const Order = model<OrderDoc, OrderModel>(ORDER_REF, orderSchema)
