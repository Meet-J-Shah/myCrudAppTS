import request from "supertest";
import { App } from "../app"; // Adjust path as needed

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any;
import * as db from "../models";
import User from "../models/user.model";
import * as bcrypt from "bcrypt";
//import { NotFoundError } from "../../utils/error.handler";

// Mock User model
jest.mock("../models/user.model", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));
beforeAll(async () => {
  const appInstance = new App();
  app = await appInstance.listen();
  await db.sequelize.authenticate();
});
import { UserService } from "../service";
afterAll(async () => {
  await db.sequelize.close();
  //server.close();
});
describe("UserService Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get user list successfully", async () => {
    const mockUsers = [
      {
        id: 1,
        email: "user1@example.com",
        role: "user",
        createdAt: new Date(),
      },
      {
        id: 2,
        email: "user2@example.com",
        role: "user",
        createdAt: new Date(),
      },
    ];

    (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
    const response = await UserService.getUserListByAdmin();
    expect(response).toEqual(mockUsers);
  });
  it("should handle getUserList error", async () => {
    (User.findAll as jest.Mock).mockRejectedValue(
      new Error("Error fetching users")
    );
    await expect(UserService.getUserListByAdmin()).rejects.toThrow(
      "Error fetching users"
    );
  });

  it("should get user by ID successfully", async () => {
    (User.findByPk as jest.Mock).mockResolvedValue({
      id: 1,
      email: "user1@example.com",
    });
    const user = await UserService.getUserById(1);
    expect(user).toEqual({ id: 1, email: "user1@example.com" });
  });

  it("should throw NotFoundError if user not found", async () => {
    (User.findByPk as jest.Mock).mockResolvedValue(null);
    await expect(UserService.getUserById(1)).rejects.toThrow(Error);
  });

  // describe("GET /users", () => {
  //   it("should return 200 and user list", async () => {
  //     const mockUsers = [
  //       {
  //         id: 1,
  //         email: "user1@example.com",
  //         role: "user",
  //         createdAt: new Date(),
  //       },
  //       {
  //         id: 2,
  //         email: "user2@example.com",
  //         role: "user",
  //         createdAt: new Date(),
  //       },
  //     ];

  //     (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

  //     const response = await request(app).get("/users");

  //     expect(response.status).toBe(200);
  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.length).toBe(2);
  //   });

  //   it("should return 404 if no users are found", async () => {
  //     (User.findAll as jest.Mock).mockResolvedValue([]);

  //     const response = await request(app).get("/users");

  //     expect(response.status).toBe(404);
  //     expect(response.body.success).toBe(false);
  //   });
  // });

  // describe("POST /users", () => {
  //   it("should return 201 and create a new user", async () => {
  //     const userData = {
  //       email: "test@example.com",
  //       password: "password123",
  //       role: "user",
  //     };

  //     jest.spyOn(bcrypt, "hashSync").mockReturnValue("hashedpassword");
  //     (User.create as jest.Mock).mockResolvedValue({
  //       id: 1,
  //       email: userData.email,
  //       role: userData.role,
  //     });

  //     const response = await request(app).post("/users").send(userData);

  //     expect(response.status).toBe(201);
  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.email).toBe(userData.email);
  //   });
  // });

  // describe("GET /users/:id", () => {
  //   it("should return 200 and a user", async () => {
  //     const mockUser = {
  //       id: 1,
  //       email: "test@example.com",
  //       role: "user",
  //     };

  //     (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

  //     const response = await request(app).get("/users/1");

  //     expect(response.status).toBe(200);
  //     expect(response.body.success).toBe(true);
  //     expect(response.body.data.email).toBe(mockUser.email);
  //   });

  //   it("should return 404 if user is not found", async () => {
  //     (User.findByPk as jest.Mock).mockResolvedValue(null);

  //     const response = await request(app).get("/users/99");

  //     expect(response.status).toBe(404);
  //     expect(response.body.success).toBe(false);
  //   });
  // });

  // describe("PUT /users/:id", () => {
  //   it("should return 200 and update a user", async () => {
  //     const updatedData = { password: "newpassword" };

  //     const mockUser = {
  //       id: 1,
  //       email: "test@example.com",
  //       password: "hashedpassword",
  //       update: jest.fn().mockResolvedValue(true),
  //     };

  //     jest.spyOn(bcrypt, "hashSync").mockReturnValue("hashedpassword");
  //     (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

  //     const response = await request(app).put("/users/1").send(updatedData);

  //     expect(response.status).toBe(200);
  //     expect(response.body.success).toBe(true);
  //   });

  //   it("should return 404 if user is not found", async () => {
  //     (User.findByPk as jest.Mock).mockResolvedValue(null);

  //     const response = await request(app)
  //       .put("/users/99")
  //       .send({ password: "newpassword" });

  //     expect(response.status).toBe(404);
  //     expect(response.body.success).toBe(false);
  //   });
  // });

  // describe("DELETE /users/:id", () => {
  //   it("should return 200 and delete a user", async () => {
  //     const mockUser = {
  //       id: 1,
  //       email: "test@example.com",
  //       destroy: jest.fn().mockResolvedValue(true),
  //     };

  //     (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

  //     const response = await request(app).delete("admin/users/8");

  //     expect(response.status).toBe(200);
  //     expect(response.body.success).toBe(true);
  //   });

  //   it("should return 404 if user is not found", async () => {
  //     (User.findByPk as jest.Mock).mockResolvedValue(null);

  //     const response = await request(app).delete("admin/users/99");

  //     expect(response.status).toBe(404);
  //     expect(response.body.success).toBe(false);
  //   });
  // });
});

/*import UserService from "../service/user.service";
import User from "../models/user.model";

jest.mock("../models/user.model");
*/
describe("User Service", () => {
  test("should get user list", async () => {
    (User.findAll as jest.Mock).mockResolvedValue([
      { id: 1, email: "user@example.com", role: "user" },
    ]);

    const users = await UserService.getUserListByAdmin();
    expect(users.length).toBeGreaterThan(0);
  });

  test("should create a user", async () => {
    (User.create as jest.Mock).mockResolvedValue({
      id: 2,
      email: "newuser@example.com",
    });

    const user = await UserService.createUser({
      email: "newuser@example.com",
      password: "Password@123",
    });
    expect(user.email).toBe("newuser@example.com");
  });

  test("should update a user", async () => {
    const mockUser = { update: jest.fn(), id: 1, email: "updated@example.com" };
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

    const updatedUser = await UserService.updateUser(1, {
      email: "updated@example.com",
    });
    expect(updatedUser.email).toBe("updated@example.com");
  });

  test("should delete a user", async () => {
    const mockUser = { destroy: jest.fn() };
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

    await UserService.deleteUser(1);
    expect(mockUser.destroy).toHaveBeenCalled();
  });
});
