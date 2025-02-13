import { Request, Response, NextFunction } from "express";
import { AuthService } from "../service";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  AuthFailureError,
  NotFoundError,
  BadRequestError,
  InternalError,
} from "../utils/error.handler";
import CONSTANTS from "../constants/constant";
import environmentConfig from "../constants/environment.constant"; // Import as default

jest.mock("../models/user.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken", () => ({ sign: jest.fn() })); // Mock jwt.sign correctly

describe("AuthService", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    req.body = {}; // Initialize req.body
    res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    next = jest.fn();
  });

  it("should throw BadRequestError if email or password is missing", async () => {
    await AuthService.login(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
  });

  it("should throw NotFoundError if user not found", async () => {
    req.body = { email: "test@example.com", password: "password" };
    (User.findOne as jest.Mock).mockResolvedValue(null); // Correct type assertion
    await AuthService.login(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it("should throw AuthFailureError if password does not match", async () => {
    req.body = { email: "test@example.com", password: "password" };
    (User.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
    });
    (bcrypt.compareSync as jest.Mock).mockReturnValue(false); // Correct type assertion
    await AuthService.login(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AuthFailureError));
  });

  it("should successfully login and generate token", async () => {
    req.body = { email: "test@example.com", password: "password" };
    (User.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
    });
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("valid_token"); // Correct type assertion
    await AuthService.login(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          token: `Bearer valid_token`, // Template literal for Bearer token
        }),
      })
    );
  });

  it("should handle registration error: User already exists", async () => {
    const req: Request = {} as Request; // Type the request
    req.body = {
      email: "existing@email.com",
      password: "password",
      role: "user",
    };
    const res: Response = {} as Response; // Type the response
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    const next: NextFunction = jest.fn(); // Type the next function

    (User.findOne as jest.Mock).mockResolvedValue({
      email: "existing@email.com",
    }); //User Exists

    await AuthService.register(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });
});
