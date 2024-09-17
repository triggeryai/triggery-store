// next-amazona-v2/lib/models/UserModel.ts
import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt'; // Importujemy bcrypt do hashowania haseł

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
  password: { type: String, required: true }, // Hasło będzie przechowywane jako zahashowane
  isActive: { type: Boolean, required: true, default: false },
  emailToken: { type: String, default: null },
  isAdmin: { type: Boolean, required: true, default: false },
  emailResetPassword: { type: String, default: null },
  passwordResetTokenExpires: { type: Date, default: null },
}, { timestamps: true });

// Middleware do hashowania hasła przed zapisaniem użytkownika
UserSchema.pre('save', async function (next) {
  const user = this as IUser;

  // Sprawdzamy, czy hasło zostało zmienione
  if (!user.isModified('password')) {
    return next();
  }

  // Generujemy sól i haszujemy hasło
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Metoda do porównywania wprowadzonego hasła z zahashowanym hasłem w bazie danych
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(candidatePassword, user.password);
};

// Mongoose model creation
const UserModel: Model<IUser> = 
  (mongoose.models && mongoose.models.User) 
    ? mongoose.models.User 
    : mongoose.model<IUser>('User', UserSchema);

export default UserModel;
