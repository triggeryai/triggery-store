// next-amazona-v2/lib/models/UserModel.ts
import mongoose, { Document, Model } from 'mongoose';

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
  password: { type: String, required: true }, // Hasło przechowywane jako zwykły tekst
  isActive: { type: Boolean, required: true, default: false },
  emailToken: { type: String, default: null },
  isAdmin: { type: Boolean, required: true, default: false },
  emailResetPassword: { type: String, default: null },
  passwordResetTokenExpires: { type: Date, default: null },
}, { timestamps: true });

// Usunięcie middleware do hashowania hasła
// Usuwamy automatyczne hashowanie hasła przed zapisem

// Usunięcie metody porównującej hasło, ponieważ nie ma już hashowania
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // Zamiast porównywania hashowanych haseł, bezpośrednio porównujemy zwykły tekst
  return candidatePassword === this.password;
};

// Mongoose model creation
const UserModel: Model<IUser> = 
  (mongoose.models && mongoose.models.User) 
    ? mongoose.models.User 
    : mongoose.model<IUser>('User', UserSchema);

export default UserModel;
