"use strict";
import * as path from "path";
import * as User from "./user.model";
import { Sequelize, DataTypes } from "sequelize";
import environmentConfig from "../constants/environment.constant";
const env = environmentConfig.NODE_ENV;

const config = require(
  path.join(__dirname + "../../" + "db/config/config.json")
)[env];

const sequelize = new Sequelize(config);

export { Sequelize, sequelize, User };
