import { Stan } from "node-nats-streaming";
import { Event } from "./event";
export declare abstract class Publisher<EventType extends Event<any, any>> {
    protected client: Stan;
    abstract subject: EventType['subject'];
    constructor(client: Stan);
    publish(data: EventType['data']): Promise<void>;
}
