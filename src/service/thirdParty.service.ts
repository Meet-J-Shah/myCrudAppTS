/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
/* eslint-disable @typescript-eslint/no-explicit-any*/
import CONSTANTS from "../constants/constant";
import axios from "axios";
import https from "node:https";
//import fetch2 from "node-fetch";
import superagent from "superagent";
//import got from "got";
import { SuccessResponse } from "../utils/successResponse.handler";
//import { number } from "joi";
export class ThirdPartyService {
  //basic http
  static async getAllUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      https
        .get("https://api.restful-api.dev/objects", (res) => {
          const data: any[] = [];
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
  //basic fatch
  static async fetchUse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!result.ok) throw new Error("Failed to fetch posts");
      const data = await result.json();
      // const data = { mj: "123" };
      res
        .status(200)
        .json(
          new SuccessResponse(
            true,
            CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.SIGN_SUCESS,
            CONSTANTS.RESPONSE_CODES.SUCCESS,
            data
          )
        );
      // res.status(200).json(new SuccessResponse(true, 'Signin successfully', 200, data));
      return;
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }

  static async fetchDataWithArrayHeader(
    apiUrl: string,
    array: string[]
  ): Promise<any> {
    try {
      const options: https.RequestOptions = {
        hostname: new URL(apiUrl).hostname,
        port: 443, // Assuming HTTPS
        path: new URL(apiUrl).pathname,
        method: "GET",
        headers: {
          "X-My-Array-Header": array.join(","), // Join array elements with comma
        },
      };

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.end();

      return new Promise((resolve, reject) => {
        req.end();
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
  static async getSomeUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const myArray: string[] = ["1", "5", "7"]; // Example array
      const apiUrl = "https://your-api-endpoint.com/data";
      const data = await ThirdPartyService.fetchDataWithArrayHeader(
        apiUrl,
        myArray
      );
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }

  //node -fetch:ESM required

  static async getOneUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: number = Number(req.params.id);
      const url: string = "https://api.restful-api.dev/objects";
      const finUrl: string = url + "/" + userId;
      console.log(finUrl);
      // const result = await fetch2(finUrl);
      const result = await axios.get(finUrl);
      const data = result.data;
      console.log("Posts:", data);
      res
        .status(200)
        .json(
          new SuccessResponse(
            true,
            CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.SIGN_SUCESS,
            CONSTANTS.RESPONSE_CODES.SUCCESS,
            data
          )
        );
      return;
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }

  //implement using axios
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const createData = req.body;

      const url: string = "https://api.restful-api.dev/objects";

      const result = await axios.post(url, createData);
      console.log("Data:", result.data);
      res
        .status(200)
        .json(
          new SuccessResponse(
            true,
            CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.SIGN_SUCESS,
            CONSTANTS.RESPONSE_CODES.SUCCESS,
            result.data
          )
        );
      // res.status(200).json(new SuccessResponse(true, 'Signin successfully', 200, data));
      return;
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
      const userId = req.params.id;
      const updateData = req.body;
      // console.log(updateData);
      // console.log(userId);
      const url: string = "https://api.restful-api.dev/objects";
      const finUrl: string = url + "/" + userId;
      console.log(finUrl);
      const result = await axios.put(finUrl, updateData);
      console.log("Posts:", result.data);
      res
        .status(200)
        .json(
          new SuccessResponse(
            true,
            CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.SIGN_SUCESS,
            CONSTANTS.RESPONSE_CODES.SUCCESS,
            result.data
          )
        );
      // res.status(200).json(new SuccessResponse(true, 'Signin successfully', 200, data));
      return;
    } catch (error: any) {
      console.log("meet");
      console.log(error);
      next(error);
      return;
    }
  }

  //got -- Not used because not useful in cjs onluy supports esm....
  static async patchUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const patchData = req.body;
      // console.log(updateData);
      // console.log(userId);
      const url: string = "https://api.restful-api.dev/objects";
      const finUrl: string = url + "/" + userId;
      console.log(finUrl);
      // const result = {};
      // const options = {
      //   body: patchData,
      //   // headers: {
      //   //   'Content-Type': 'text/plain'
      // };
      // const result = await got.post(finUrl, patchData);

      // console.log("Posts:", result);
      // const {data} = await got.post('https://httpbin.org/anything', {
      //   json: {
      //     hello: 'world'
      //   }
      // const result = await got.get(finUrl);
      // console.log(result);

      // res.status(200).json(new SuccessResponse(true, 'Signin successfully', 200, data));
      const result = await axios.patch(finUrl, patchData);
      console.log("Posts:", result.data);
      res
        .status(200)
        .json(
          new SuccessResponse(
            true,
            CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.SIGN_SUCESS,
            CONSTANTS.RESPONSE_CODES.SUCCESS,
            result.data
          )
        );
      return;
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }

  //superagent
  static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: number = Number(req.params.id);
      const url: string = "https://api.restful-api.dev/objects";
      const finUrl: string = url + "/" + userId;
      console.log(finUrl);
      const result = await superagent.delete(finUrl);
      console.log("Posts:", result);
      res
        .status(200)
        .json(
          new SuccessResponse(
            true,
            CONSTANTS.RESPONSE_MESSAGES.USER_RESPONSES.SIGN_SUCESS,
            CONSTANTS.RESPONSE_CODES.SUCCESS,
            result
          )
        );
      return;
    } catch (error: any) {
      console.log(error);
      next(error);
      return;
    }
  }
}

function reject(error: Error) {
  throw new Error("Function not implemented.");
}
function resolve(arg0: any) {
  throw new Error("Function not implemented.");
}
