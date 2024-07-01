import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// TypeScript interface to define the User properties
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  emailToken: string | null;
  isAdmin: boolean;
  emailResetPassword: string | null;
  passwordResetTokenExpires: Date | null;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

// Mongoose schema definition for the User
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: false },
  emailToken: { type: String, default: null },
  isAdmin: { type: Boolean, required: true, default: false },
  emailResetPassword: { type: String, default: null },
  passwordResetTokenExpires: { type: Date, default: null },
}, { timestamps: true });

// Pre-save middleware to hash the password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Mongoose model creation
const UserModel: Model<IUser> = 
  (mongoose.models && mongoose.models.User) 
    ? mongoose.models.User 
    : mongoose.model<IUser>('User', UserSchema);

export default UserModel;
