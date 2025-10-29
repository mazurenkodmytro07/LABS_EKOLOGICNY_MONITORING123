import Station from '../models/Station.js';

export async function createStation(req, res, next) {
  try {
    const station = await Station.create(req.body);
    res.status(201).json({ success: true, data: station });
  } catch (e) { next(e); }
}

export async function listStations(req, res, next) {
  try {
    const { city, active, limit = 50, offset = 0 } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (active !== undefined) filter.active = active === 'true';
    const data = await Station.find(filter)
      .skip(Number(offset)).limit(Number(limit)).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (e) { next(e); }
}

export async function getStation(req, res, next) {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) return res.status(404).json({ success: false, error: 'Station not found' });
    res.json({ success: true, data: station });
  } catch (e) { next(e); }
}

export async function updateStation(req, res, next) {
  try {
    const station = await Station.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!station) return res.status(404).json({ success: false, error: 'Station not found' });
    res.json({ success: true, data: station });
  } catch (e) { next(e); }
}

export async function deleteStation(req, res, next) {
  try {
    const station = await Station.findByIdAndDelete(req.params.id);
    if (!station) return res.status(404).json({ success: false, error: 'Station not found' });
    res.json({ success: true, data: { _id: station._id } });
  } catch (e) { next(e); }
}