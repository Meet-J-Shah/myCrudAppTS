import {
  Router,
  // Request, Response
} from "express";
//import { LoginRepository, RegisterRepository } from '../repositories';
import { AuthService } from "../service";
const router = Router({ mergeParams: true });
import authSchema from "../validation/auth.validate";

import { celebrate } from "celebrate";

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/AdminValidationError'
 *       401:
 *         $ref: '#/components/responses/AdminUnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/login", celebrate(authSchema.SigninSchema), AuthService.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         $ref: '#/components/responses/AdminValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/register",
  celebrate(authSchema.SignupSchema),
  AuthService.register
);

export default router;
