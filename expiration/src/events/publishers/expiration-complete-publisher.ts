import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@dgy-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
