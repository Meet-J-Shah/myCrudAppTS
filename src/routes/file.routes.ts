import { Router, Request, Response } from "express";
import { FileService } from "../service/file.service";
//import { UserListRepository } from '../repositories';
const router = Router({ mergeParams: true });

router.get("/readSyncFile", FileService.fileSyncRead);
router.get("/readAsyncFile", FileService.fileAsyncRead);
router.get("/writeSyncFile", FileService.fileSyncWrite);
router.get("/writeAsyncFile", FileService.fileAsyncWrite);
router.get("/appendAsyncFile", FileService.fileAppend);
router.get("/deleteAsyncFile", FileService.fileDelete);

export default router;
