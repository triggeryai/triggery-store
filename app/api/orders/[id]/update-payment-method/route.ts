// app\api\orders\[id]\update-payment-method/route.ts
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { auth } from '@/lib/auth';

export const PUT = auth(async (req, res) => {
  await dbConnect();

  const orderId = req.query.id;
  const { newPaymentMethod } = req.body;

  const allowedPaymentMethods = ['PayPal', 'Stripe'];

  if (!allowedPaymentMethods.includes(newPaymentMethod)) {
    return res.status(400).json({ message: 'Invalid payment method' });
  }

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { paymentMethod: newPaymentMethod },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ message: 'Error updating payment method', error: error.message });
  }
});
