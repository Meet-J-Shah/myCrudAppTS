import { Router, Request, Response } from 'express';
//import { UserListRepository } from '../repositories';
const router = Router({ mergeParams: true });
import { verifyUser} from '../middleware/authMiddleware';
import { verifyAdmin } from '../middleware/authMiddleware';
import authSchema from '../validation/auth.validate';
import { UserService } from '../service';
import { celebrate } from 'celebrate';
import UserController from '../controllers/users.controller'
router.get('/users', verifyUser, verifyAdmin, UserController.getUserList);
router.get('/users/:id', verifyUser, verifyAdmin, celebrate(authSchema.validateId), UserController.getUserById);
router.put(
  '/users/:id',
  verifyUser,
  verifyAdmin,
  celebrate(authSchema.validateId),
  celebrate(authSchema.UpdateSchema),
  UserController.updateUser,
);
router.delete('/users/:id', verifyUser, verifyAdmin, celebrate(authSchema.validateId), UserController.deleteUser);

export default router;