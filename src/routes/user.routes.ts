/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response } from "express";
//import { UserListRepository } from '../repositories';
const router = Router({ mergeParams: true });
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware";
import authSchema from "../validation/auth.validate";
import { UserService } from "../service";
import { celebrate } from "celebrate";

router.get("/userlist", verifyUser, UserService.getUserList);

export default router;
