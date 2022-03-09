import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
  "sk_test_51KVaFtHFGTpS18LvhYTEIb5sH0UpwUXBFluc18JC8fkV5WgE2WGZLeW0x7MekY403SJageODL1ehxAwN3JMaYEG100PgoqC0GO";

let mongo: any;

// Runs only one time before any tests
beforeAll(async () => {
  process.env.JWT_KEY = "testKey";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

// Runs every time before each test
beforeEach(async () => {
  jest.clearAllMocks();
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
