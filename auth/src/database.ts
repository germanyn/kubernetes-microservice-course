import mongoose from 'mongoose' 

export const startDb = async () => {
    if (!process.env.MONGO_URI)
        throw new Error('MONGO_URI must be defined')
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to mongodb')
    } catch (err) {
        console.error(err)
    }
}