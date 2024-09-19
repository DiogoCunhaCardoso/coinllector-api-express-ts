import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

const connectDB = async () => {
  const DB_URI = config.get<string>("DB_URI");

  try {
    await mongoose.connect(DB_URI);
    logger.info("Connected to DB");
  } catch (e: any) {
    logger.error(`Could not connect to DB: ${e.message}`);
    process.exit(1);
  }
};

export default connectDB;
