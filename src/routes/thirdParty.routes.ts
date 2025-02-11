import { Router } from "express";
import { ThirdPartyService } from "../service/thirdParty.service";
const router = Router({ mergeParams: true });

router.get("/getAllUser", ThirdPartyService.getAllUser);
router.get("/getSomeUser", ThirdPartyService.getSomeUser);
router.get("/getOneUser/:id", ThirdPartyService.getOneUser);
router.post("/createUser", ThirdPartyService.createUser);
router.put("/updateUser/:id", ThirdPartyService.updateUser);
router.patch("/patchUser/:id", ThirdPartyService.patchUser);
router.delete("/deleteUser/:id", ThirdPartyService.deleteUser);
router.get("/fetchUse", ThirdPartyService.fetchUse);
export default router;
