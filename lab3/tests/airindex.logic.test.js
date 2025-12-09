import { test } from "node:test";
import assert from "node:assert/strict";
import { computeAirIndex } from "../src/services/airindex.logic.js";

test("subindex = 1 when value == limit", () => {
  const res = computeAirIndex({
    pm25: 75,
    pm10: 150,
    no2: 200,
    so2: 100,
    o3: 160,
  });

  assert.equal(res.subIndices.pm25, 1);
  assert.equal(res.subIndices.pm10, 1);
});

test("at least one value required", () => {
  assert.throws(() => computeAirIndex({}), /Немає жодного/);
});