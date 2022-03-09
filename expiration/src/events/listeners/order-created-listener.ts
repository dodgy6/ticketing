import { Listener, OrderCreatedEvent, Subjects } from "@dgy-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("🚀 ~ file: order-created-listener.ts ~ line 12 ~ OrderCreatedListener ~ onMessage ~ delay", delay)
    await expirationQueue.add({ orderId: data.id }, { delay });

    msg.ack();
  }
}
