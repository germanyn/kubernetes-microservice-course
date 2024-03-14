import { Message, Stan } from "node-nats-streaming";
import { Event } from "./event";
export declare abstract class Listener<EventType extends Event<any, any>> {
    protected client: Stan;
    abstract subject: EventType['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: EventType['data'], msg: Message): void;
    protected ackWait: number;
    constructor(client: Stan);
    subscriptionOptions(): import("node-nats-streaming").SubscriptionOptions;
    listen(): void;
    parseMessage(msg: Message): any;
}
