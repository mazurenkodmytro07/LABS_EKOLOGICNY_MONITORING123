import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema(
  {
    stationId: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
    datetime: { type: Date, required: true },

    pm25: Number,
    pm10: Number,
    no2: Number,
    so2: Number,
    o3: Number
  },
  { timestamps: true }
);

const Measurement = mongoose.model("Measurement", measurementSchema);
export default Measurement;