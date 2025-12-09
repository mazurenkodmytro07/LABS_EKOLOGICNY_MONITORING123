import "dotenv/config";
import mongoose from "mongoose";
import { MONGODB_URI } from "../src/config/env.js";
import Station from "../src/models/Station.js";

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Mongo connected");

    await Station.deleteMany({});

    const stations = await Station.insertMany([
      {
        city: "Львів",
        name: "Львів-Сихів",
        latitude: 49.8397,
        longitude: 24.0297,
      },
      {
        city: "Одеса",
        name: "Одеса-Порт",
        latitude: 46.4825,
        longitude: 30.7233,
      },
      {
        city: "Дніпро",
        name: "Дніпро-Центр",
        latitude: 48.467,
        longitude: 35.04,
      },
      {
        city: "Харків",
        name: "Харків-Північний",
        latitude: 49.9935,
        longitude: 36.2304,
      },
      {
        city: "Київ",
        name: "Київ-Центр",
        latitude: 50.4501,
        longitude: 30.5234,
      },
      {
        city: "Львів",
        name: "Львів-Центр",
        latitude: 49.8420,
        longitude: 24.0316,
      },
      {
        city: "Львів",
        name: "Львів-Личаків",
        latitude: 49.8383,
        longitude: 24.0645,
      },
      {
        city: "Київ",
        name: "Київ-Троєщина",
        latitude: 50.5133,
        longitude: 30.6034,
      },
      {
        city: "Київ",
        name: "Київ-Оболонь",
        latitude: 50.5081,
        longitude: 30.4983,
      },
      {
        city: "Харків",
        name: "Харків-Індустріальний",
        latitude: 49.9469,
        longitude: 36.3894,
      },
      {
        city: "Одеса",
        name: "Одеса-Аркадія",
        latitude: 46.4316,
        longitude: 30.7608,
      },
      {
        city: "Дніпро",
        name: "Дніпро-Проспект",
        latitude: 48.4648,
        longitude: 35.0462,
      },
      {
        city: "Запоріжжя",
        name: "Запоріжжя-Центр",
        latitude: 47.8388,
        longitude: 35.1396,
      },
      {
        city: "Вінниця",
        name: "Вінниця-Центр",
        latitude: 49.2328,
        longitude: 28.4810,
      },
      {
        city: "Тернопіль",
        name: "Тернопіль-Центр",
        latitude: 49.5535,
        longitude: 25.5948,
      },
    ]);

    console.log("Seeded stations:", stations.length);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();