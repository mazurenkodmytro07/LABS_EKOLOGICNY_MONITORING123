import mongoose from 'mongoose';
import 'dotenv/config.js';
import Station from '../src/models/Station.js';
import Measurement from '../src/models/Measurement.js';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eco_lab1';

function rand(min, max, digits = 1) {
  const n = Math.random() * (max - min) + min;
  return Number(n.toFixed(digits));
}

function isoMinusHours(h) {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
}

async function run() {
  console.log('Підключення до бази...');
  await mongoose.connect(uri, {});

  await Measurement.deleteMany({});
  await Station.deleteMany({});
  console.log('Попередні дані видалено');

  const stations = await Station.insertMany([
    {
      name: 'Київ-Центр',
      city: 'Київ',
      latitude: 50.4501,
      longitude: 30.5234,
      measurement_types: ['pm25', 'pm10', 'no2', 'temp', 'hum'],
    },
    {
      name: 'Львів-Сихів',
      city: 'Львів',
      latitude: 49.8397,
      longitude: 24.0297,
      measurement_types: ['pm25', 'pm10', 'so2', 'temp', 'hum'],
    },
    {
      name: 'Харків-Північний',
      city: 'Харків',
      latitude: 49.9935,
      longitude: 36.2304,
      measurement_types: ['pm25', 'pm10', 'no2', 'o3', 'temp', 'hum'],
    },
    {
      name: 'Одеса-Порт',
      city: 'Одеса',
      latitude: 46.4825,
      longitude: 30.7233,
      measurement_types: ['pm25', 'pm10', 'so2', 'temp', 'hum'],
    },
    {
      name: 'Дніпро-Центр',
      city: 'Дніпро',
      latitude: 48.467,
      longitude: 35.04,
      measurement_types: ['pm25', 'pm10', 'no2', 'temp', 'hum'],
    }
  ]);

  console.log(`Створено станції: ${stations.map(s => s.city).join(', ')}`);

  const docs = [];
  for (const s of stations) {
    for (let h = 24; h >= 1; h--) {
      const base = {
        station_id: s._id,
        timestamp: isoMinusHours(h),
        temp: rand(5, 25, 1),
        hum: rand(40, 90, 0),
      };

      if (s.measurement_types.includes('pm25')) base.pm25 = rand(5, 50, 1);
      if (s.measurement_types.includes('pm10')) base.pm10 = rand(10, 80, 1);
      if (s.measurement_types.includes('no2')) base.no2 = rand(5, 70, 1);
      if (s.measurement_types.includes('o3')) base.o3 = rand(10, 120, 1);
      if (s.measurement_types.includes('so2')) base.so2 = rand(2, 40, 1);

      docs.push(base);
    }
  }

  await Measurement.insertMany(docs);
  console.log(`Вставлено вимірювань: ${docs.length}`);

  await mongoose.disconnect();
  console.log('Seed завершено успішно');
}

run().catch(err => {
  console.error('Помилка seed:', err);
  process.exit(1);
});