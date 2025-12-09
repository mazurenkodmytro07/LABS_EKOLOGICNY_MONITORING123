import Measurement from "../models/Measurement.js";
import Station from "../models/Station.js";

export async function listMeasurements(req, res, next) {
  try {
    const { stationId } = req.query;
    const query = {};
    if (stationId) query.stationId = stationId;

    const items = await Measurement.find(query)
      .populate("Station", "city name")
      .sort({ datetime: -1 });

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function createMeasurement(req, res, next) {
  try {
    const body = req.body;

    const station = await Station.findById(body.stationId);
    if (!station) throw new Error("Станцію не знайдено");

    const m = await Measurement.create({
      stationId: body.stationId,
      datetime: body.datetime ? new Date(body.datetime) : new Date(),
      pm25: body.pm25,
      pm10: body.pm10,
      no2: body.no2,
      so2: body.so2,
      o3: body.o3,
    });

    res.status(201).json({ success: true, data: m });
  } catch (err) {
    next(err);
  }
}