import { Router, Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { NotFoundError } from "../utils/error.handler";
import { SuccessResponse } from "../utils/successResponse.handler";
import CONSTANTS from "../constants/constant";
import { Json } from "sequelize/types/utils";
import * as bcrypt from "bcrypt";
export class UserService {
  public static async getUserList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await User.findAll({
        where: { role: "user" },
        attributes: ["id", "email", "role", "createdAt"],
      });
      if (!users) {
        throw new NotFoundError(
          CONSTANTS.RESPONSE_CODES.NOT_FOUND,
          CONSTANTS.ERROR_MESSAGES.USER_ERRORS.NOT_FOUND_LIST
        );
      } else {
        res
          .status(CONSTANTS.RESPONSE_CODES.SUCCESS)
          .json(
            new SuccessResponse(
              true,
              CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.USER_LIST,
              CONSTANTS.RESPONSE_CODES.SUCCESS,
              users
            )
          );
        return;
      }
    } catch (error: any) {
      next(error);
      return;
    }
  }

  static async createUser(userData: any): Promise<User> {
    try {
      // Create a new user in the database
      userData.password = await bcrypt.hashSync(userData.password, 12);

      const user = await User.create(userData);
      return user;
    } catch (error) {
      throw new Error("Error creating user");
    }
  }

  // Get all users

  static async getUserListByAdmin(): Promise<User[]> {
    try {
      // Get all users
      const users = await User.findAll();
      return users;
    } catch (error) {
      throw new Error(CONSTANTS.ERROR_MESSAGES.USER_ERRORS.NOT_FETCH_USERS);
    }
  }

  // Get a user by id
  static async getUserById(userId: number): Promise<User> {
    try {
      // Find a user by primary key (id)
      const user = await User.findByPk(userId);
      if (!user) {
        throw new NotFoundError(
          CONSTANTS.RESPONSE_CODES.NOT_FOUND,
          CONSTANTS.ERROR_MESSAGES.USER_ERRORS.NOT_FOUND
        );
      }
      return user;
    } catch (error) {
      throw new Error(CONSTANTS.ERROR_MESSAGES.USER_ERRORS.NOT_FETCH_USER);
    }
  }

  // Update a user by id

  // security ::- change type any from another create respective object for it..
  static async updateUser(userId: number, updatedData: any): Promise<User> {
    try {
      // Find user by id
      const user = await User.findByPk(userId);
      if (!user) {
        throw new NotFoundError(
          CONSTANTS.RESPONSE_CODES.NOT_FOUND,
          CONSTANTS.ERROR_MESSAGES.USER_ERRORS.NOT_FOUND
        );
      }
      // Update the user data
      updatedData.password = await bcrypt.hashSync(updatedData.password, 12);

      await user.update(updatedData);
      return user;
    } catch (error) {
      throw new Error(CONSTANTS.ERROR_MESSAGES.USER_ERRORS.NOT_UPDATE);
    }
  }

  // Delete a user by id
  static async deleteUser(userId: number): Promise<void> {
    try {
      // Find the user
      const user = await User.findByPk(userId);
      if (!user) {
        throw new NotFoundError(
          CONSTANTS.RESPONSE_CODES.NOT_FOUND,
          CONSTANTS.ERROR_MESSAGES.USER_ERRORS.NOT_FOUND
        );
      }
      // Delete the user
      await user.destroy();
    } catch (error) {
      throw new Error(CONSTANTS.ERROR_MESSAGES.USER_ERRORS.NOT_DELETE);
    }
  }
}
