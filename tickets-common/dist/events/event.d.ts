import { Subject } from "./subjects";
export interface Event<EventData, EventSubject extends Subject> {
    subject: EventSubject;
    data: EventData;
}
