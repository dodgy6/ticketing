import { Subjects } from "../subjects";

export interface OrderCancelledEvent {
  subject: Subjects.Ordercancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
      price: number;
    };
  };
}
