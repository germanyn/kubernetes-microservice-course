import Queue from 'bull'

export const expirationQueue = new Queue<ExpirationPayload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST,
    },
})

export interface ExpirationPayload {
    orderId: string
}

expirationQueue.process(async (job) => {
    console.log(
        'I want to publish an expration:complete event for orderId',
        job.data.orderId,
    )
})
