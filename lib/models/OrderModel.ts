// next-amazona-v2/lib/models/OrderModel.ts
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // User is optional
    },
    email: {
      type: String, // New field for guest user's email
      required: false, // This is optional, only used for guest checkout
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        qty: { type: Number, required: true },
        mainImage: { type: String }, // Added field for main image
        price: { type: Number, required: true },
        color: { type: String }, // Added field for product color
        size: { type: String },  // Added field for product size
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      shippingMethod: { type: String, required: true },
      selectedPaczkomat: { type: String }, // Optional field for selected Paczkomat
      selectedPocztex: { type: String },   // Optional field for selected Pocztex
      shippingCost: { type: Number, required: true }, // Added field for shipping cost
    },
    paymentMethod: { type: String, required: true },
    paymentResult: { id: String, status: String, email_address: String },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;

export type Order = {
  _id: string;
  user?: { name: string }; // User is optional
  email?: string; // Email for guest users
  items: [OrderItem];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    shippingMethod: string;
    selectedPaczkomat?: string;
    selectedPocztex?: string;
    shippingCost: number;
  };
  paymentMethod: string;
  paymentResult?: { id: string; status: string; email_address: string };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
};

export type OrderItem = {
  name: string;
  slug: string;
  qty: number;
  mainImage: string; // Added field for main image
  price: number;
  color: string; // Added field for product color
  size: string;  // Added field for product size
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  shippingMethod: string;
  selectedPaczkomat?: string;
  selectedPocztex?: string;
  shippingCost: number;
};
