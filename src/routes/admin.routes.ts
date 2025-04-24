import {
  Router,
  // Request, Response
} from "express";
//import { UserListRepository } from '../repositories';
const router = Router({ mergeParams: true });
import { verifyUser } from "../middleware/authMiddleware";
import { verifyAdmin } from "../middleware/authMiddleware";
import authSchema from "../validation/auth.validate";
// import { UserService } from "../service";
import { celebrate } from "celebrate";
import UserController from "../controllers/users.controller";
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/AdminUnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/users", verifyUser, verifyAdmin, UserController.getUserList);
router.get(
  "/users/:id",
  verifyUser,
  verifyAdmin,
  celebrate(authSchema.validateId),
  UserController.getUserById
);
/**
 * @swagger
 * /create/users:
 *   post:
 *     summary: Create a new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/AdminValidationError'
 *       401:
 *         $ref: '#/components/responses/AdminUnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/create/user",
  verifyUser,
  verifyAdmin,
  celebrate(authSchema.UpdateSchema),
  UserController.createUser
);
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/AdminValidationError'
 *       401:
 *         $ref: '#/components/responses/AdminUnauthorizedError'
 *       404:
 *         description: User not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put(
  "/users/:id",
  verifyUser,
  verifyAdmin,
  celebrate(authSchema.validateId),
  celebrate(authSchema.UpdateSchema),
  UserController.updateUser
);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         $ref: '#/components/responses/AdminUnauthorizedError'
 *       404:
 *         description: User not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete(
  "/users/:id",
  verifyUser,
  verifyAdmin,
  celebrate(authSchema.validateId),
  UserController.deleteUser
);

export default router;
