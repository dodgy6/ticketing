import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { authHelper } from "../../test/authHelper";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("Return a 404 if the provided id does not exists", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", authHelper())
    .send({ title: "ahaha", price: 20 })
    .expect(404);
});

it("Returns a 401 it the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "ahaha", price: 20 })
    .expect(401);
});

it("Return a 401 it he user does not own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", authHelper())
    .send({ title: "ahaha", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", authHelper())
    .send({ title: "new ahaha", price: 7 })
    .expect(401);
});

it("Returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = authHelper();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({ title: "ahaha", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 7 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "dddddd", price: -27 })
    .expect(400);
});

it("Updates the ticket provided the valid input", async () => {
  const cookie = authHelper();
  const title = "hsdfdsf";
  const price = 89;

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({ title: "ahaha", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

it("Publishes an event", async () => {
  const cookie = authHelper();
  const title = "hsdfdsf";
  const price = 89;

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({ title: "ahaha", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the tickets is reserved", async () => {
  const cookie = authHelper();
  const title = "hsdfdsf";
  const price = 89;

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({ title: "ahaha", price: 20 })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(400);
});
