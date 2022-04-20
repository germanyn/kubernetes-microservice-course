import { Model, model, Schema } from 'mongoose'
import { Password } from '../services/password'

interface UserAttrs {
    email: string
    password: string
}

interface UserModel extends Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

interface UserDoc extends Document {
    email: string
    password: string
}

const userSchema = new Schema<UserDoc, UserModel>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id.toString()
            delete ret._id
            delete ret.password
        }
    }
})

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        this.set('password', await Password.toHash(this.password))
    }
    done()
})

userSchema.static('build', (attrs: UserAttrs) =>
    new User(attrs)
)

export const User = model<UserDoc, UserModel>('users', userSchema)
