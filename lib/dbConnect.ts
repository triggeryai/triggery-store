// lib\dbConnect.ts
import mongoose from 'mongoose';
import ProductLackShowOnOff from '@/lib/models/ProductLackShowOnOff';
import { initEmailTemplates } from '@/lib/initEmailTemplates';

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    // Ensure there's a default entry in the ProductLackShowOnOff collection
    const status = await ProductLackShowOnOff.findOne();
    if (!status) {
      await ProductLackShowOnOff.create({ isOn: false });
    }

    // Initialize email templates if they do not exist
    await initEmailTemplates();

  } catch (error) {
    throw new Error('Connection failed!');
  }
}

export default dbConnect;
