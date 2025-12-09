import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AirIndex from "../models/AirIndex.js";
import { computeAirIndex } from "../services/airindex.logic.js";
import { getClientLimits, saveLimits, getLimits } from "../config/limits.js";
import { airIndexSchema } from "../validation/airindex.schema.js";
import { ZodError } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function calcAirIndex(req, res, next) {
  try {
    const payload = airIndexSchema.parse(req.body);

    const result = computeAirIndex(payload);

    const stationId = payload.stationId || null;
    const datetime = payload.datetime ? new Date(payload.datetime) : new Date();

    let doc = await AirIndex.findOne({
      stationId,
      hash: result.hash,
      datetime,
    });

    if (!doc) {
      doc = await AirIndex.create({
        stationId,
        datetime,
        values: result.values,
        subIndices: result.subIndices,
        I: result.I,
        class: result.class,
        classCode: result.classCode,
        limits: result.limits,
        units: result.units,
        hash: result.hash,
      });
    }

    const logPath = path.join(__dirname, "../../logs/airindex.log");
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(
      logPath,
      JSON.stringify(
        {
          at: new Date().toISOString(),
          stationId: doc.stationId,
          I: doc.I,
          class: doc.class,
          hash: doc.hash,
        },
        null,
        0
      ) + "\n",
      "utf8"
    );

    res.json({
      success: true,
      data: {
        ...result,
        _id: doc._id,
        stationId: doc.stationId,
        datetime: doc.datetime,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Помилка валідації вхідних даних",
        details: err.errors,
      });
    }
    next(err);
  }
}

export async function historyByStation(req, res, next) {
  try {
    const { stationId, limit = 20 } = req.query;

    const query = {};
    if (stationId) query.stationId = stationId;

    const docs = await AirIndex.find(query)
      .sort({ datetime: -1 })
      .limit(Number(limit));

    res.json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
}

export function getLimitsApi(req, res) {
  res.json({ success: true, data: getClientLimits() });
}

export function updateLimitsApi(req, res, next) {
  try {
    const body = req.body;
    const current = getLimits();

    for (const [k, v] of Object.entries(body)) {
      if (!v || typeof v.limit !== "number" || v.limit <= 0) {
        throw new Error(`Некоректний ліміт для ${k}`);
      }
    }

    const updated = { ...current, ...body };
    saveLimits(updated);

    res.json({ success: true, data: getClientLimits() });
  } catch (err) {
    next(err);
  }
}