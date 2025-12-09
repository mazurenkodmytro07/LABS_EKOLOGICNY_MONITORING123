import { PORT } from "./config/env.js";
import { connectDB } from "./config/db.js";
import app from "./app.js";

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Lab1 API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();