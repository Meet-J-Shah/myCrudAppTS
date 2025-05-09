import auth from "./auth.routes";
import user from "./user.routes";
import admin from "./admin.routes";
import file from "./file.routes";
import thirdParty from "./thirdParty.routes";
import { Router } from "express";
import { Request, Response } from "express";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Status Check");
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/admin", admin);
router.use("/file", file);
router.use("/thirdParty", thirdParty);
export default router;
