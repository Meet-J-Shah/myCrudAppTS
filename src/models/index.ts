'use strict';
import * as path from 'path';
import { Sequelize } from 'sequelize';
import environmentConfig from '../constants/environment.constant';

// Import models
import User from './user.model';

const env = environmentConfig.NODE_ENV;
const config = require(path.join(__dirname, '../../config/config.json'))[env];

// Initialize Sequelize
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: console.log, // Enable logging for debugging
});

// Initialize models
User.initModel(sequelize); // Properly initialize User model

// Sync database
sequelize.sync({ alter: true }) // Use { force: true } only in development if you want to drop & recreate tables
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.error("❌ Sync error:", err));

export { Sequelize, sequelize, User };
