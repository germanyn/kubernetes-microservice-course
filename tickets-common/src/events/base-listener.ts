import { Message, Stan } from "node-nats-streaming"
import { Event } from "./event"

export abstract class Listener<EventType extends Event<any, any>> {
    abstract subject: EventType['subject']
    abstract queueGroupName: string
    abstract onMessage(data: EventType['data'], msg: Message): void
    protected ackWait = 5 * 10000

    constructor(protected client: Stan) {}

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName)
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        )
        subscription.on('message', (msg:Message) => {
            console.log(
                `Message received ${this.subject} / ${this.queueGroupName}`
            )
            const parsedData = this.parseMessage(msg)
            this.onMessage(parsedData, msg)
        })
    }

    parseMessage(msg: Message) {
        const data = msg.getData()
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'))
    }

}
