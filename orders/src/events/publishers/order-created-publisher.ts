import { Publisher, OrderCreatedEvent, Subjects } from "@dgy-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
