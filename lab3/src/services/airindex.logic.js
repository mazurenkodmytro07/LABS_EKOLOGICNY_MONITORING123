import crypto from "crypto";
import { getLimits } from "../config/limits.js";

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n =
    typeof value === "number"
      ? value
      : Number(String(value).replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function computeAirIndex(payload = {}) {
  payload = Object.fromEntries(
    Object.entries(payload).map(([k, v]) => [k.toLowerCase(), v])
  );
  const limits = getLimits();

  const keys = ["pm25", "pm10", "no2", "so2", "o3"];

  const values = {};
  const subIndices = {};

  let sum = 0;
  let count = 0;

  for (const key of keys) {
    const lim = limits[key]?.limit;
    if (!lim || lim <= 0) {
      throw new Error(`Некоректний ліміт для ${key}`);
    }

    const c = toNumber(payload[key]);
    values[key] = c;

    if (c === null) {
      subIndices[key] = null;
      continue;
    }

    const I = c / lim;
    const rounded = Number(I.toFixed(3));

    subIndices[key] = rounded;
    sum += rounded;
    count += 1;
  }

  if (!count) {
    throw new Error("Немає жодного валідного показника");
  }

  const I = Number((sum / count).toFixed(3));

  let classCode = "good";
  let classLabel = "Добре";

  if (I > 1 && I <= 1.5) {
    classCode = "moderate";
    classLabel = "Помірне забруднення";
  } else if (I > 1.5 && I <= 2) {
    classCode = "unhealthy";
    classLabel = "Шкідливо";
  } else if (I > 2) {
    classCode = "very-unhealthy";
    classLabel = "Дуже шкідливо";
  }

  const units = {};
  for (const [k, v] of Object.entries(limits)) {
    units[k] = v.unit || "µg/m³";
  }

  const hash = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        values,
        limits: Object.fromEntries(
          Object.entries(limits).map(([k, v]) => [k, v.limit])
        ),
      })
    )
    .digest("hex");

  return {
    values,
    subIndices,
    I,
    class: classLabel,
    classCode,
    limits,
    units,
    hash,
  };
}

export default computeAirIndex;