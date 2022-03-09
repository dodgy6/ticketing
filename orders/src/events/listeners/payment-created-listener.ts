import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@dgy-tickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { id } = data;

    const order = await Order.findById(id);

    if (!order) throw new Error("Order not found");

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
