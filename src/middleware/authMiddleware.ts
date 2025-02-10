import { Request, Response, NextFunction } from "express";
import environmentConfig from "../constants/environment.constant";
import User from "../models/user.model";
import { MyUserRequest } from "../interface";
import jwt = require("jsonwebtoken");
import { AuthFailureError } from "../utils/error.handler";
import CONSTANTS from "../constants/constant";
export const verifyToken = () => {
  return "Token verified";
};

export const verifyUser = async (
  req: MyUserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { authorization } = req.headers as any;
    if (!authorization) {
      throw new AuthFailureError(
        CONSTANTS.RESPONSE_CODES.UNAUTHORIZED,
        CONSTANTS.ERROR_MESSAGES.TOKEN_ERRORS.MISSING_TOKEN
      );
    }

    const scheme = authorization.split(" ")[0];
    if (scheme !== "Bearer") {
      throw new AuthFailureError(
        CONSTANTS.RESPONSE_CODES.UNAUTHORIZED,
        CONSTANTS.ERROR_MESSAGES.TOKEN_ERRORS.NOT_BEARER
      );
    }
    const token = authorization.split(" ")[1];
    console.log("Token:", token);
    jwt.verify(
      token,
      environmentConfig.JWT_SECRET,
      async (err: any, payload: any) => {
        if (err) {
          throw new AuthFailureError(
            CONSTANTS.RESPONSE_CODES.UNAUTHORIZED,
            CONSTANTS.ERROR_MESSAGES.TOKEN_ERRORS.INVALID_TOKEN
          );
        }
        const { id } = payload;
        const user = await User.findOne({ where: { id } });
        if (user) {
          req.user = user;
          next();
        } else {
          throw new AuthFailureError(
            CONSTANTS.RESPONSE_CODES.UNAUTHORIZED,
            CONSTANTS.ERROR_MESSAGES.TOKEN_ERRORS.USER_NOT_FOUND
          );
        }
      }
    );
  } catch (error) {
    console.log("Error:", error); // Log the error for debugging
    next(error); // Pass the error to global error handler
  }
};

export const verifyAdmin = async (
  req: MyUserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return next(
        new AuthFailureError(
          CONSTANTS.RESPONSE_CODES.UNAUTHORIZED,
          CONSTANTS.ERROR_MESSAGES.TOKEN_ERRORS.NOT_ADMIN
        )
      );
      //return res.status(400).json({ message: 'You have no permission..!', status: 400 });
    }
  } catch (error) {
    console.log("Error:", error); // Log the error for debugging
    next(error); // Pass the error to global error handler
  }
};
