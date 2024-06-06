// lib\models\ConfigModel.ts
import mongoose, { Document, Model } from 'mongoose';

export interface IConfig extends Document {
  hideOutOfStockProducts: boolean;
}

const ConfigSchema = new mongoose.Schema({
  hideOutOfStockProducts: { type: Boolean, required: true, default: false },
}, { timestamps: true });

const ConfigModel: Model<IConfig> = mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema);

export default ConfigModel;
