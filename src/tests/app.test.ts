import request from "supertest";
import { App } from "../app"; // Adjust path as needed
import * as db from "../models";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let server: any;

beforeAll(async () => {
  const appInstance = new App();
  server = await appInstance.listen();
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
  //server.close();
});

describe("Express App", () => {
  test("Should allow CORS headers", async () => {
    const response = await request(server).get("/");
    expect(response.header["access-control-allow-origin"]).toBe("*");
    expect(response.header["access-control-allow-headers"]).toBe("*");
    expect(response.header["access-control-allow-methods"]).toBe("*");
  });

  test("Should return 404 for an unknown route", async () => {
    const response = await request(server).get("/unknown-route");
    expect(response.status).toBe(404);
  });

  // test("Should return 500 on internal server error", async () => {
  //   // Mock the database connection to throw an error
  //   jest
  //     .spyOn(db.sequelize, "authenticate")
  //     .mockRejectedValueOnce(new Error("Database connection failed"));
  //   const response = await request(server).get("/"); // Replace with an actual failing route
  //   expect(response.status).toBe(500);
  // });

  test("Should have security headers applied", async () => {
    const response = await request(server).get("/");
    expect(response.header["x-dns-prefetch-control"]).toBeDefined();
    expect(response.header["x-content-type-options"]).toBe("nosniff");
    expect(response.header["x-frame-options"]).toBe("SAMEORIGIN");
  });

  test("Should parse JSON requests correctly", async () => {
    const response = await request(server)
      .post("/auth/register")
      .send({ email: "John234@gmail.com", password: "Doe@1234", role: "user" });
    expect(response.statusCode).not.toBe(400);
  });

  test("Server Should be setup Properly", async () => {
    const response = await request(server).get("/");
    expect(response.statusCode).toBe(200);
    // console.log(response);
    expect(response.text).toBe("Status Check");
  });
});
