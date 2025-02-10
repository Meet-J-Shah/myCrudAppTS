import { Router, Request, Response, NextFunction } from "express";
import { FileService } from "../service/file.service";
import { Multer } from "../utils/multer.utils";
//import { UserListRepository } from '../repositories';
const router = Router({ mergeParams: true });

router.get("/readSyncFile", FileService.fileSyncRead);
router.get("/readAsyncFile", FileService.fileAsyncRead);
router.get("/writeSyncFile", FileService.fileSyncWrite);
router.get("/writeAsyncFile", FileService.fileAsyncWrite);
router.get("/appendAsyncFile", FileService.fileAppend);
router.get("/deleteAsyncFile", FileService.fileDelete);

router.post("/uploadXlsxFile", Multer.multer(), FileService.fileUploadxlxs);

router.post("/uploadXlsxFile", FileService.fileUploadimg);
router.post("/uploadXlsxFile", FileService.fileUploadtext);
router.post("/uploadXlsxFile", FileService.fileUpload);

export default router;
