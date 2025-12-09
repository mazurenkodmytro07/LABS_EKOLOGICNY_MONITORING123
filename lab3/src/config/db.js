import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    if (!env.mongoUri) {
      throw new Error("MONGODB_URI не задано в .env");
    }

    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected (lab3)");
  } catch (err) {
    console.error("DB error:", err);
    throw err;
  }
}