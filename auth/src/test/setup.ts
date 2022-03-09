import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: any;

// Runs only one time before any tests
beforeAll(async () => {
  process.env.JWT_KEY = "testKey";

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

// Runs every time before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    // Delete all data before runs tests
    await collection.deleteMany({});
  }
});

// Close all database connections after tests are finished
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
