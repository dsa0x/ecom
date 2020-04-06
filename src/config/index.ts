import dotenv from "dotenv";
import { Config } from "../types";
dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const config: Config = {
  port: parseInt(process.env.PORT) || 7000,
  mongoDbUrl: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT,
};

export default config;
