import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  OrderCancelledEvent,
  NotFoundError,
} from "@dgy-tickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.Ordercancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw error
    if (!ticket) throw new NotFoundError();

    // Mark the ticker as being cancelled by setting its orderId property to undefined
    ticket.set({ orderId: undefined });

    // save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    // ack the message
    msg.ack();
  }
}
