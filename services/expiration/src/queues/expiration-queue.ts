import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publisher/expiration-complete-publisher'
import { natsWrapper } from '../libs/nats-wrapper'

export const expirationQueue = new Queue<ExpirationPayload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST,
    },
})

export interface ExpirationPayload {
    orderId: string
}

expirationQueue.process(async ({ data }) => {
    console.log(
        'Publishing expration:complete event for orderId',
        data.orderId,
    )
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: data.orderId,
    })
})
