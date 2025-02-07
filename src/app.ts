import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import * as db from './models';
import environmentConfig from './constants/environment.constant';

dotenv.config();
console.log(`🌍 Environment: ${environmentConfig.NODE_ENV}`);
console.log(`🚀 Server starting on port: ${environmentConfig.PORT}`);

export class App {
  private app: Application = express();

  constructor() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public async listen() {
    try {
      console.log("🔄 Connecting to database...");
      await db.sequelize.authenticate();
      console.log("✅ Database connected");

      console.log("🔄 Syncing database...");
      await db.sequelize.sync({ alter: true }); // Update schema if needed
      console.log("✅ Database synced");

      this.app.listen(environmentConfig.PORT, () => {
        console.log(`🚀 Server running on port ${environmentConfig.PORT}`);
      });
    } catch (error) {
      console.error("❌ Error initializing application:", error);
    }
  }
}
