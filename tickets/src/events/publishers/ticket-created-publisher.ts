import { Publisher, Subjects, TicketCreatedEvent } from "@dgy-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
