import { Document, Model, model, Schema } from 'mongoose'
import { PAYMENTS_REF } from './contants'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface PaymentAttrs {
    orderId: string
    chargeId: string
}

interface PaymentDoc extends Document {
    id: string
    orderId: string
    chargeId: string
    version: number
}

interface PaymentModel extends Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc
}

const PaymentSchema = new Schema<PaymentDoc, PaymentModel>({
    orderId: {
        type: String,
        required: true,
    },
    chargeId: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform(_, ret) {
            ret.id = ret._id.toString()
            delete ret._id
        },
    },
})

PaymentSchema.set('versionKey', 'version')
// @ts-ignore
PaymentSchema.plugin(updateIfCurrentPlugin)

PaymentSchema.static('build', (attrs: PaymentAttrs) => new Payment(attrs))

export const Payment = model<PaymentDoc, PaymentModel>(PAYMENTS_REF, PaymentSchema)
