/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware";
import {
  //Request,
  Response,
  NextFunction,
} from "express";
import environmentConfig from "../constants/environment.constant";

import { MyUserRequest } from "../interface";
import jwt from "jsonwebtoken";
import { AuthFailureError } from "../utils/error.handler";
import CONSTANTS from "../constants/constant";

//jest.mock('../models/user.model');
jest.mock("jsonwebtoken");
jest.mock("../models/user.model", () => ({
  findOne: jest.fn(),
}));
describe("Auth Middleware", () => {
  let req: MyUserRequest,
    res: Response<any, Record<string, any>>,
    next: NextFunction | jest.Mock<any, any, any>;
  let User;

  beforeEach(() => {
    //import User from "../models";
    const User = require("../models/user.model"); // Import User after mocking
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    // Reset mocks and clear timers
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("should throw error if authorization header is missing", async () => {
    await verifyUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AuthFailureError));
  });

  it("should throw error if authorization scheme is not Bearer", async () => {
    req.headers.authorization = "Basic sometoken";
    await verifyUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AuthFailureError));
  });

  it("should throw error if token is invalid", async () => {
    req.headers.authorization = "Bearer invalidtoken";
    jwt.verify.mockImplementation(
      (token: any, secret: any, cb: (arg0: Error) => void) => {
        cb(new Error("Invalid token"));
      }
    );
    await verifyUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AuthFailureError));
  });

  it("should throw error if user not found", async () => {
    req.headers.authorization = "Bearer validtoken";
    jwt.verify.mockImplementation(
      (
        token: any,
        secret: any,
        cb: (arg0: null, arg1: { id: number }) => void
      ) => {
        cb(null, { id: 1 });
      }
    );
    User.findOne.mockResolvedValue(null);
    await verifyUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AuthFailureError));
  });

  it("should proceed to next middleware if user is found", async () => {
    req.headers.authorization = "Bearer validtoken";
    jwt.verify.mockImplementation(
      (
        token: any,
        secret: any,
        cb: (arg0: null, arg1: { id: number }) => void
      ) => {
        cb(null, { id: 1 });
      }
    );
    User.findOne.mockResolvedValue({ id: 1, email: "test@example.com" });
    await verifyUser(req, res, next);
    console.log("e1");
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBeDefined();
  });

  it("should deny access for non-admin users", async () => {
    req.user = { role: "user" };
    console.log("e1");
    await verifyAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AuthFailureError));
  });

  it("should allow access for admin users", async () => {
    req.user = { role: "admin" };
    await verifyAdmin(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
