import mongoose from 'mongoose';

const StationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, index: true },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    active: { type: Boolean, default: true, index: true },
    measurement_types: [{
      type: String,
      enum: ['pm25','pm10','no2','so2','o3','co','temp','hum']
    }],
    contact: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

StationSchema.index({ city: 1, active: 1 });

export default mongoose.model('Station', StationSchema);