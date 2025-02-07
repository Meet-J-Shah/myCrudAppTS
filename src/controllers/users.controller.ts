import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service';
import CONSTANTS from '../constants/constant';
import { QueryError } from '../utils/error.handler';
import { SuccessResponse } from '../utils/successResponse.handler';
import User from '../models/user.model';
class UserController {
  static async getUserList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getUserListByAdmin();
      res
        .status(CONSTANTS.RESPONSE_CODES.SUCCESS)
        .json(
          new SuccessResponse(
            true,
            CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.ADMIN_LIST,
            CONSTANTS.RESPONSE_CODES.SUCCESS,
            users,
          ),
        );
    } catch (error:unknown) {
      console.log('Error:', error);
      next(new QueryError(CONSTANTS.RESPONSE_CODES.INTERNAL_SERVER_ERROR, (error as Error).message));
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: number = Number(req.params.id);
      const user = await UserService.getUserById(userId);
      res
        .status(CONSTANTS.RESPONSE_CODES.SUCCESS)
        .json(
          new SuccessResponse(
            true,
            CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.USER_FETCH1 +
              userId +
              CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.USER_FETCH2,
            CONSTANTS.RESPONSE_CODES.SUCCESS,
            user,
          ),
        );
    } catch (error) {
      console.log('Error:', error);
      next(new QueryError(CONSTANTS.RESPONSE_CODES.INTERNAL_SERVER_ERROR, (error as Error).message));
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: number = Number(req.params.id);
      const updatedData: User= req.body;
      const updatedUser = await UserService.updateUser(userId, updatedData);
      res
        .status(CONSTANTS.RESPONSE_CODES.SUCCESS)
        .json(
          new SuccessResponse(
            true,
            CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.USER_UPDATE1 +
              userId +
              CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.USER_UPDATE2,
            CONSTANTS.RESPONSE_CODES.SUCCESS,
            updatedUser,
          ),
        );
    } catch (error) {
      console.log('Error:', error);
      next(new QueryError(CONSTANTS.RESPONSE_CODES.INTERNAL_SERVER_ERROR, (error as Error).message));
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: number = Number(req.params.id);
      await UserService.deleteUser(userId);
      const users = await UserService.getUserListByAdmin();
      res
        .status(CONSTANTS.RESPONSE_CODES.SUCCESS)
        .json(
          new SuccessResponse(
            true,
            CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.USER_DELETE1 +
              userId +
              CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.USER_DELETE2,
            CONSTANTS.RESPONSE_CODES.SUCCESS,
            users,
          ),
        );
    } catch (error) {
      console.log('Error:', error);
      next(new QueryError(CONSTANTS.RESPONSE_CODES.INTERNAL_SERVER_ERROR, (error as Error).message));
    }
  }
}

export default UserController;