import { Joi, Segments } from "celebrate";
import CONSTANTS from "../constants/constant";
const regex: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
const SigninSchema = {
  body: {
    email: Joi.string()
      .email()
      .required()
      .messages(CONSTANTS.VALIDATION_MESSAGES.VALIDATE_EMAIL),
    password: Joi.string()
      .required()
      .pattern(new RegExp(regex))
      .messages(CONSTANTS.VALIDATION_MESSAGES.VALIDTAE_PWD),
  },
};

const SignupSchema = {
  body: {
    email: Joi.string()
      .email()
      .required()
      .messages(CONSTANTS.VALIDATION_MESSAGES.VALIDATE_EMAIL),
    password: Joi.string()
      .required()
      .pattern(new RegExp(regex))
      .messages(CONSTANTS.VALIDATION_MESSAGES.VALIDTAE_PWD),
    role: Joi.string()
      .required()
      .valid("admin", "user")
      .messages(CONSTANTS.VALIDATION_MESSAGES.VALIDATE_ROLE),
  },
};

const validateId = {
  [Segments.PARAMS]: {
    id: Joi.number()
      .min(1)
      .max(100)
      .required()
      .messages(CONSTANTS.VALIDATION_MESSAGES.VALIDATE_ID),
  },
};

const UpdateSchema = {
  body: {
    email: Joi.string()
      .email()
      .required()
      .messages(CONSTANTS.VALIDATION_MESSAGES.VALIDATE_EMAIL),
    password: Joi.string()
      .required()
      .pattern(new RegExp(regex))
      .messages(CONSTANTS.VALIDATION_MESSAGES.VALIDTAE_PWD),
  },
};
export default {
  SignupSchema,
  SigninSchema,
  validateId,
  UpdateSchema,
};
