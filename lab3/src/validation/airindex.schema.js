import { z } from "zod";

function numOrNull() {
  return z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return null;

    const n = Number(String(v).replace(",", "."));
    if (!Number.isFinite(n) || n < 0) return null;
    return n;
  }, z.number().nonnegative().nullable());
}

export const airIndexSchema = z.object({
  stationId: z.string().optional().nullable(),
  datetime: z.string().optional().nullable(),

  pm25: numOrNull(),
  pm10: numOrNull(),
  no2: numOrNull(),
  so2: numOrNull(),
  o3: numOrNull(),
});