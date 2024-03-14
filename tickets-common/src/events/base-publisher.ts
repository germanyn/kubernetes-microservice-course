import { Stan } from "node-nats-streaming";
import { Event } from "./event";

export abstract class Publisher<EventType extends Event<any, any>> {
    abstract subject: EventType['subject']

    constructor(protected client: Stan){}

    async publish(data: EventType['data']): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err)
                }
                console.log('Event published to the subject', this.subject)
                resolve()
            })
        })
    }
}