import { Document, Model, model, Schema } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
    title: string
    price: number
    userId: string
}

interface TicketDoc extends Document {
    title: string
    price: number
    userId: string
    version: number
}

interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new Schema<TicketDoc, TicketModel>({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id.toString()
            delete ret._id
        },
    },
})

ticketSchema.set('versionKey', 'version')
// @ts-ignore
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.static('build', (attrs: TicketAttrs) => new Ticket(attrs))

export const Ticket = model<TicketDoc, TicketModel>('tickets', ticketSchema)
