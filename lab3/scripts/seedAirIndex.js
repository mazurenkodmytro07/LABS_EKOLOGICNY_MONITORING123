import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import AirIndex from "../src/models/AirIndex.js";
import { computeAirIndex } from "../src/services/airindex.logic.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URI = process.env.MONGODB_URI;

async function run() {
  try {
    if (!URI) throw new Error("MONGODB_URI is not set in .env");

    await mongoose.connect(URI);
    console.log("Mongo connected");

    const seedPath = path.join(__dirname, "../seed/airindex.seed.json");
    const raw = fs.readFileSync(seedPath, "utf8");
    const items = JSON.parse(raw);

    await AirIndex.deleteMany({});
    console.log("AirIndex collection cleared");

    const docs = [];

    for (const item of items) {
      const payload = { ...item };
      const keys = ["pm25", "pm10", "no2", "so2", "o3"];
      if (Math.random() < 0.3) {
        const k = keys[Math.floor(Math.random() * keys.length)];
        payload[k] = null;
      }

      const { stationId, datetime, ...values } = payload;
      const calc = computeAirIndex(values);

      const doc = await AirIndex.create({
        stationId,
        datetime: new Date(datetime),
        values: calc.values,
        subIndices: calc.subIndices,
        I: calc.I,
        class: calc.class,
        classCode: calc.classCode,
        limits: calc.limits,
        units: calc.units,
        hash: calc.hash
      });

      docs.push(doc);
    }

    console.log(`Inserted ${docs.length} AirIndex documents`);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();