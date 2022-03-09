import request from "supertest";
import { app } from "../../app";
import { authHelper } from "../../test/authHelper";

const createTicket = (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", authHelper())
    .send({ title, price });
};

it("Can fetch a list of tickets", async () => {
  const title = "agagga";
  const price = 10;
  await createTicket(title, price);
  await createTicket(title, price);
  await createTicket(title, price);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
