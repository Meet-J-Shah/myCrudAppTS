import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";
import CONSTANTS from "../constants/constant";
import { BaseError } from "../utils";
//import { promises } from "dns";

interface ErrorHandler {
  (error: unknown, req: Request, res: Response, next: NextFunction): void;
}

const errorCatcher: ErrorHandler = (
  err,
  req,
  res
  // next
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Response<any, Record<string, any>> => {
  console.log((err as Error).stack);

  if (isCelebrateError(err)) {
    let errorMessage: string = CONSTANTS.ERROR_MESSAGES.VALIDATION_ERROR;

    for (const [, joiError] of err.details.entries()) {
      errorMessage = joiError.details
        .map((detail: { message: string }) => detail.message)
        .join(", ");
    }

    return res.status(CONSTANTS.RESPONSE_CODES.BAD_REQUEST).json({
      error: CONSTANTS.ERROR_MESSAGES.VALIDATION_ERROR,
      message: errorMessage,
    });
  }

  if (err instanceof BaseError) {
    return res
      .status(err.code || CONSTANTS.RESPONSE_CODES.INTERNAL_SERVER_ERROR)
      .json({
        error: err.name,
        message: err.message,
      });
  }
  console.log("default error");
  return res.status(CONSTANTS.RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
    error: CONSTANTS.RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
    message: CONSTANTS.ERROR_MESSAGES.SERVER_ERROR,
  });
};

export default errorCatcher;
