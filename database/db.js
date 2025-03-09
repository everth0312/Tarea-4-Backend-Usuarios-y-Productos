import { configDotenv  } from "dotenv";
import { Sequelize } from "sequelize";

configDotenv();

export class Database {
    db;
    constructor() {
        if (this.db) {
            return this.db;
        }
        this.db = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            sync: true,
            dialect:"mysql"
          });
    }

async setup() {
    try {
        await this.db.authenticate();
        console.log('DB Connected');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
}