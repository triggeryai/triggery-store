// lib\dbConnect.ts
import mongoose from 'mongoose';
import ProductLackShowOnOff from '@/lib/models/ProductLackShowOnOff';

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    // Ensure there's a default entry in the database
    const status = await ProductLackShowOnOff.findOne();
    if (!status) {
      await ProductLackShowOnOff.create({ isOn: false });
    }
  } catch (error) {
    throw new Error('Connection failed!');
  }
}

export default dbConnect;
