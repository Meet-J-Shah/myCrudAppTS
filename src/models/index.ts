"use strict";
import * as path from "path";
import * as User from "./user.model";
import {
  Sequelize,
  //DataTypes
} from "sequelize";
//import environmentConfig from "../constants/environment.constant";

const env: string = process.env.NODE_ENV || "development";
// const config: any = require(
//   path.join(__dirname, "../../", "db/config/config.json")
// )[env];
// const config = require(
//   path.join(__dirname + "../../" + "db/config/config.json")
// )[env];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: Record<string, any> =
  //eslint-disable-next-line @typescript-eslint/no-require-imports
  require(path.join(__dirname + "../../" + "db/config/config.json"))[env];
const sequelize = new Sequelize(config);

export { Sequelize, sequelize, User };
