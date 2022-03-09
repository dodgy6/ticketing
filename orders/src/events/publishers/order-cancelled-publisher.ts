import { Publisher, OrderCancelledEvent, Subjects } from "@dgy-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.Ordercancelled;
}
