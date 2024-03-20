import { ExpirationCompleteListener } from "../events/listeners/expiration-complete-listener"
import { PaymentCreatedListeners } from "../events/listeners/payment-created-listener"
import { TicketCreatedListener } from "../events/listeners/ticket-created-listener"
import { TicketUpdatedListener } from "../events/listeners/ticket-updated-listener"
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
    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    new PaymentCreatedListeners(natsWrapper.client).listen()
}
