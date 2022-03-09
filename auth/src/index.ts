import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("Key not found!");
  if (!process.env.MONGO_URI) throw new Error("Mongo URI must be defined");

  try {
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
