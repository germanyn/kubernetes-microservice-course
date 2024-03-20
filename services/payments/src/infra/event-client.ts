import { OrderCancelledListener } from "../events/listeners/order-cancelled-listener"
import { OrderCreatedListener } from "../events/listeners/order-created-listener"
import { natsWrapper } from "../libs/nats-wrapper"

export async function startEventClient() {
    if (!process.env.NATS_CLIENT_ID)
        throw new Error('NATS_CLIENT_ID must be defined')
    if (!process.env.NATS_URL)
        throw new Error('NATS_URL must be defined')
    if (!process.env.NATS_CLUSTER_ID)
        throw new Error('NATS_CLUSTER_ID must be defined')
    await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL,
    )

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()
}
