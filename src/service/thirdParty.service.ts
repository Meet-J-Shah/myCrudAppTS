import { Request, Response, NextFunction } from "express";
import { any } from "joi";
import https from "node:https";

export class ThirdPartyService {
  static async getAllUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      https
        .get("https://api.restful-api.dev/objects", (res) => {
          let data: any[] = [];
          const headerDate =
            res.headers && res.headers.date
              ? res.headers.date
              : "no response date";
          console.log("Status Code:", res.statusCode);
          console.log("Date in Response header:", headerDate);

          res.on("data", (chunk) => {
            data.push(chunk);
          });

          res.on("end", () => {
            console.log("Response ended: ");
            const users = JSON.parse(Buffer.concat(data).toString());

            users.forEach((element: any) => {
              console.log(
                `Got user with id: ${element.id}, name: ${element.name}`
              );
            });
          });
        })
        .on("error", (err) => {
          console.log("Error: ", err.message);
          throw err;
        });
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }

  static async getSomeUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId2 = req.query.id;

      const res = await fetch("https://api.restful-api.dev/objects");
      const headerDate =
        res.headers && res.headers.get("date")
          ? res.headers.get("date")
          : "no response date";
      console.log("Status Code:", res.status);
      console.log("Date in Response header:", headerDate);

      const users = await res.json();

      for (user of users) {
        console.log(`Got user with id: ${user.id}, name: ${user.name}`);
      }
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }
  static async getOneUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: number = Number(req.params.id);
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      const requestUrl: string =
        "https://api.restful-api.dev/objects/${userid}";
      xhr.open("GET", requestUrl, true);
      xhr.onload = function () {
        console.log(xhr.responseText);
        // Handle data
      };
      xhr.send();
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //const userData: User = req.body;
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }
  static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: number = Number(req.params.id);
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }
  static async patchUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: number = Number(req.params.id);
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }
  static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: number = Number(req.params.id);
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }
}
