import { Publisher, Subjects, TicketUpdatedEvent } from "@dgy-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
