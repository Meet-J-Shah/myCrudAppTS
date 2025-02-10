import { Router, Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import environmentConfig from "../constants/environment.constant";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CONSTANTS from "../constants/constant";
import {
  AuthFailureError,
  NotFoundError,
  BadRequestError,
  InternalError,
} from "../utils/error.handler";
import { SuccessResponse } from "../utils/successResponse.handler";

export class AuthService {
  public static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new BadRequestError(
          CONSTANTS.RESPONSE_CODES.BAD_REQUEST,
          CONSTANTS.ERROR_MESSAGES.USER_ERRORS.FAILED_VALIDATION
        );
      }

      const users = await User.findOne({ where: { email: email } });
      if (!users) {
        throw new NotFoundError(
          CONSTANTS.RESPONSE_CODES.UNAUTHORIZED,
          CONSTANTS.ERROR_MESSAGES.USER_ERRORS.NOT_FOUND
        );
      } else {
        const passwordMatched = bcrypt.compareSync(password, users.password);
        if (!passwordMatched) {
          throw new AuthFailureError(
            CONSTANTS.RESPONSE_CODES.UNAUTHORIZED,
            CONSTANTS.ERROR_MESSAGES.USER_ERRORS.PWD_NOT_MATCHED
          );
        } else {
          const token = jwt.sign(
            { id: users.id, role: users.role },
            environmentConfig.JWT_SECRET
          );
          const data = {
            email: users.email,
            role: users.role,
            token: "Bearer " + token,
          };
          res
            .status(200)
            .json(
              new SuccessResponse(
                true,
                CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.SIGN_SUCESS,
                CONSTANTS.RESPONSE_CODES.SUCCESS,
                data
              )
            );
          // res.status(200).json(new SuccessResponse(true, 'Signin successfully', 200, data));
          return;
        }
      }
    } catch (error: any) {
      next(error);
      return;
    }
  }
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, role } = req.body;

      const users = await User.findOne({ where: { email: email } });
      if (users) {
        throw new NotFoundError(
          CONSTANTS.RESPONSE_CODES.NOT_FOUND,
          CONSTANTS.ERROR_MESSAGES.USER_ERRORS.USER_EXISTS
        );
      } else {
        const hashPassword = await bcrypt.hashSync(password, 12);
        const newuser = await User.create({
          email,
          password: hashPassword,
          role,
        });
        if (!newuser) {
          throw new InternalError(
            CONSTANTS.RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            CONSTANTS.RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR
          );
        } else {
          res
            .status(200)
            .json(
              new SuccessResponse(
                true,
                CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.REGISTER_SUCESS,
                CONSTANTS.RESPONSE_CODES.SUCCESS
              )
            );
          return;
        }
      }
    } catch (error: any) {
      next(error);
      return;
    }
  }
}
