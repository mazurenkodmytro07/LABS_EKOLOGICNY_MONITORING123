import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Station = mongoose.model("Station", stationSchema);
export default Station;