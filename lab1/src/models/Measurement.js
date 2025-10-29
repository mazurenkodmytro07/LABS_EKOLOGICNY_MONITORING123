import mongoose from 'mongoose';
const { Schema } = mongoose;

const MeasurementSchema = new Schema(
  {
    station_id: { type: Schema.Types.ObjectId, ref: 'Station', required: true, index: true },
    timestamp: { type: Date, required: true, index: true },
    pm25: { type: Number, min: 0 },
    pm10: { type: Number, min: 0 },
    no2: { type: Number, min: 0 },
    so2: { type: Number, min: 0 },
    o3:  { type: Number, min: 0 },
    co:  { type: Number, min: 0 },
    temp: { type: Number },
    hum:  { type: Number, min: 0, max: 100 },
    meta: { type: Object }
  },
  { timestamps: true }
);

MeasurementSchema.index({ station_id: 1, timestamp: -1 });

export default mongoose.model('Measurement', MeasurementSchema);