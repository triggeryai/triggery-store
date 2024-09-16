// next-amazona-v2/lib/models/DiscountModel.ts
import mongoose, { Schema, Document } from 'mongoose';

// Typ dla rabatów
interface IDiscount extends Document {
  type: string; // "fixed" (kwotowy) lub "free_shipping"
  value: number; // Kwota rabatu (np. 10 zł, 20 zł), dla darmowej wysyłki wartość = 0
  isActive: boolean; // Czy rabat jest aktywny
  users: string[] | 'all'; // Lista użytkowników (array z ID użytkowników) lub "all" dla wszystkich użytkowników
  expirationDate?: Date; // Data wygaśnięcia rabatu (opcjonalnie)
  code?: string; // Kod rabatowy (opcjonalnie)
}

const DiscountSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['fixed', 'free_shipping'], // Typ rabatu: kwotowy lub darmowa wysyłka
    required: true,
  },
  value: {
    type: Number,
    required: true, // Wartość rabatu (dla darmowej wysyłki to 0)
  },
  isActive: {
    type: Boolean,
    default: true, // Czy rabat jest aktywny
  },
  users: {
    type: [String], // Lista użytkowników, jeśli dotyczy wybranych
    default: 'all', // Dla wszystkich użytkowników, jeśli nie podano konkretnej listy
  },
  expirationDate: {
    type: Date, // Data wygaśnięcia rabatu (opcjonalnie)
    required: false,
  },
  code: {
    type: String, // Kod rabatowy, który administrator może ustawić (opcjonalnie)
    required: false,
  },
});

const DiscountModel = mongoose.models.Discount || mongoose.model<IDiscount>('Discount', DiscountSchema);
export default DiscountModel;
