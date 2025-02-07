import { Router, Request, Response } from 'express';
//import { LoginRepository, RegisterRepository } from '../repositories';
import{AuthService} from '../service'
const router = Router({ mergeParams: true });
import authSchema from '../validation/auth.validate';

import { celebrate } from 'celebrate';
//console.log(AuthService);

router.post('/login', celebrate(authSchema.SigninSchema), AuthService.login);
router.post('/register', celebrate(authSchema.SignupSchema), AuthService.register);

export default router;