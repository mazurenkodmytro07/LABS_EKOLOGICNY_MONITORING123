import Measurement from '../models/Measurement.js';

export async function createMeasurement(req, res, next) {
  try {
    const payload = { ...req.body };
    if (!payload.timestamp) payload.timestamp = new Date();
    const doc = await Measurement.create(payload);
    res.status(201).json({ success: true, data: doc });
  } catch (e) { next(e); }
}

export async function listMeasurements(req, res, next) {
  try {
    const { stationId, city, pollutant, start, end, limit = 50, offset = 0 } = req.query;
    const filter = {};
    if (stationId) filter.station_id = stationId;
    if (start || end) {
      filter.timestamp = {};
      if (start) filter.timestamp.$gte = new Date(start);
      if (end) filter.timestamp.$lte = new Date(end);
    }
    if (pollutant) filter[pollutant] = { $ne: null };

    let query = Measurement.find(filter)
      .sort({ timestamp: -1 })
      .skip(Number(offset))
      .limit(Number(limit));

    if (city) {
      query = query.populate({ path: 'station_id', match: { city }, select: 'city name' });
    }

    const rows = await query.exec();
    const data = city ? rows.filter(r => r.station_id) : rows;

    res.json({ success: true, data });
  } catch (e) { next(e); }
}

export async function getMeasurement(req, res, next) {
  try {
    const doc = await Measurement.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Measurement not found' });
    res.json({ success: true, data: doc });
  } catch (e) { next(e); }
}

export async function updateMeasurement(req, res, next) {
  try {
    const doc = await Measurement.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ success: false, error: 'Measurement not found' });
    res.json({ success: true, data: doc });
  } catch (e) { next(e); }
}

export async function deleteMeasurement(req, res, next) {
  try {
    const doc = await Measurement.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Measurement not found' });
    res.json({ success: true, data: { _id: doc._id } });
  } catch (e) { next(e); }
}