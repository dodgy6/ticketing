import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { authHelper } from "../../test/authHelper";
import { Order, OrderStatus } from "../../models/orders";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("Return an error if the ticket not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", authHelper())
    .send({ ticketId })
    .expect(404);
});

it("Return an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "ahhaha",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", authHelper())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("Reserves a ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", authHelper())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("Emits and order created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", authHelper())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
