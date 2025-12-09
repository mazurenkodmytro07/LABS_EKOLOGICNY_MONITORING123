import Station from "../models/Station.js";

export async function listStations(req, res, next) {
  try {
    const stations = await Station.find().sort({ city: 1, name: 1 });
    res.json({ success: true, data: stations });
  } catch (err) {
    next(err);
  }
}

export async function createStation(req, res, next) {
  try {
    const body = req.body;

    const station = await Station.create({
      city: body.city,
      name: body.name,
      latitude: body.latitude,
      longitude: body.longitude,
      active: body.active ?? true,
    });

    res.status(201).json({ success: true, data: station });
  } catch (err) {
    next(err);
  }
}

export async function updateStation(req, res, next) {
  try {
    const { id } = req.params;
    const body = req.body;

    const station = await Station.findByIdAndUpdate(
      id,
      {
        city: body.city,
        name: body.name,
        latitude: body.latitude,
        longitude: body.longitude,
        active: body.active ?? true,
      },
      { new: true }
    );

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Станцію не знайдено",
      });
    }

    res.json({ success: true, data: station });
  } catch (err) {
    next(err);
  }
}

export async function deleteStation(req, res, next) {
  try {
    const { id } = req.params;

    const station = await Station.findByIdAndDelete(id);
    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Станцію не знайдено",
      });
    }

    res.json({ success: true, data: { _id: id } });
  } catch (err) {
    next(err);
  }
}