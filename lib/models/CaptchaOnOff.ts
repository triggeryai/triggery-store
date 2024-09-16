// lib/models/CaptchaOnOff.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface ICaptchaOnOff extends Document {
  isCaptchaEnabled: boolean;
  captchaKey: string;
}

const CaptchaOnOffSchema: Schema = new Schema({
  isCaptchaEnabled: { type: Boolean, required: true, default: true },
  captchaKey: { type: String, required: true }
});

const CaptchaOnOff: Model<ICaptchaOnOff> = mongoose.models?.CaptchaOnOff
  ? mongoose.models.CaptchaOnOff
  : mongoose.model<ICaptchaOnOff>('CaptchaOnOff', CaptchaOnOffSchema);

export default CaptchaOnOff;
