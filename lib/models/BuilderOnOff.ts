// lib/models/BuilderOnOff.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IBuilderOnOff extends Document {
  isBuilderEnabled: boolean;
}

const BuilderOnOffSchema: Schema = new Schema({
  isBuilderEnabled: { type: Boolean, required: true, default: false }
});

const BuilderOnOff: Model<IBuilderOnOff> = mongoose.models?.BuilderOnOff
  ? mongoose.models.BuilderOnOff
  : mongoose.model<IBuilderOnOff>('BuilderOnOff', BuilderOnOffSchema);

export default BuilderOnOff;
