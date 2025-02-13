import request, { SuperAgentTest } from "supertest";
import { Sequelize } from "sequelize";
import { App } from "../app"; // Main app instance
import * as db from "../models"; // Database connection

const authToken: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM5NDIxNTQ4fQ.xAo1vb21gzwAGxGwAUmljjRYsYpjHUNqfzVfQpSCgqs";

let server: any;
let agent: SuperAgentTest;

describe("Admin Routes", () => {
  beforeAll(async () => {
    await (db.sequelize as Sequelize).authenticate();
    const appInstance = new App();
    server = await appInstance.listen();
    agent = request.agent(server) as unknown as SuperAgentTest;
  });

  afterAll(async () => {
    // if (server) {
    //   await new Promise<void>((resolve, reject) => {
    //     server.close((err?: Error) => {
    //       if (err) reject(err);
    //       else resolve();
    //     });
    //   });
    // }

    await (db.sequelize as Sequelize).close();

    // Force Jest to exit cleanly
    //setImmediate(() => process.exit(0));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /admin/users", () => {
    it("should return 200 and user list", async () => {
      const response = await agent
        .get("/admin/users")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "List of all users having role [user] or [admin]"
      );
    });
  });

  describe("GET /admin/users/:id", () => {
    it("should return 200 and user details", async () => {
      const response = await agent
        .get("/admin/users/9")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("id", 9);
    });

    it("should return 500 for non-existent user", async () => {
      const response = await agent
        .get("/admin/users/99")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Error fetching user");
    });
  });

  describe("PUT /admin/users/:id", () => {
    it("should return 400 for invalid update data", async () => {
      const response = await agent
        .put("/admin/users/2")
        .send({})
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Email is a required field"
      );
    });
  });

  describe("DELETE /admin/users/:id", () => {
    it("should return 500 for non-existent user", async () => {
      const response = await agent
        .delete("/admin/users/99")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Error deleting user");
    });
  });
});
