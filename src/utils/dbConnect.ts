import mongoose from "mongoose";
import logger from "./logger";
import { config } from "../constants/env";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info("Connected to DB");
  } catch (e: any) {
    logger.error(`Could not connect to DB: ${e.message}`);
    process.exit(1);
  }
};

export default connectDB;
