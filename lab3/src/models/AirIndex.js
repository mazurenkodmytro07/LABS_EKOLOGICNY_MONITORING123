import mongoose from "mongoose";

const valueSchema = {
  pm25: Number,
  pm10: Number,
  no2: Number,
  so2: Number,
  o3: Number,
};

const airIndexSchema = new mongoose.Schema(
  {
    stationId: { type: String, index: true },
    datetime: { type: Date, index: true },

    values: valueSchema,
    subIndices: valueSchema,

    I: Number,
    class: String,
    classCode: String,

    limits: mongoose.Schema.Types.Mixed,
    units: mongoose.Schema.Types.Mixed,

    hash: { type: String, index: true },
  },
  { timestamps: true }
);

const AirIndex = mongoose.model("AirIndex", airIndexSchema);

export default AirIndex;