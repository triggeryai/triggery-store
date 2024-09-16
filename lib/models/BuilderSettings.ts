// lib/models/BuilderSettings.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IBuilderSettings extends Document {
  headerClasses: string;
  // Dodaj inne ustawienia, które chcesz przechowywać
}

const BuilderSettingsSchema: Schema = new Schema({
  headerClasses: { type: String, required: true, default: 'navbar justify-between bg-base-300' },
  // Dodaj inne pola
});

const BuilderSettings: Model<IBuilderSettings> = mongoose.models?.BuilderSettings
  ? mongoose.models.BuilderSettings
  : mongoose.model<IBuilderSettings>('BuilderSettings', BuilderSettingsSchema);

export default BuilderSettings;
