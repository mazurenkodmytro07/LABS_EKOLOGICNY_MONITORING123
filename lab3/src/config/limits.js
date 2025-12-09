import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIMITS_FILE = path.join(__dirname, "limits.json");

let cachedLimits = null;

export function getLimits() {
  if (!cachedLimits) {
    const raw = fs.readFileSync(LIMITS_FILE, "utf8");
    cachedLimits = JSON.parse(raw);
  }
  return cachedLimits;
}

export function saveLimits(newLimits) {
  cachedLimits = newLimits;
  fs.writeFileSync(LIMITS_FILE, JSON.stringify(newLimits, null, 2), "utf8");
}

export function getClientLimits() {
  const src = getLimits();
  const out = {};
  for (const [k, v] of Object.entries(src)) {
    out[k] = { label: v.label, limit: v.limit, unit: v.unit || "µg/m³" };
  }
  return out;
}