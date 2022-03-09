import mongoose from "mongoose";

import { app } from "./app";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) throw new Error("NATS client id not found!");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS cluster id not found!");
  if (!process.env.NATS_URL) throw new Error("NATS URL must be defined");
  if (!process.env.JWT_KEY) throw new Error("Key not found!");
  if (!process.env.MONGO_URI) throw new Error("Mongo URI must be defined");

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb");
  } catch (err) {
    console.log("err", err);
  }

  app.listen(3000, () => {
    console.log("🚀 ~ file: App.ts ~ line 8 ~ app.listen ~ 3000!");
  });
};

start();
