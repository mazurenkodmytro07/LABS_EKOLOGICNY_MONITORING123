import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 4000;
const URI = process.env.MONGODB_URI;

async function start() {
  try {
    await mongoose.connect(URI);
    console.log("Mongo connected");
    app.listen(PORT, () => {
      console.log(`Lab3 API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB error:", err);
    process.exit(1);
  }
}

start();