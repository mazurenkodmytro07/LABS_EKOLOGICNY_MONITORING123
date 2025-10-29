import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGO_DB_URI ?? env.MONGODB_URI);
  console.log('MongoDB connected');
}