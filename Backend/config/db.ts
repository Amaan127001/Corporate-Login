import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (e) {
    console.error("❌ DB connection error:", e);
    process.exit(1);
  }
};

export default connectToDB;
export const disconnectFromDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB Atlas");
  } catch (e) {
    console.error("❌ DB disconnection error:", e);
  }
};