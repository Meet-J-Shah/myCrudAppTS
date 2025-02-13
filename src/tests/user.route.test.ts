import request from "supertest";
import { App } from "../app";
import * as db from "../models";
import { UserService } from "../service";
import UserController from "../controllers/users.controller";
import { NotFoundError } from "../utils";

jest.mock("../services/userService"); // Mock UserService

describe("UserController", () => {
  let app: App;

  beforeAll(async () => {
    app = new App();
    await app.listen();
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should get a list of users successfully", async () => {
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

    (
      UserService.getUserList as jest.MockedFunction<
        typeof UserService.getUserList
      >
    ).mockResolvedValueOnce(mockUsers); // Correct: Return an array of users

    const req = {} as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const next = jest.fn();

    await UserController.getUserList(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: mockUsers,
      })
    );
  });

  it("should handle error when no users are found", async () => {
    const req = {} as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const next = jest.fn();

    (
      UserService.getUserList as jest.MockedFunction<
        typeof UserService.getUserList
      >
    ).mockResolvedValueOnce([]); // Correct: Return an empty array

    await UserController.getUserList(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it("should handle database error", async () => {
    const req = {} as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const next = jest.fn();

    (
      UserService.getUserList as jest.MockedFunction<
        typeof UserService.getUserList
      >
    ).mockRejectedValueOnce(new Error("Database error"));

    await UserController.getUserList(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
