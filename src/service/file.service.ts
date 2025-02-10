import { Router, Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import environmentConfig from "../constants/environment.constant";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "node:path";
import CONSTANTS from "../constants/constant";
import {
  AuthFailureError,
  NotFoundError,
  BadRequestError,
  InternalError,
} from "../utils/error.handler";
import { SuccessResponse } from "../utils/successResponse.handler";
import fs from "node:fs";
import fs2 from "node:fs/promises";
import { Multer } from "../utils/multer.utils";
export class FileService {
  public static async fileSyncRead(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("before file  log");
      const filePath = path.resolve("public", "mj.txt");
      const data = fs.readFileSync(filePath, "utf8");
      console.log(data);
      console.log("After file  log");
      res.send(data);
    } catch (error: any) {
      next(error);
      return;
    }
  }
  public static async fileAsyncRead(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const filePath = path.resolve("public", "mj.txt");
      const data = await fs.promises.readFile(filePath, { encoding: "utf8" });
      const data2 = await fs2.readFile(filePath, { encoding: "utf8" });
      console.log(data2);
      //console.log(data);

      res.send(data);
    } catch (error: any) {
      next(error);
      return;
    }
  }
  public static async fileSyncWrite(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const myText = "Hi!\r\n";
      fs.writeFileSync("./foo.txt", myText);
      res.send("File written sucessfully..");
    } catch (error: any) {
      next(error);
      return;
    }
  }
  public static async fileAsyncWrite(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const content = "Some content!";
      await fs2.writeFile("test.txt", content);
      res.send("File written Asyncronuslly sucessfully..");
    } catch (error: any) {
      next(error);
      return;
    }
  }
  public static async fileAppend(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const filePath = path.resolve("public", "mj.txt");
      const content = "Some content!";
      await fs2.appendFile(filePath, content);
      res.send(
        `File Apended with content:- ${content} in a file ${filePath} sucessfully..`
      );
    } catch (error: any) {
      next(error);
      return;
    }
  }
  public static async fileDelete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await fs2.unlink("foo.txt");
      res.send(`File Deleted sucessfully..`);
    } catch (error: any) {
      next(error);
      return;
    }
  }
  public static async fileUploadxlxs(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const content = "File Uploading via xlsx!";
      console.log(content);
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      // Access uploaded file information
      const fileName = req.file.filename;
      const filePath = `uploads/${fileName}`;

      // Process the uploaded file (e.g., read, parse, etc.)
      // ...

      res.status(200).json({ message: "File uploaded successfully", fileName });
      return;
    } catch (error: any) {
      next(error);
      return;
    }
  }
  public static async fileUploadimg(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const content = "Images are uploading !";
      console.log(content);

      // Access uploaded file information

      // Process the uploaded file (e.g., read, parse, etc.)
      // ...

      res.status(200).json({ message: "Images uploaded successfully" });
      return;
    } catch (error: any) {
      next(error);
      return;
    }
  }
  public static async fileUploadtext(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const content = "Some content!";
    } catch (error: any) {
      next(error);
      return;
    }
  }
  public static async fileUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const content = "Some content!";
    } catch (error: any) {
      next(error);
      return;
    }
  }
}
