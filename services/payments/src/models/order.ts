import { OrderStatus } from '@germanyn-org/tickets-common'
import { Document, Model, model, Schema } from 'mongoose'
import { ORDER_REF } from './contants'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
    id: string
    version: number
    userId: string
    price: number
    status: OrderStatus
}

interface OrderDoc extends Document {
    version: number
    userId: string
    price: number
    status: OrderStatus
}

interface OrderModel extends Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new Schema<OrderDoc, OrderModel>({
    userId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created,
    },
}, {
    toJSON: {
        transform(_, ret) {
            ret.id = ret._id.toString()
            delete ret._id
        },
    },
})

orderSchema.set('versionKey', 'version')
// @ts-ignore
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.static('build', ({ id, ...attrs}: OrderAttrs) => new Order({
    ...attrs,
    _id: id,
}))

export const Order = model<OrderDoc, OrderModel>(ORDER_REF, orderSchema)
