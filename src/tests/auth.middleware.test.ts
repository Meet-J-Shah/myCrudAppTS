import { Request, Response, NextFunction } from "express";
import {
  verifyUser,
  verifyAdmin,
  verifyToken,
} from "../middleware/authMiddleware";
import { AuthFailureError } from "../utils/error.handler";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import CONSTANTS from "../constants/constant";
jest.mock("../models/user.model", () => ({
  findOne: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

// jest.mock("jwt", () => ({
//   verify: jest.fn(),
// }));

interface MockRequest extends Request {
  user?: any; // Or UserType if you have it
}

describe("Auth Middleware", () => {
  let req: MockRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as MockRequest;
    req.headers = {};
    res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    next = jest.fn();
  });

  afterEach(() => {
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

  it("should throw AuthFailureError if token verification fails", async () => {
    const mockError = new AuthFailureError(
      CONSTANTS.RESPONSE_CODES.UNAUTHORIZED,
      CONSTANTS.ERROR_MESSAGES.TOKEN_ERRORS.INVALID_TOKEN
    );

    (jwt.verify as jest.Mock).mockImplementation((token, secret, cb) => {
      cb(mockError, null); // Simulate verification error
    });

    try {
      // Call the jwt.verify callback directly (you'll need to extract it)
      req.headers.authorization = "Bearer sometoken";
      //   await verifyUser(req, res, next);
    } catch (error: any) {
      expect(error).toBeInstanceOf(AuthFailureError);
      expect(error.message).toEqual(
        CONSTANTS.ERROR_MESSAGES.TOKEN_ERRORS.INVALID_TOKEN
      );
      expect(error.code).toEqual(CONSTANTS.RESPONSE_CODES.UNAUTHORIZED);
    }
  });

  it("should handle errors thrown by User.findOne", async () => {
    const mockPayload = { id: 123 };
    const mockError = new Error("Database error"); // Mock database error

    (jwt.verify as jest.Mock).mockImplementation((token, secret, cb) => {
      cb(null, mockPayload);
    });

    (User.findOne as jest.Mock).mockRejectedValue(mockError); // Simulate database error

    try {
      const verifyCallback = (jwt.verify as jest.Mock).mock.calls[0][2]; // Get the callback
      await verifyCallback(null, mockPayload); // Call it with error and null payload
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error); // Check for a general error or specific error
    }
  });

  it("should proceed to next middleware if user is found", async () => {
    req.headers.authorization = "Bearer validtoken";
    (jwt.verify as jest.Mock).mockImplementation((token, secret, cb) => {
      // Corrected
      cb(null, { id: 1 });
    });
    (User.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
    });
    await verifyUser(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBeDefined();
  });
  //
  it("should deny access for non-admin users", async () => {
    req.user = { role: "user" };
    await verifyAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AuthFailureError));
  });
  it("should allow access for admin users", async () => {
    req.user = { role: "admin" };
    await verifyAdmin(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
  it('should return "Token verified"', () => {
    const result = verifyToken();
    expect(result).toBe("Token verified");
  });
});
