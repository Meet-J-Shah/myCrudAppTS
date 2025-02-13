import request from "supertest";
import app from "../app"; // Assuming your Express app is exported from app.ts
import UserService from "../service/user.service";

jest.mock("../service/user.service");

describe("User Controller", () => {
  let token: string;

  beforeAll(() => {
    token = "valid-jwt-token"; // Replace with a real token if needed
  });

  test("should get list of users", async () => {
    (UserService.getUserListByAdmin as jest.Mock).mockResolvedValue([
      { id: 1, email: "user1@example.com", role: "user" },
    ]);

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("should return user by ID", async () => {
    (UserService.getUserById as jest.Mock).mockResolvedValue({
      id: 1,
      email: "user1@example.com",
      role: "user",
    });

    const res = await request(app)
      .get("/users/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("user1@example.com");
  });

  test("should create a new user", async () => {
    (UserService.createUser as jest.Mock).mockResolvedValue({
      id: 2,
      email: "newuser@example.com",
      role: "user",
    });

    const res = await request(app)
      .post("/create/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "newuser@example.com",
        password: "Password@123",
        role: "user",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("newuser@example.com");
  });

  test("should update a user", async () => {
    (UserService.updateUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: "updated@example.com",
      role: "user",
    });

    const res = await request(app)
      .put("/users/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "updated@example.com", password: "Password@123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("updated@example.com");
  });

  test("should delete a user", async () => {
    (UserService.deleteUser as jest.Mock).mockResolvedValue();

    const res = await request(app)
      .delete("/users/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
