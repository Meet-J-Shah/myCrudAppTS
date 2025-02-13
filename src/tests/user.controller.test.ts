/* eslint-disable no-undef */
import { Request, Response, NextFunction } from "express";
jest.mock("../models/user.model", () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));
import UserController from "../controllers/users.controller";
import { UserService } from "../service";

import { QueryError } from "../utils/error.handler";
import CONSTANTS from "../constants/constant";

jest.mock("../service");

describe("UserController", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should get user list successfully", async () => {
   (UserService.getUserListByAdmin as jest.MockedFunction<typeof UserService.getUserListByAdmin>).mockResolvedValue([
      { email: "user1@example.com",password: },
    ]);
    await UserController.getUserList(req, res, next);
    expect(res.status).toHaveBeenCalledWith(CONSTANTS.RESPONSE_CODES.SUCCESS);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: [{ id: 1, email: "user1@example.com" }],
      })
    );
  });

  it("should handle getUserList error", async () => {
    UserService.getUserListByAdmin.mockRejectedValue(
      new Error("Database error")
    );
    await UserController.getUserList(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(QueryError));
  });

  it("should get user by ID successfully", async () => {
    req.params.id = 1;
    UserService.getUserById.mockResolvedValue({
      id: 1,
      email: "user1@example.com",
    });
    await UserController.getUserById(req, res, next);
    expect(res.status).toHaveBeenCalledWith(CONSTANTS.RESPONSE_CODES.SUCCESS);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: { id: 1, email: "user1@example.com" },
      })
    );
  });

  it("should handle getUserById error", async () => {
    req.params.id = 1;
    UserService.getUserById.mockRejectedValue(new Error("Database error"));
    await UserController.getUserById(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(QueryError));
  });

  it("should handle updateUserById error", async () => {
    req.params.id = 1;
    UserService.updateUser.mockRejectedValue(new Error("Database error"));
    await UserController.updateUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(QueryError));
  });
  it("should handle deleteUser", async () => {
    req.params.id = 1;
    UserService.deleteUser.mockResolvedValue({ msg: "deleted sucessfully" });
    await UserController.deleteUser(req, res, next);
    expect.objectContaining({
      data: { msg: "deleted sucessfully" },
    });
  });
  it("should handle deleteUserById error", async () => {
    req.params.id = 1;
    UserService.deleteUser.mockRejectedValue(new Error("Database error"));
    await UserController.deleteUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(QueryError));
  });

  it("should update a user successfully", async () => {
    const userId = 1;
    const updatedData = { email: "updated@email.com" };
    const mockUpdatedUser = {
      id: userId,

      email: "updated@email.com",
      // ... other user properties
    };

    UserService.updateUser.mockResolvedValueOnce(mockUpdatedUser);

    const req = { params: { id: userId }, body: updatedData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await UserController.updateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: mockUpdatedUser,
      })
    );
  });

  it("should delete a user successfully", async () => {
    const userId = 1;
    const mockUsers = [
      // ... array of user objects
    ];

    UserService.deleteUser.mockResolvedValueOnce(undefined);
    UserService.getUserListByAdmin.mockResolvedValueOnce(mockUsers);

    const req = { params: { id: userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await UserController.deleteUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: mockUsers,
      })
    );
  });
});
