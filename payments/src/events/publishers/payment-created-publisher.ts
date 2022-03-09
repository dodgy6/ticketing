import { PaymentCreatedEvent, Publisher, Subjects } from "@dgy-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
