// lib\models\BankAccountModel.ts
import mongoose, { Schema, model, models } from 'mongoose';

const bankAccountSchema = new Schema({
  accountNumber: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const BankAccount = models.BankAccount || model('BankAccount', bankAccountSchema);

export default BankAccount;
