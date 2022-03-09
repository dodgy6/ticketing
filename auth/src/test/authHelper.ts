import request from "supertest";
import { app } from "../app";

export const authHelper = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  // "supertest" do not handling cookies automatically,
  // so we need to setup this manually
  const cookie = response.get("Set-Cookie");

  return cookie;
};
