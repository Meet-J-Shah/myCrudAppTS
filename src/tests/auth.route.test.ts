/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import { App } from "../app"; // Adjust path as needed
import * as db from "../models";

let app: any;

beforeAll(async () => {
  const appInstance = new App();
  app = await appInstance.listen();
  await db.sequelize.authenticate();
});

afterAll(async () => {
  await db.sequelize.close();
  //server.close();
});

describe("Auth Routes", () => {
  afterEach(() => {
    // Reset mocks and clear timers
    jest.resetModules();
    jest.clearAllMocks();
  });
  describe("POST /auth/login", () => {
    it("should return 200 and login successfully", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "John23@gmail.com",
        password: "Doe@1234",
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("token");
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "invalid-email",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /auth/register", () => {
    it("should return 201 and register successfully", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "newuser2@example.com",
        password: "Pass@123",
        role: "user",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("New user registered successfully");
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "invalid-email",
      });

      expect(response.status).toBe(400);
    });
  });
});
