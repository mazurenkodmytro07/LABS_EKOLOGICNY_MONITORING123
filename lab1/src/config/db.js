import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected (lab1)");
}