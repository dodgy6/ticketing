import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@dgy-tickets/common";
import { app } from "../../app";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { authHelper } from "../../test/authHelper";
import { Payment } from "../../models/payments";

it("returns a 404 when purchasing an order that dows not exis", async () => {
  await request(app)
    .post("/api/payments")
    .send({
      token: "dsdsd",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .set("Cookie", authHelper())
    .expect(404);
});

it("Returns a 401 when purchasing an order that doesn't belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .send({
      token: "dsdsd",
      orderId: order.id,
    })
    .set("Cookie", authHelper())
    .expect(401);
});

it("Returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = authHelper(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .send({
      token: "dsdsd",
      orderId: order.id,
    })
    .set("Cookie", cookie)
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", authHelper(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  );

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("eur");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
});
